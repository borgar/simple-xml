import { DocumentFragment } from './DocumentFragment.ts';
import { HierarchyError } from './errors.ts';
import type { Node } from './Node.ts';

/**
 * Throw if inserting nodes into parent would make one of them its own
 * ancestor, which would create a cycle in the tree.
 *
 * @param parent The node the nodes are inserted into.
 * @param nodes The nodes to insert.
 */
export function checkHierarchy (parent: Node | DocumentFragment, nodes: readonly Node[]) {
  // An ancestor of parent has at least one child, so unless one of the nodes
  // is parent itself, the walk is only needed for nodes that have children.
  // The parser only appends new, empty nodes, so it skips the walk.
  if (!nodes.includes(parent as Node) && !nodes.some(node => node.childNodes.length)) {
    return;
  }
  let ancestor: Node | DocumentFragment | null = parent;
  while (ancestor) {
    if (nodes.includes(ancestor as Node)) {
      throw new HierarchyError('The new child element contains the parent.');
    }
    ancestor = ancestor instanceof DocumentFragment ? null : ancestor.parentNode;
  }
}
