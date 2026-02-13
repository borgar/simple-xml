// This is old (2007) code that has been modernized and made to be
// smaller, and less "HTML" with its node interface access. Should
// work fine with XML now. There may be issues with case-sensitivity,
// however (as HTML is not but XML is).

import type { Document } from '../Document.js';
import type { Element } from '../Element.js';
import { matchToken } from './matchToken.js';
import { tokenize, type SelectorToken } from './tokenize.js';

export function domQuery (contextNode: Element | Document, selector: string): Element[] {
  // shortcut single tag
  if (selector === '*' || /^[a-z1-6]+$/i.test(selector)) {
    return contextNode.getElementsByTagName(selector);
  }

  let elements: Element[] = [];
  const selectorBits = selector.trim().split(/ *, */);
  for (const s of selectorBits) {
    let elms = [ contextNode as Element ];
    if (s) {
      const tokens: SelectorToken[] = tokenize(s);
      let j = 0;
      let t: SelectorToken;
      while ((t = tokens[j++]) && elms.length) {
        elms = matchToken(t, false, elms);
      }
    }
    elements = elements.concat(elms);
  }

  // return collection of unique nodes in document order

  if (selectorBits.length === 1) {
    // Single selector group: results are in document order, just need to
    // deduplicate (because dupes can happen with descendant combinators)
    const seen = new Set<Element>();
    return elements.filter(elm => {
      if (seen.has(elm)) return false;
      seen.add(elm);
      return true;
    });
  }

  // Multiple selector groups: restore document order via tree walk
  const elementSet = new Set(elements);
  return contextNode
    .getElementsByTagName('*')
    .filter(elm => elementSet.has(elm));
}
