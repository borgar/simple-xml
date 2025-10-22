import { Document } from './Document.js';
import { Element } from './Element.js';
import { isElement } from './isElement.ts';

export function findAll (node: Element | Document, tagName: string, list: Element[] = []): Element[] {
  const ch = node?.childNodes;
  if (ch) {
    for (const c of ch) {
      if (isElement(c)) {
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
