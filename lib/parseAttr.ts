import { unescape } from './unescape.js';
import { ParserError } from './errors.js';

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
      throw new ParserError('Attribute error: expected name');
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
      throw new ParserError('Attribute error: expected =');
    }

    i += skipWS(s, i);

    // match value
    const quote = s[i] === '"' || s[i] === "'" ? s[i] : '';
    if (quote) {
      i++;
    }
    else if (!laxAttr) {
      throw new ParserError('Attribute error: expected value');
    }

    const startValue = i;
    let endValue = -1;
    if (quote) {
      endValue = s.indexOf(quote, i);
      i = endValue === -1 ? n : endValue + 1;
    }
    else {
      // unquoted values (lax mode) end at whitespace
      do {
        if (isWS(s[i])) {
          endValue = i;
          i++;
          break;
        }
        i++;
      } while (i < n);
    }

    if (endValue === -1) {
      if (laxAttr) {
        const key = s.slice(nameStart, nameEnd);
        r[key] = unescape(s.slice(startValue, n), true);
        break;
      }
      throw new ParserError('Attribute error: unterminated value');
    }

    r[s.slice(nameStart, nameEnd)] = unescape(s.slice(startValue, endValue), true);

    const j = i;
    i += skipWS(s, i);
    if (i === j && i < n) {
      throw new ParserError('Attribute error: expected space');
    }
  }
  while (i < n);

  return r;
}
