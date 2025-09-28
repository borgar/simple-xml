// Small, hot-path map (only XML's 5 required named entities)
// Using 'if/else' on first char is even faster, but this is clean and monomorphic.
const NAMED = {
  lt: '<',
  gt: '>',
  amp: '&',
  apos: "'",
  quot: '"'
};

// Fast XML unescape for JS strings (XML 1.0 named + numeric refs)
export function unescape (str, { strict = true } = {}) {
  // Early out if no ampersand
  const first = str.indexOf('&');
  if (first === -1) { return str; }

  const out = [];
  let i = 0;

  // Copy initial literal run
  if (first > 0) {
    out.push(str.slice(0, first));
    i = first;
  }

  const len = str.length;
  while (i < len) {
    const amp = i; // str[amp] === '&'
    i++;           // consume '&'
    if (i >= len) {
      out.push('&');
      break;
    }

    if (str.charCodeAt(i) === 35 /* '#' */) {
      // Numeric: &#...; or &#x...;
      i++;
      let hex = false;
      if (i < len) {
        const c = str.charCodeAt(i);
        if (c === 120 || c === 88) { // 'x' | 'X'
          hex = true; i++;
        }
      }
      const start = i; let cp = 0; let ok = true; let digits = 0;

      if (hex) {
        for (; i < len; i++) {
          const c = str.charCodeAt(i);
          if (c === 59) { break; } // ';'
          const v =
            c >= 48 && c <= 57
              ? (c - 48)
              : c >= 97 && c <= 102
                ? (c - 87)
                : c >= 65 && c <= 70
                  ? (c - 55)
                  : -1;
          if (v < 0) { ok = false; break; }
          cp = (cp << 4) | v; digits++;
        }
      }
      else {
        for (; i < len; i++) {
          const c = str.charCodeAt(i);
          if (c === 59) { break; } // ';'
          if (c < 48 || c > 57) { ok = false; break; }
          cp = cp * 10 + (c - 48); digits++;
        }
      }

      if (i < len && str.charCodeAt(i) === 59 /* ';' */ && ok && digits > 0) {
        i++; // consume ';'
        // XML 1.0 validity checks: reject surrogates, 0, > U+10FFFF
        if (
          cp !== 0 &&
          cp <= 0x10FFFF &&
          !(cp >= 0xD800 && cp <= 0xDFFF)
        ) {
          // Emit as JS string (handles astral via surrogate pair)
          if (cp <= 0xFFFF) { out.push(String.fromCharCode(cp)); }
          else {
            cp -= 0x10000;
            out.push(String.fromCharCode(0xD800 + (cp >> 10), 0xDC00 + (cp & 0x3FF)));
          }
        }
        else if (strict) {
          throw new Error(`Invalid XML numeric reference at ${amp}`);
        }
        else {
          out.push('&#'); if (hex) { out.push('x'); } out.push(str.slice(start, i));
        }
      }
      else if (strict) {
        throw new Error(`Malformed XML numeric reference at ${amp}`);
      }
      else {
        out.push('&'); // fall back: keep '&' literal
        i = start;     // reprocess following chars normally
      }
    }
    else {
      // Named: &name;
      const nameStart = i;
      // Find the terminating ';' quickly
      const semi = str.indexOf(';', nameStart);
      if (semi !== -1 && semi > nameStart) {
        const name = str.slice(nameStart, semi);
        const subst = NAMED[name];
        if (subst !== undefined) {
          out.push(subst);
          i = semi + 1;
        }
        else if (strict) {
          throw new Error(`Unknown XML entity "&${name};" at ${amp}`);
        }
        else {
          // lenient: keep as-is
          out.push('&', name, ';');
          i = semi + 1;
        }
      }
      else {
        // No ';' → malformed
        if (strict) {
          throw new Error(`Unterminated XML entity at ${amp}`);
        }
        else {
          out.push('&'); // treat '&' as literal
          // do not advance i further; resume normal scan below
        }
      }
    }

    // After handling one entity (or lenient copy), fast-copy the next literal run
    if (i >= len) { break; }
    const nextAmp = str.indexOf('&', i);
    if (nextAmp === -1) {
      out.push(str.slice(i));
      break;
    }
    if (nextAmp > i) { out.push(str.slice(i, nextAmp)); }
    i = nextAmp;
  }

  return out.length === 1 ? out[0] : out.join('');
}
