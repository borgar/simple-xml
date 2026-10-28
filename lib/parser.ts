/* eslint-disable @stylistic/operator-linebreak */

import { Element } from './Element.js';
import { Document } from './Document.js';
import { TextNode } from './TextNode.js';
import { CDataNode } from './CDataNode.js';
import { unescape } from './unescape.js';
import { removeCR } from './removeCR.js';
import { parseAttr } from './parseAttr.js';
import { NamespaceError, ParserError } from './errors.js';
import { XML_NS, XMLNS_NS } from './constants.js';

const DEFAULTOPTIONS = {
  emptyDoc: false,
  laxAttr: false,
  ns: false
};

// a placeholder for a missing root, compared by identity
const NON_ELEMENT = new Element('none');

function isWS (ch: string): boolean {
  return (
    ch === ' ' ||  // #x20
    ch === '\t' || // #x9
    ch === '\r' || // #xD
    ch === '\n'    // #xA
  );
}

function isNotNameChar (ch: string): boolean {
  return (
    ch === ' ' ||  // #x20
    ch === '\t' || // #x9
    ch === '\r' || // #xD
    ch === '\n' || // #xA
    ch === '!' ||
    ch === '>' ||
    ch === '/' ||
    ch === '#' ||
    ch === '&'
  );
}

function isNotCloseChar (ch: string): boolean {
  return (
    ch === ' ' ||  // #x20
    ch === '\t' || // #x9
    ch === '\r' || // #xD
    ch === '\n' || // #xA
    ch === '>'
  );
}

const OPEN_BRACE = 60; // "<"
const CLOSE_BRACE = 62; // ">"
const QUESTION = 63; // "?"
const SLASH = 47; // "/"
const DOUBLE_QUOTE = 34; // '"'
const SINGLE_QUOTE = 39; // "'"

type ParserFunction = (s: string, pos?: number) => null | string[];
type ParseHandler = (...args: string[]) => boolean;

// /^[ \t\r\n]+/
const fnWS: ParserFunction = (s: string, pos = 0) => {
  let i = pos;
  let c;
  do {
    c = s.at(i);
    if (!c || !isWS(c)) {
      break;
    }
    i++;
  } while (c);
  return i !== pos ? [ s.slice(pos, i) ] : null;
};

