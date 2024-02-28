/* eslint-disable jsdoc/no-undefined-types */
/* eslint-disable no-loop-func, operator-linebreak */
import { Element } from './Element.js';
import { Document } from './Document.js';
import { TextNode } from './TextNode.js';
import { CDataNode } from './CDataNode.js';
import { unescape } from './unescape.js';
import { unquote } from './unquote.js';

const reAttr = /^\s*([^=\s&]+)(?:\s*=\s*("[^"]+"|'[^']+'|[^>\s]+))?/;
const reComment = /^<!--([^\0]+?)-->/;
const reEndTag = /^<\/([^>\s]+)\s*>/;
const reDocType = /^<!([^->\s/[]*)(\s[^>]+?)?(\/?)>/;
const reTag = /^<([^!>\s/#&]+)(\s[^>]*?)?(\/?)>/;
const reDecl = /^<\?xml(?: ([a-z0-9 =."'-]*?))?\?>/i;
const reInstr = /^<\?([^>]*)\?>/i;
const reWS = /^[ \t\r\n]+/;
const reWSAny = /[ \r\n\t]+/g;
const reCData = /^<!\[CDATA\[([^\0]*?)\]\]>/;

const DEFAULTOPTIONS = {
  emptyDoc: false,
  laxAttr: false
};

/**
 * @ignore
 * @param {string} s { parameter_description }
 * @param {boolean} [laxAttr=false] The lax attribute
 * @returns {Record<string, string>} { description_of_the_return_value }
 */
function parseAttr (s, laxAttr = false) {
  let m;
  const r = /** @type {Record<string, string>} */({});
  if (s) {
    do {
      m = reAttr.exec(s);
      if (m) {
        // 3.3.3
        const val = unescape(unquote(m[2] || '', laxAttr))
          .replace(reWSAny, ' ')
          .trim();
        r[m[1]] = val;
        s = s.slice(m[0].length);
        if (s.length && /^\S/.test(s[0])) {
          throw new Error('Attribute error');
        }
      }
    }
    while (m && s.length);
    if (/\S/.test(s)) {
      throw new Error('Attribute error');
    }
  }
  return r;
}

/**
 * @ignore
 * @param {number} pos The position
 * @param {string} src The source
 * @returns {number} { description_of_the_return_value }
 */
function posToLine (pos, src) {
  return src.slice(0, pos).replace(/[^\n]+/g, '').length;
}

/**
 * @callback ParseHandler
 * @param {...string} args
 * @returns {boolean}
 * @ignore
 */

/**
 * Parse an XML source and return a Node tree.
 *
 * @param {string} source The XML source to parse.
 * @param {object} [options={}] Parsing options.
 * @param {boolean} [options.emptyDoc=false] Permit "rootless" documents.
 * @param {boolean} [options.laxAttr=false] Permit unquoted attributes (`<node foo=bar />`).
 * @returns {Document} A DOM representing the XML node tree.
 */
export function parseXML (source, options = DEFAULTOPTIONS) {
  // 2.11: before parsing, translate both the two-character sequence
  // \r \n and any \r that is not followed by \n to a single \n
  const xml = String(source)
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n');

  let pos = 0;
  const length = xml.length;
  /** @type {Element|null} */
  let root = null;
  let current = null;

  /**
   * @ignore
   * @param {string} char The character to look for
   * @param {ParseHandler} [parse] A handler for the match
   * @returns {boolean} Was a match found?
   */
  function scanUntil (char, parse) {
    const s = pos;
    do {
      const c = xml[pos];
      if (c === char) {
        parse(xml.slice(s, pos));
        return true;
      }
      pos++;
    }
    while (pos < length);
    return false;
  }

  /**
   * @ignore
   * @param {RegExp} re The expression to look for
   * @param {ParseHandler} [parse] A handler for the match
   * @returns {boolean} Was a match found?
   */
  function maybeMatch (re, parse) {
    const m = re.exec(xml.slice(pos));
    if (m) {
      pos += m[0].length;
      if (parse) {
        return parse(...m);
      }
    }
    return !!m;
  }

  function scanIgnorables () {
    let m;
    do {
      m = (
        maybeMatch(reWS)
        ||
        maybeMatch(reInstr)
        ||
        maybeMatch(reComment)
      );
    }
    while (m);
  }

  // BOM
  if (xml.charCodeAt(pos) === 65279) {
    pos++;
  }

  maybeMatch(reWS);

  // -- prolog --
  // optional: declaration
  maybeMatch(reDecl, (_, a) => {
    // MUST: have version
    const attr = parseAttr(a, options.laxAttr);
    if (!attr.version) {
      throw new Error('XML missing version');
    }
    return null;
  });

  // optional: Comment | PI <?xml...?> | WS
  scanIgnorables();
  maybeMatch(reDocType);
  scanIgnorables();

  // root tag
  maybeMatch(reTag, (_, t, a, c) => {
    return !!(root = new Element(t, parseAttr(a, options.laxAttr), !!c));
  });

  if (!root && !options.emptyDoc) {
    throw new Error('no root tag found');
  }

  current = root;

  // root tag content
  if (root && !root.closed) {
    let some = false;
    let lastPos = pos;
    do {
      lastPos = pos;
      some = (
        maybeMatch(reComment)
        ||
        maybeMatch(reInstr)
        ||
        maybeMatch(reCData, (_, c) => (
          !!current.appendChild(new CDataNode(c))
        ))
        ||
        maybeMatch(reEndTag, (_, t) => {
          // the thing being closed must be the parent
          if (t.trim() === current.fullName) {
            current = current.parentNode;
            return true;
          }
          const msg = `Expected </${current.fullName}> got </${t}> in line ${posToLine(pos, xml)}`;
          throw new Error(msg);
        })
        ||
        maybeMatch(reTag, (_, t, a, c) => {
          const node = current.appendChild(new Element(t, parseAttr(a, options.laxAttr), !!c));
          if (!node.closed) { current = node; }
          return true;
        })
        ||
        scanUntil('<', m => {
          current.appendChild(new TextNode(unescape(m)));
          return true;
        })
      );
      if (pos === lastPos) {
        throw new Error('Parser error');
      }
    }
    while (some && current && pos < xml.length);
  }

  // optional: Comment | PI <?pi...?> | WS
  scanIgnorables();

  // file should be done
  if (xml.slice(pos)) {
    throw new Error('DATA outside root node');
  }
  // root should have been closed
  if (root && !root.closed && current !== null) {
    throw new Error(`Expected </${root.tagName}> got EOF`);
  }
  const doc = new Document();
  if (root) {
    doc.appendChild(root);
  }
  return doc;
}
