const NAMED: Record<string, string> = {
  lt: '<',
  gt: '>',
  amp: '&',
  apos: "'",
  quot: '"'
};
const TAB = 9;
const LF = 10;
const CR = 13;
const HASH = 35;
const AMP = 38;
const ZERO = 48;
const NINE = 57;
const SEMI = 59;
const LC_A = 97;
const LC_F = 102;
const LC_X = 120;
const UC_A = 65;
const UC_F = 70;
const UC_X = 88;
const MAX_NAMED = 4;
const OUT_OF_RANGE = 0x110000;

// Index of the next character that unescape changes, or -1.
function nextSpecial (str: string, from: number, attribute: boolean): number {
  if (!attribute) {
    return str.indexOf('&', from);
  }
  const len = str.length;
  for (let i = from; i < len; i++) {
    const c = str.charCodeAt(i);
    if (c === AMP || c === TAB || c === LF || c === CR) {
      return i;
    }
  }
  return -1;
}

/**
 * Fast XML unescape for JS strings (XML 1.0 named + numeric refs).
 * Malformed references are kept as written.
 *
 * In attribute values, raw tab, LF, and CR become spaces, but whitespace
 * written as a character reference is kept (XML 1.0, section 3.3.3).
 *
 * @param str Escaped string
 * @param [attribute=false] Normalize the string as an attribute value
 * @returns Unescaped string
 */
export function unescape (str: string, attribute: boolean = false): string {
  let next = nextSpecial(str, 0, attribute);
  if (next === -1) {
    return str;
  }

  const len = str.length;
  let out = '';
  let last = 0;
  while (next !== -1) {
    out += str.slice(last, next);
    let i = next + 1;

    if (str.charCodeAt(next) !== AMP) {
      out += ' ';
    }
    else if (str.charCodeAt(i) === HASH) {
      // Numeric: &#...; or &#x...;
      i++;
      const hex = str.charCodeAt(i) === LC_X || str.charCodeAt(i) === UC_X;
      if (hex) {
        i++;
      }
      let cp = 0;
      let digits = 0;
      for (; i < len; i++) {
        const c = str.charCodeAt(i);
        let v;
        if (c >= ZERO && c <= NINE) {
          v = c - ZERO;
        }
        else if (hex && c >= LC_A && c <= LC_F) {
          v = c - 87;
        }
        else if (hex && c >= UC_A && c <= UC_F) {
          v = c - 55;
        }
        else {
          break;
        }
        cp = Math.min(cp * (hex ? 16 : 10) + v, OUT_OF_RANGE);
        digits++;
      }
      // XML 1.0 validity checks: reject surrogates, 0, > U+10FFFF
      if (
        digits && str.charCodeAt(i) === SEMI &&
        cp !== 0 && cp < OUT_OF_RANGE && !(cp >= 0xD800 && cp <= 0xDFFF)
      ) {
        if (cp <= 0xFFFF) {
          out += String.fromCharCode(cp);
        }
        else {
          cp -= 0x10000;
          out += String.fromCharCode(0xD800 + (cp >> 10), 0xDC00 + (cp & 0x3FF));
        }
        i++;
      }
      else {
        out += '&';
        i = next + 1;
      }
    }
    else {
      // Named: only the five predefined entities
      let semi = i;
      while (semi < len && semi - i <= MAX_NAMED && str.charCodeAt(semi) !== SEMI) {
        semi++;
      }
      const ch = str.charCodeAt(semi) === SEMI && semi - i > 1 ? NAMED[str.slice(i, semi)] : undefined;
      if (ch) {
        out += ch;
        i = semi + 1;
      }
      else {
        out += '&';
      }
    }

    last = i;
    next = nextSpecial(str, i, attribute);
  }

  return out + str.slice(last);
}