// /^<!--([^\0]+?)-->/
const fnComment: ParserFunction = (s, pos = 0) => {
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

// /^<!\[CDATA\[([^\0]*?)\]\]>/
const fnCData: ParserFunction = (s, pos = 0) => {
  if (s.charCodeAt(pos) === OPEN_BRACE && s.startsWith('<![CDATA[', pos)) {
    const i = s.indexOf(']]>', pos + 9);
    if (i !== -1) {
      return [ s.slice(pos, i + 3), s.slice(pos + 9, i) ];
    }
  }
  return null;
};

// /^<\?([^>]*)\?>/
const fnInstr: ParserFunction = (s, pos = 0) => {
  if (s.charCodeAt(pos) === OPEN_BRACE && s.charCodeAt(pos + 1) === QUESTION) {
    const i = s.indexOf('?>', pos + 2);
    if (i !== -1) {
      return [ s.slice(pos, i + 2), s.slice(pos + 2, i) ];
    }
  }
  return null;
};

// /^<([^!>\s/#&]+)(\s[^>]*?)?(\/?)>/
const fnTag: ParserFunction = (s, startIndex = 0) => {
  const n = s.length;
  let i = startIndex;

  if (i >= n || s.charCodeAt(i) !== OPEN_BRACE) {
    return null;
  }
  i++;

  // group 1: tag name (one or more of [^!>\s/#&])
  const nameStart = i;
  let nameEnd = i;
  if (i >= n || isNotNameChar(s[i])) {
    return null;
  }
  while (i < n && !isNotNameChar(s[i])) {
    i++;
  }
  nameEnd = i;
  if (nameEnd === nameStart) {
    return null;
  }

  // group 2: optional attrs, must start with whitespace;
  // stops before '/' or '>' (but not when inside quoted attribute values)
  const attrsStart = i;
  let attrsEnd = i;
  if (i < n && isWS(s[i])) {
    let inQuote = 0; // 0 = not in quote, otherwise the quote char code
    do {
      const ch = s.charCodeAt(i);
      if (inQuote === 0) {
        if (ch === DOUBLE_QUOTE || ch === SINGLE_QUOTE) {
          inQuote = ch;
        }
        else if (ch === CLOSE_BRACE || s.startsWith('/>', i)) {
          break;
        }
      }
      else if (ch === inQuote) {
        inQuote = 0;
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

// /^<\/([^>\s]+)\s*>/
const fnEndTag: ParserFunction = (s, pos = 0) => {
  if (s.charCodeAt(pos) === OPEN_BRACE && s.charCodeAt(pos + 1) === SLASH) {
    let i = pos + 2;
    const n = s.length - 1;
    do {
      if (isNotCloseChar(s[i])) {
        break;
      }
      i++;
    } while (i < n);
    const e = i;
    while (isWS(s[i])) {
      i++;
    }
    if (s.charCodeAt(i) === CLOSE_BRACE) {
      return [ s.slice(pos, i + 1), s.slice(pos + 2, e) ];
    }
  }
  return null;
};

// /^<\?xml(?: ([a-z0-9 =."'-]*?))?\?>/i
const fnDecl: ParserFunction = (s, pos = 0) => {
  if (s.startsWith('<?xml', pos)) {
    return /^<\?xml(?: ([a-z0-9 =."'-]*?))?\?>/i.exec(s.slice(pos));
  }
  return null;
};

// /^<!([^->\s/[]*)(\s[^>]+?)?(\/?)>/
const fnDocType: ParserFunction = (s, pos = 0) => {
  if (s.startsWith('<!', pos)) {
    return /^<!([^->\s/[]*)(\s[^>]+?)?(\/?)>/.exec(s.slice(pos));
  }
  return null;
};

function posToLine (pos: number, src: string): number {
  return src.slice(0, pos).replace(/[^\n]+/g, '').length;
}

/**
 * Parse an XML source and return a Node tree.
 *
 * @param source The XML source to parse.
 * @param [options={}] Parsing options.
 * @param [options.emptyDoc=false] Permit "rootless" documents.
 * @param [options.laxAttr=false] Permit unquoted attributes (`<node foo=bar />`).
 * @param [options.ns=false] Validate xmlns and element namespaces as they are parsed.
 * @returns A DOM representing the XML node tree.
 */
export function parseXML (
  source: string,
  options: {
    emptyDoc?: boolean;
    laxAttr?: boolean;
    ns?: boolean;
  } = DEFAULTOPTIONS
): Document {
  // 2.11: before parsing, translate both the two-character sequence
  // \r\n and any \r that is not followed by \n to a single \n
  const xml = removeCR(source);
  const doc = new Document();

  let pos = 0;
  let root = NON_ELEMENT;
  let rootSelfClosing = false;

  function scanUntil (char: string, parse: ParseHandler): boolean {
    const s = pos;
    const idx = xml.indexOf(char, pos);
    if (idx > -1) {
      pos = idx;
      parse(xml.slice(s, pos));
      return true;
    }
    return false;
  }

  function maybeMatchFn (fn: ParserFunction, parse?: ParseHandler): boolean {
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

  // Namespace scopes for the ns option: prefix -> URI ('' is the default
  // namespace). An element with declarations gets a new scope that inherits
  // from its parent's through the prototype chain.
  type NSScope = Record<string, string>;
  let nsScope: NSScope = Object.assign(Object.create(null) as NSScope, { xml: XML_NS, xmlns: XMLNS_NS });
  const nsStack: NSScope[] = [];

  // Reads the parsed attribute record rather than elm.attributes, which is slower.
  function checkNS (elm: Element, attr: Record<string, string>): NSScope {
    let scope = nsScope;
    let prefixedAttr = false;
    for (const name in attr) {
      if (name === 'xmlns' || name.startsWith('xmlns:')) {
        const prefix = name === 'xmlns' ? '' : name.slice(6);
        const uri = attr[name];
        if (
          prefix === 'xmlns' ||
          uri === XMLNS_NS ||
          (prefix === 'xml') !== (uri === XML_NS) ||
          (prefix && !uri)
        ) {
          throw new NamespaceError(`Invalid namespace declaration ${name}="${uri}"`);
        }
        if (scope === nsScope) {
          scope = Object.create(nsScope) as NSScope;
        }
        scope[prefix] = uri;
      }
      else if (name.includes(':')) {
        prefixedAttr = true;
      }
    }
    if (elm.prefix === 'xmlns' || (elm.prefix && !(elm.prefix in scope))) {
      throw new NamespaceError('Unknown namespace prefix ' + elm.prefix);
    }
    if (prefixedAttr) {
      for (const name in attr) {
        const colon = name.indexOf(':');
        const prefix = colon > 0 ? name.slice(0, colon) : '';
        if (prefix && prefix !== 'xmlns' && !(prefix in scope)) {
          throw new NamespaceError('Unknown namespace prefix ' + prefix);
        }
      }
    }
    return scope;
  }

  // Check an element's namespaces, and enter its scope if it has content.
  function enterNS (elm: Element, attr: Record<string, string>, selfClosing: boolean) {
    const scope = checkNS(elm, attr);
    if (!selfClosing) {
      nsStack.push(nsScope);
      nsScope = scope;
    }
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
      throw new ParserError('XML missing version');
    }
    return false;
  });

  // optional: Comment | PI <?xml...?> | WS
  scanIgnorables();
  maybeMatchFn(fnDocType);
  scanIgnorables();

  // root tag
  maybeMatchFn(fnTag, (_, t, a, c) => {
    const attr = parseAttr(a, options.laxAttr);
    root = new Element(t, attr);
    rootSelfClosing = !!c;
    if (options.ns) enterNS(root, attr, rootSelfClosing);
    return true;
  });

  if (root === NON_ELEMENT && !options.emptyDoc) {
    throw new ParserError('no root tag found');
  }

  let current: Element | null = root;

  // root tag content
  if (root !== NON_ELEMENT && !rootSelfClosing) {
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
          !!current?.appendChild(new CDataNode(c))
        ))
        ||
        maybeMatchFn(fnEndTag, (_, t) => {
          // the thing being closed must be the parent
          if (t.trim() === current?.fullName) {
            current = current.parentNode;
            if (options.ns) {
              nsScope = nsStack.pop() ?? nsScope;
            }
            return true;
          }
          const msg = `Expected </${current?.fullName}> got </${t}> in line ${posToLine(pos, xml)}`;
          throw new ParserError(msg);
        })
        ||
        maybeMatchFn(fnTag, (_, t, a, c) => {
          const attr = parseAttr(a, options.laxAttr);
          const elm = new Element(t, attr);
          if (options.ns) enterNS(elm, attr, !!c);
          current?.appendChild(elm);
          if (!c) {
            current = elm;
          }
          return true;
        })
        ||
        scanUntil('<', m => {
          current?.appendChild(new TextNode(unescape(m)));
          return true;
        })
      );
      if (pos === lastPos) {
        throw new ParserError('Parser error');
      }
    }
    while (some && current && pos < xml.length);
  }

  // optional: Comment | PI <?pi...?> | WS
  scanIgnorables();

  // file should be done
  if (xml.slice(pos)) {
    throw new ParserError('DATA outside root node');
  }

  // root should have been closed
  if (root !== NON_ELEMENT && !rootSelfClosing && current !== null) {
    throw new ParserError(`Expected </${root.localName}> got EOF`);
  }

  if (root !== NON_ELEMENT) {
    doc.appendChild(root);
  }
  return doc;
}
