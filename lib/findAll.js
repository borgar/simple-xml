import { Document } from './Document.js';
import { Element } from './Element.js';
import { ELEMENT_NODE } from './constants.js';

/**
 * @ignore
 * @param {Element | Document} node The ancestor node to search from
 * @param {string} tagName The tag name
 * @param {Array<Element>} [list=[]] An accumulator list
 * @returns {Array<Element>} A list of Elements having `tagName`
 */
export function findAll (node, tagName, list = []) {
  const ch = node && node.childNodes;
  if (ch) {
    for (let i = 0; i < ch.length; i++) {
      const c = ch[i];
      if (c.nodeType === ELEMENT_NODE) {
        if (c.tagName === tagName || tagName === '*') {
          list.push(c);
        }
        // and its children... (traversal order)
        findAll(c, tagName, list);
      }
    }
  }
  return list;
}
