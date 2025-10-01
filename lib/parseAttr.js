/* eslint-disable jsdoc/no-undefined-types */
/* eslint-disable no-loop-func, operator-linebreak */
import { unescape } from './unescape.js';

// (#x20 | #x9 | #xD | #xA)+
const CHAR_WS = { ' ': 1, '\t': 1, '\n': 1, '\r': 1, '\f': 1, '\v': 1 };
const CHAR_ATTRNAME = { '=': 1, '&': 1, ...CHAR_WS };
const CHAR_QUOT_SGL = { "'": 1 };
const CHAR_QUOT_DBL = { '"': 1 };

/**
 * @ignore
 * @param {string} s
 * @param {boolean} [laxAttr=false] The lax attribute
 * @returns {Record<string, string>} { description_of_the_return_value }
 */
export function parseAttr (s, laxAttr = false) {
  let i = 0;
  const r = /** @type {Record<string, string>} */({});
  const n = s.length;

  const skipWS = () => {
    let j = i;
    while (j < n && CHAR_WS[s[j]]) {
      j++;
    }
    return j - i;
  };
  if (!s) {
    return r;
  }

  i += skipWS();
  // attr can be pure WS
  if (i === n) {
    return r;
  }

  do {
    // match name
    const nameStart = i;
    while (i < n && !CHAR_ATTRNAME[s[i]]) { i++; }
    if (nameStart === i) {
      // XXX also:
      // An attribute name MUST NOT appear more than once in the same
      // start-tag or empty-element tag.
      // The replacement text of any entity referred to directly or
      // indirectly in an attribute value MUST NOT contain a <.
      throw new Error('Attribute error: expected name');
    }
    const nameEnd = i;

    i += skipWS();

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

    i += skipWS();

    // match value
    let SEEK;
    if (s[i] === '"') { SEEK = CHAR_QUOT_DBL; i++; }
    else if (s[i] === "'") { SEEK = CHAR_QUOT_SGL; i++; }
    else if (laxAttr) { SEEK = CHAR_WS; }
    else {
      throw new Error('Attribute error: expected value');
    }
    const startValue = i;
    let endValue = -1;
    do {
      if (SEEK[s[i]]) {
        endValue = i;
        i++;
        break;
      }
      i++;
    } while (i < n);
    if (endValue === -1) {
      if (laxAttr) {
        r[s.slice(nameStart, nameEnd)] = unescape(s.slice(startValue, n));
        break;
      }
      throw new Error('Attribute error: unterminated value');
    }

    r[s.slice(nameStart, nameEnd)] = unescape(s.slice(startValue, endValue));

    const j = i;
    i += skipWS();
    if (i === j) {
      // no WS skipped
      if (i < n) {
        throw new Error('Attribute error: expected space');
      }
    }
  }
  while (i < n);

  return r;
}
