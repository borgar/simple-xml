/* eslint-disable jsdoc/no-undefined-types */
/* eslint-disable no-loop-func, operator-linebreak */
import { Element } from './Element.js';
import { Document } from './Document.js';
import { TextNode } from './TextNode.js';
import { CDataNode } from './CDataNode.js';
import { unescape } from './unescape.js';
import { removeCR } from './removeCR.js';
import { parseAttr } from './parseAttr.js';

const DEFAULTOPTIONS = {
  emptyDoc: false,
  laxAttr: false
};

// (#x20 | #x9 | #xD | #xA)+
const CHAR_WS = { ' ': 1, '\t': 1, '\n': 1, '\r': 1, '\f': 1, '\v': 1 };
const CHAR_NOT_IN_NAME = { '!': 1, '>': 1, '/': 1, '#': 1, '&': 1, ...CHAR_WS };
const CHAR_NOT_IN_CLOSE = { '>': 1, ...CHAR_WS };

const OPEN_BRACE = 60; // "<"
const CLOSE_BRACE = 62; // ">"
const QUESTION = 63; // "?"
const SLASH = 47; // "/"

// /^[ \t\r\n]+/
const fnWS = (s, pos = 0) => {
  let i = pos;
  let c;
  do {
    c = s.at(i);
    if (!CHAR_WS[c]) {
      break;
    }
    i++;
  } while (c);
  return i !== pos ? [ s.slice(pos, i) ] : null;
};

// /^<!--([^\0]+?)-->/
const fnComment = (s, pos = 0) => {
  if (s.startsWith('<!--', pos)) {
    const max = s.length - 2;
    let i = pos + 4;
    do {
      if (s.startsWith('-->', i)) {
        return [ s.slice(pos, i + 3), s.slice(pos + 4, i) ];
      }
      i++;
    }
    while (i < max);
  }
  return null;
};

// /^<!\[CDATA\[([^\0]*?)\]\]>/;
const fnCData = (s, pos = 0) => {
  if (s.charCodeAt(pos) === OPEN_BRACE && s.startsWith('<![CDATA[', pos)) {
    const max = s.length - 3;
    let i = pos + 9;
    do {
      if (s.startsWith(']]>', i)) {
        return [ s.slice(pos, i + 3), s.slice(pos + 9, i) ];
      }
      i++;
    }
    while (i < max);
  }
  return null;
};

// /^<\?([^>]*)\?>/;
const fnInstr = (s, pos = 0) => {
  if (s.charCodeAt(pos) === OPEN_BRACE && s.charCodeAt(pos + 1) === QUESTION) {
    const max = s.length - 2;
    let i = pos + 2;
    do {
      if (s.startsWith('?>', i)) {
        return [ s.slice(pos, i + 2), s.slice(pos + 2, i) ];
      }
      i++;
    }
    while (i < max);
  }
  return null;
};

// /^<([^!>\s/#&]+)(\s[^>]*?)?(\/?)>/;
const fnTagStrict = (s, startIndex = 0) => {
  const n = s.length;
  let i = startIndex;

  if (i >= n || s.charCodeAt(i) !== OPEN_BRACE) {
    return null;
  }
  i++;

  // group 1: tag name (one or more of [^!>\s/#&])
  const nameStart = i;
  let nameEnd = i;
  if (i >= n || (CHAR_NOT_IN_NAME[s[i]])) {
    return null;
  }
  while (i < n && !CHAR_NOT_IN_NAME[s[i]]) {
    i++;
  }
  nameEnd = i;
  if (nameEnd === nameStart) {
    return null;
  }

  // group 2: optional attrs, must start with whitespace;
  // tops before '/' or '>'
  const attrsStart = i;
  let attrsEnd = i;
  if (i < n && CHAR_WS[s[i]]) {
    do {
      if (s.charCodeAt(i) === CLOSE_BRACE || s.startsWith('/>', i)) {
        break;
      }
      i++;
    } while (i < n);
    attrsEnd = i;
  }

  // --- group 3: optional '/'
  let g3 = '';
  if (i < n && s[i] === '/') {
    g3 = '/';
    i++;
  }

  // final '>'
  if (i >= n || s[i] !== '>') {
    return null;
  }
  i++;

  return [
    s.slice(startIndex, i),
    s.slice(nameStart, nameEnd),
    s.slice(attrsStart, attrsEnd),
    g3
  ];
};

