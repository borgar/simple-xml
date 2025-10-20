// This is old (2007) code that has been modernized and made to be
// smaller, and less "HTML" with its node interface access. Should
// work fine with XML now. There may be issues with case-sensitivity,
// however (as HTML is not but XML is).

import { Document } from '../Document.js';
import { Element } from '../Element.js';
import { matchToken } from './matchToken.js';
import { tokenize } from './tokenize.js';

/**
 * @ignore
 * @param {Element | Document} contextNode The ancestor node to search from
 * @param {string} selector The CSS selector to filter by
 * @returns {Array<Element>} A list of Elements matching selector
 */
export function domQuery (contextNode, selector) {
  // shortcut single tag
  if (/^([a-z1-6]+|\*)$/i.test(selector)) {
    return contextNode.getElementsByTagName(selector);
  }

  let elements = [];
  const selectorBits = selector.trim().split(/ *, */);
  for (const s of selectorBits) {
    let elms = [ contextNode ];
    if (s) {
      const tokens = tokenize(s);
      let j = 0;
      let t;
      while ((t = tokens[j++]) && elms.length) {
        elms = matchToken(t, 0, elms);
      }
    }
    elements = elements.concat(elms);
  }

  // return collection of unique nodes in document order
  return contextNode
    .getElementsByTagName('*')
    .filter(elm => elements.includes(elm));
}
