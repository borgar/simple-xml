import { unescape } from './unescape.js';

function isWS (ch: string): boolean {
  return (
    ch === ' ' ||  // #x20
    ch === '\t' || // #x9
    ch === '\r' || // #xD
    ch === '\n'    // #xA
  );
}

function isAttrChar (ch: string): boolean {
  return (
    ch === ' ' ||  // #x20
    ch === '\t' || // #x9
    ch === '\r' || // #xD
    ch === '\n' || // #xA
    ch === '=' ||
    ch === '&'
  );
}

function isQuoteSingle (ch: string): boolean {
  return ch === "'";
}

function isQuoteDouble (ch: string): boolean {
  return ch === '"';
}

function skipWS (s: string, i: number): number {
  let j = i;
  const n = s.length;
  while (j < n && isWS(s[j])) {
    j++;
  }
  return j - i;
}

export function parseAttr (s: string, laxAttr = false): Record<string, string> {
  let i = 0;
  const r: Record<string, string> = {};
  const n = s.length;

  if (!s) {
    return r;
  }

  i += skipWS(s, i);
  // attr can be pure WS
  if (i === n) {
    return r;
  }

  do {
    // match name
    const nameStart = i;
    while (i < n && !isAttrChar(s[i])) {
      i++;
    }
    if (nameStart === i) {
      // XXX also:
      // An attribute name MUST NOT appear more than once in the same
      // start-tag or empty-element tag.
      // The replacement text of any entity referred to directly or
      // indirectly in an attribute value MUST NOT contain a <.
      throw new Error('Attribute error: expected name');
    }

    const nameEnd = i;
    i += skipWS(s, i);

    // match =
    if (s[i] === '=') {
      i++;
    }
    else {
      if (laxAttr) {
        r[s.slice(nameStart, nameEnd)] = '';
        continue;
      }
      throw new Error('Attribute error: expected =');
    }

    i += skipWS(s, i);

    // match value
    let fnSeek: (s: string) => boolean;
    if (s[i] === '"') {
      fnSeek = isQuoteDouble;
      i++;
    }
    else if (s[i] === "'") {
      fnSeek = isQuoteSingle;
      i++;
    }
    else if (laxAttr) {
      fnSeek = isWS;
    }
    else {
      throw new Error('Attribute error: expected value');
    }

    const startValue = i;
    let endValue = -1;
    do {
      if (fnSeek(s[i])) {
        endValue = i;
        i++;
        break;
      }
      i++;
    } while (i < n);

    if (endValue === -1) {
      if (laxAttr) {
        const key = s.slice(nameStart, nameEnd);
        r[key] = unescape(s.slice(startValue, n));
        break;
      }
      throw new Error('Attribute error: unterminated value');
    }

    r[s.slice(nameStart, nameEnd)] = unescape(s.slice(startValue, endValue));

    const j = i;
    i += skipWS(s, i);
    if (i === j && i < n) {
      throw new Error('Attribute error: expected space');
    }
  }
  while (i < n);

  return r;
}
