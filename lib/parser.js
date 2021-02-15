/* eslint-disable no-loop-func, operator-linebreak */
const Element = require('./Element');
const Document = require('./Document');
const TextNode = require('./TextNode');
const CDataNode = require('./CDataNode');
const unEscape = require('./unescape');
const unQuote = require('./unquote');

const reAttr = /^\s*([^=\s&]+)(?:\s*=\s*("[^"]+"|'[^']+'|[^>\s]+))?/;
// eslint-disable-next-line
const reComment = /^<!\-\-([^\0]+?)\-\->/;
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

function throwError (message) {
  throw new Error(message);
}

function parseAttr (s, options = DEFAULTOPTIONS) {
  let m;
  const r = {};
  if (s) {
    do {
      m = reAttr.exec(s);
      if (m) {
        // 3.3.3
        const val = unEscape(unQuote(m[2] || '', options.laxAttr))
          .replace(reWSAny, ' ')
          .trim();
        r[m[1]] = val;
        s = s.slice(m[0].length);
        if (s.length && /^\S/.test(s[0])) {
          throwError('Attribute error');
        }
      }
    }
    while (m && s.length);
    if (/\S/.test(s)) { throwError('Attribute error'); }
  }
  return r;
}

function posToLine (pos, src) {
  return src.slice(0, pos).replace(/[^\n]+/g, '').length;
}

module.exports = function parseXML (s, options = DEFAULTOPTIONS) {
  // 2.11: before parsing, translate both the two-character sequence
  // \r \n and any \r that is not followed by \n to a single \n
  const xml = String(s)
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n');

  let pos = 0;
  const length = xml.length;
  let root = null;
  let current = null;

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
  maybeMatch(reDecl, (m, a) => {
    // MUST: have version
    const attr = parseAttr(a, options);
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
  maybeMatch(reTag, (m, t, a, c) => {
    return (root = new Element(t, parseAttr(a, options), !!c));
  });

  if (!root && !options.emptyDoc) {
    throwError('no root tag found');
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
        maybeMatch(reCData, (m, c) => {
          current.appendChild(new CDataNode(c));
        })
        ||
        maybeMatch(reEndTag, (m, t) => {
          // the thing being closed must be the parent
          if (t.trim() === current.fullName) {
            current = current.parentNode;
            return true;
          }
          const msg = `Expected </${current.fullName}> got </${t}> in line ${posToLine(pos, xml)}`;
          throw new Error(msg);
        })
        ||
        maybeMatch(reTag, (m, t, a, c) => {
          const node = current.appendChild(new Element(t, parseAttr(a, options), !!c));
          if (!node.closed) { current = node; }
          return true;
        })
        ||
        scanUntil('<', m => {
          current.appendChild(new TextNode(unEscape(m)));
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

  return new Document(root);
};
