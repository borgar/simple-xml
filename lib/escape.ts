const REPLACEMENT = '&#xFFFD;';

// eslint-disable-next-line no-control-regex
const reNeedsEscape = /["&'<>\t\x00-\x08\x0B\x0C\x0E-\x1F\uD800-\uDFFF\uFFFE\uFFFF]/;

const reLineBreak = /[\n\r]/;

/**
 * Escape XML entities in a string. Characters that XML 1.0 doesn't allow
 * are written as `&#xFFFD;`, a reference to the replacement character.
 *
 * In attribute values, LF and CR are written as `&#10;` and `&#13;`, because
 * parsers turn raw line breaks in attribute values into spaces.
 *
 * @param {string} s Unescaped string
 * @param {boolean} [attribute=false] Escape the string for use as an attribute value
 * @returns {string} Escaped string
 */
export function escape (s: string, attribute: boolean = false): string {
  // A regex scan is faster than the loop when nothing needs escaping.
  if (!s || (!reNeedsEscape.test(s) && !(attribute && reLineBreak.test(s)))) {
    return s;
  }
  const len = s.length;
  let out = '';
  let last = 0;
  for (let i = 0; i < len; i++) {
    const c = s.charCodeAt(i);
    let rep: string;
    if (c < 0x3F) {
      if (c === 0x26) { rep = '&amp;'; }
      else if (c === 0x3C) { rep = '&lt;'; }
      else if (c === 0x3E) { rep = '&gt;'; }
      else if (c === 0x22) { rep = '&quot;'; }
      else if (c === 0x27) { rep = '&apos;'; }
      else if (c === 0x09) { rep = '&#9;'; }
      else if (c === 0x0A && attribute) { rep = '&#10;'; }
      else if (c === 0x0D && attribute) { rep = '&#13;'; }
      else if (c < 0x20 && c !== 0x0A && c !== 0x0D) { rep = REPLACEMENT; }
      else { continue; }
    }
    else if (c < 0xD800) {
      continue;
    }
    else if (c < 0xE000) {
      // keep valid surrogate pairs
      if (c < 0xDC00 && i + 1 < len) {
        const d = s.charCodeAt(i + 1);
        if (d >= 0xDC00 && d < 0xE000) {
          i++;
          continue;
        }
      }
      rep = REPLACEMENT;
    }
    else if (c === 0xFFFE || c === 0xFFFF) {
      rep = REPLACEMENT;
    }
    else {
      continue;
    }
    out += s.slice(last, i) + rep;
    last = i + 1;
  }
  return out + s.slice(last);
}
