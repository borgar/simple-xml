import { Node } from './Node.js';

/**
 * Appends a child node into another node.
 *
 * @ignore
 * @param {Node} parent The parent node.
 * @param {Node} child The new child node.
 */
export function appendChild (parent, child) {
  if (!child && !(child instanceof Node)) {
    throw new Error('Cannot appendChild: Child is not a node');
  }
  // if node is attached to a parent, first detach it
  if (child.parentNode) {
    const p = child.parentNode;
    p.childNodes = p.childNodes.filter(d => d !== child);
  }
  child.parentNode = parent;
  parent.childNodes.push(child);
}

