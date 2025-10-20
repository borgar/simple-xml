/* eslint-disable jsdoc/require-returns-description */
/* eslint-disable jsdoc/require-param-description */
/* eslint-disable jsdoc/no-undefined-types */
/* eslint-disable no-loop-func, operator-linebreak */
import { unescape } from './unescape.js';

function isWS (ch) {
  return (
    ch === ' ' ||  // #x20
    ch === '\t' || // #x9
    ch === '\r' || // #xD
    ch === '\n'    // #xA
  );
}

function isAttrChar (ch) {
  return (
    ch === ' ' ||  // #x20
    ch === '\t' || // #x9
    ch === '\r' || // #xD
    ch === '\n' || // #xA
    ch === '=' ||
    ch === '&'
  );
}

function isQuoteSingle (ch) {
  return ch === "'";
}

function isQuoteDouble (ch) {
  return ch === '"';
}

function skipWS (s, i) {
  let j = i;
  const n = s.length;
  while (j < n && isWS(s[j])) {
    j++;
  }
  return j - i;
}

/**
 * @ignore
 * @param {string} s
 * @param {boolean} [laxAttr=false]
 * @returns {Record<string, string>}
 */
export function parseAttr (s, laxAttr = false) {
  let i = 0;
  const r = /** @type {Record<string, string>} */({});
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
    let fnSeek;
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
        r[s.slice(nameStart, nameEnd)] = unescape(s.slice(startValue, n));
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