// /^<\/([^>\s]+)\s*>/;
const fnEndTag = (s, pos = 0) => {
  if (s.charCodeAt(pos) === OPEN_BRACE && s.charCodeAt(pos + 1) === SLASH) {
    let i = pos + 2;
    const n = s.length - 1;
    do {
      if (CHAR_NOT_IN_CLOSE[s[i]]) {
        break;
      }
      i++;
    } while (i < n);
    const e = i;
    while (CHAR_WS[s[i]]) {
      i++;
    }
    if (s.charCodeAt(i) === CLOSE_BRACE) {
      return [ s.slice(pos, i + 1), s.slice(pos + 2, e) ];
    }
  }
  return null;
};

// const reDecl = /^<\?xml(?: ([a-z0-9 =."'-]*?))?\?>/i;
const fnDecl = (s, pos = 0) => {
  if (s.startsWith('<?xml', pos)) {
    return /^<\?xml(?: ([a-z0-9 =."'-]*?))?\?>/i.exec(s.slice(pos));
  }
  return null;
};

// /^<!([^->\s/[]*)(\s[^>]+?)?(\/?)>/
const fnDocType = (s, pos = 0) => {
  if (s.startsWith('<!', pos)) {
    return /^<!([^->\s/[]*)(\s[^>]+?)?(\/?)>/.exec(s.slice(pos));
  }
  return null;
};

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
  // \r\n and any \r that is not followed by \n to a single \n
  const xml = removeCR(source);

  let pos = 0;
  /** @type {Element|null} */
  let root = null;
  let current = null;
  // const reTag = options.laxAttr ? reTagLax : reTagStrict;

  /**
   * @ignore
   * @param {string} char The character to look for
   * @param {ParseHandler} [parse] A handler for the match
   * @returns {boolean} Was a match found?
   */
  function scanUntil (char, parse) {
    const s = pos;
    const idx = xml.indexOf(char, pos);
    if (idx > -1) {
      pos = idx;
      parse(xml.slice(s, pos));
      return true;
    }
    return false;
  }

  /**
   * @ignore
   * @param {(s: string, pos?: number) => null | string[])} fn An expression matcher
   * @param {ParseHandler} [parse] A handler for the match
   * @returns {boolean} Was a match found?
   */
  function maybeMatchFn (fn, parse) {
    const m = fn(xml, pos);
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
        maybeMatchFn(fnWS)
        ||
        maybeMatchFn(fnInstr)
        ||
        maybeMatchFn(fnComment)
      );
    }
    while (m);
  }

  // BOM
  if (xml.charCodeAt(pos) === 65279) {
    pos++;
  }

  maybeMatchFn(fnWS);

  // -- prolog --
  // optional: declaration
  maybeMatchFn(fnDecl, (_, a) => {
    // MUST: have version
    const attr = parseAttr(a, options.laxAttr);
    if (!attr.version) {
      throw new Error('XML missing version');
    }
    return null;
  });

  // optional: Comment | PI <?xml...?> | WS
  scanIgnorables();
  maybeMatchFn(fnDocType);
  scanIgnorables();

  // root tag
  // maybeMatch(reTag, (_, t, a, c) => {
  maybeMatchFn(fnTagStrict, (_, t, a, c) => {
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
        maybeMatchFn(fnComment)
        ||
        maybeMatchFn(fnInstr)
        ||
        maybeMatchFn(fnCData, (_, c) => (
          !!current.appendChild(new CDataNode(c))
        ))
        ||
        maybeMatchFn(fnEndTag, (_, t) => {
          // the thing being closed must be the parent
          if (t.trim() === current.fullName) {
            current = current.parentNode;
            return true;
          }
          const msg = `Expected </${current.fullName}> got </${t}> in line ${posToLine(pos, xml)}`;
          throw new Error(msg);
        })
        ||
        maybeMatchFn(fnTagStrict, (_, t, a, c) => {
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
