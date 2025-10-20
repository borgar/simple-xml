import { Node } from './Node.js';

export function appendChild (parent: Node, child: Node) {
  // if node is attached to a parent, first detach it
  if (child.parentNode) {
    const p = child.parentNode;
    p.childNodes = p.childNodes.filter(d => d !== child);
  }
  child.parentNode = parent;
  parent.childNodes.push(child);
}
