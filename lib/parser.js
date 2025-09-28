/* eslint-disable jsdoc/no-undefined-types */
/* eslint-disable no-loop-func, operator-linebreak */
import { Element } from './Element.js';
import { Document } from './Document.js';
import { TextNode } from './TextNode.js';
import { CDataNode } from './CDataNode.js';
import { unescape } from './unescape.js';

const DEFAULTOPTIONS = {
  emptyDoc: false,
  laxAttr: false
};

// (#x20 | #x9 | #xD | #xA)+
const CHAR_WS = { ' ': 1, '\t': 1, '\n': 1, '\r': 1, '\f': 1, '\v': 1 };
const CHAR_NOT_IN_NAME = { '!': 1, '>': 1, '/': 1, '#': 1, '&': 1, ...CHAR_WS };

// /^[ \t\r\n]+/
const fnWS = (s, pos = 0) => {
  let i = pos;
  let c;
  do {
    c = s.at(i);
    if (!(c in CHAR_WS)) {
      break;
    }
    i++;
  } while (c);
  return i !== pos ? [ s.slice(pos, i) ] : null;
};

// /^<!--([^\0]+?)-->/
const fnComment = (s, pos = 0) => {
  if (s.startsWith('<!--', pos)) {
    const max = s.length - 3;
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
  if (s.startsWith('<![CDATA[', pos)) {
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
  if (s.startsWith('<?', pos)) {
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

  if (i >= n || s[i] !== '<') {
    return null;
  }
  i++;

  // group 1: tag name (one or more of [^!>\s/#&])
  const nameStart = i;
  let nameEnd = i;
  if (i >= n || (s[i] in CHAR_NOT_IN_NAME)) {
    return null;
  }
  while (i < n && !(s[i] in CHAR_NOT_IN_NAME)) {
    i++;
  }
  nameEnd = i;
  if (nameEnd === nameStart) {
    return null;
  }

  // group 2: optional attrs, must start with whitespace; stops before '/' or '>'
  const g2 = '';
  const attrsStart = i;
  let attrsEnd = i;
  if (i < n && (s[i] in CHAR_WS)) {
    do {
      if (s[i] === '>' || s.startsWith('/>', i)) {
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
const CHAR_NOT_IN_CLOSE = { '>': 1, ...CHAR_WS };
const fnEndTag = (s, pos = 0) => {
  if (s.startsWith('</', pos)) {
    let i = pos + 2;
    const n = s.length - 1;
    do {
      if (s[i] in CHAR_NOT_IN_CLOSE) {
        break;
      }
      i++;
    } while (i < n);
    const e = i;
    while (s[i] in CHAR_WS) {
      i++;
    }
    if (s[i] === '>') {
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

const CHAR_ATTRNAME = { '=': 1, '&': 1, ...CHAR_WS };
const CHAR_QUOT_S = { "'": 1 };
const CHAR_QUOT_D = { '"': 1 };

/**
 * @ignore
 * @param {string} s
 * @param {boolean} [laxAttr=false] The lax attribute
 * @returns {Record<string, string>} { description_of_the_return_value }
 */
function parseAttr (s, laxAttr = false) {
  let i = 0;
  const r = /** @type {Record<string, string>} */({});
  const n = s.length;
  const skipWS = () => {
    while (i < n && s[i] in CHAR_WS) {
      i++;
    }
  };
  if (!s) {
    return r;
  }

  do {
    skipWS();
    // attr can be pure WS
    if (i === n) {
      return r;
    }

    // match name
    const nameStart = i;
    while (i < n && !(s[i] in CHAR_ATTRNAME)) { i++; }
    if (nameStart === i) {
      // XXX also:
      // An attribute name MUST NOT appear more than once in the same start-tag or empty-element tag.
      // The replacement text of any entity referred to directly or indirectly in an attribute value MUST NOT contain a <.
      throw new Error('Attribute error: expected name');
    }
    const nameEnd = i;

    skipWS();

    // match =
    if (s[i] === '=') {
      i++;
    }
    else {
      throw new Error('Attribute error: expected =');
    }

    skipWS();

    // match value
    let SEEK;
    if (s[i] === '"') { SEEK = CHAR_QUOT_D; i++; }
    else if (s[i] === "'") { SEEK = CHAR_QUOT_S; i++; }
    else if (laxAttr) { SEEK = CHAR_WS; }
    else {
      throw new Error('Attribute error: expected value');
    }
    const startValue = i;
    let endValue = i;
    do {
      if (s[i] in SEEK) {
        endValue = i;
        i++;
        break;
      }
      i++;
    } while (i < n);

    r[s.slice(nameStart, nameEnd)] = unescape(s.slice(startValue, endValue));
  }
  while (i < n);

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
  // XXX: ‼️ this is quite slow
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
