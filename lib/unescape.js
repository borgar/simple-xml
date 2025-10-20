const NAMED = {
  lt: '<',
  gt: '>',
  amp: '&',
  apos: "'",
  quot: '"'
};
const HASH = 35;
const ZERO = 48;
const NINE = 57;
const SEMI = 59;
const LC_A = 97;
const LC_F = 102;
const LC_X = 120;
const UC_A = 65;
const UC_F = 70;
const UC_X = 88;

// Fast XML unescape for JS strings (XML 1.0 named + numeric refs)
export function unescape (str) {
  const first = str.indexOf('&');
  if (first === -1) {
    return str;
  }

  let out = '';
  let i = 0;
  if (first > 0) {
    out += (str.slice(0, first));
    i = first;
  }

  const len = str.length;
  while (i < len) {
    i++;
    if (i >= len) {
      out += '&';
      break;
    }

    if (str.charCodeAt(i) === HASH) {
      // Numeric: &#...; or &#x...;
      i++;
      let hex = false;
      if (i < len) {
        const c = str.charCodeAt(i);
        if (c === LC_X || c === UC_X) {
          hex = true;
          i++;
        }
      }
      const start = i;
      let cp = 0;
      let ok = true;
      let digits = 0;
      if (hex) {
        for (; i < len; i++) {
          const c = str.charCodeAt(i);
          if (c === SEMI) {
            break;
          }
          let v;
          if (c >= ZERO && c <= NINE) {
            v = c - ZERO;
          }
          else if (c >= LC_A && c <= LC_F) {
            v = c - 87;
          }
          else if (c >= UC_A && c <= UC_F) {
            v = c - 55;
          }
          else {
            ok = false;
            break;
          }
          cp = (cp << 4) | v;
          digits++;
        }
      }
      else {
        for (; i < len; i++) {
          const c = str.charCodeAt(i);
          if (c === SEMI) {
            break;
          }
          else if (c < ZERO || c > NINE) {
            ok = false;
            break;
          }
          cp = (cp * 10) + (c - ZERO);
          digits++;
        }
      }

      if (i < len && str.charCodeAt(i) === SEMI && ok && digits > 0) {
        i++;
        // XML 1.0 validity checks: reject surrogates, 0, > U+10FFFF
        if (cp !== 0 && cp <= 0x10FFFF && !(cp >= 0xD800 && cp <= 0xDFFF)) {
          if (cp <= 0xFFFF) {
            out += String.fromCharCode(cp);
          }
          else {
            cp -= 0x10000;
            out += String.fromCharCode(0xD800 + (cp >> 10), 0xDC00 + (cp & 0x3FF));
          }
        }
        else {
          out += '&#';
          if (hex) {
            out += 'x';
          }
          out += str.slice(start, i);
        }
      }
      else {
        out += '&';
        i = start;
      }
    }
    else {
      const semi = str.indexOf(';', i);
      if (semi !== -1 && semi > i) {
        const name = str.slice(i, semi);
        out += NAMED[name] || '&' + name + ';';
        i = semi + 1;
      }
      else {
        out += '&';
      }
    }

    if (i >= len) {
      break;
    }

    const nextAmp = str.indexOf('&', i);
    if (nextAmp === -1) {
      out += (str.slice(i));
      break;
    }
    if (nextAmp > i) {
      out += (str.slice(i, nextAmp));
    }
    i = nextAmp;
  }

  return out;
}
