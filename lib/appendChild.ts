import { DocumentFragment } from './DocumentFragment.ts';
import type { Node } from './Node.js';

export function appendChild (parent: Node | DocumentFragment, child: Node | DocumentFragment) {
  if (child instanceof DocumentFragment) {
    // perform an append operation for every child in the fragment
    for (const d of child.childNodes) {
      appendChild(parent, d);
    }
  }
  else if (parent === child) {
    // XXX: there should really be a more elaborate tests here to determine that child does not contain parent
    throw new Error('The new child element contains the parent.');
  }
  else if (parent instanceof DocumentFragment) {
    // appending to a fragment does not mess with the node's parentage
    parent.childNodes.push(child);
  }
  else {
    // if node is attached to a parent, first detach it
    child.parentNode?.removeChild(child);
    child.parentNode = parent;
    parent.childNodes.push(child);
  }
}
