import { DocumentFragment } from './DocumentFragment.ts';
import type { Node } from './Node.js';
import { checkHierarchy } from './checkHierarchy.ts';
import { HierarchyError } from './errors.js';

export function appendChild (parent: Node | DocumentFragment, child: Node | DocumentFragment) {
  if (child === parent) {
    throw new HierarchyError('The new child element contains the parent.');
  }
  // a fragment inserts its children; copy them so the whole set is checked
  // before any of them move
  const nodes = child instanceof DocumentFragment ? [ ...child.childNodes ] : [ child ];
  checkHierarchy(parent, nodes);
  for (const node of nodes) {
    if (parent instanceof DocumentFragment) {
      // appending to a fragment does not mess with the node's parentage
      parent.childNodes.push(node);
    }
    else {
      // if node is attached to a parent, first detach it
      node.parentNode?.removeChild(node);
      node.parentNode = parent;
      parent.childNodes.push(node);
    }
  }
}
