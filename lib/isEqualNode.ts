import { ATTRIBUTE_NODE, CDATA_SECTION_NODE, ELEMENT_NODE, TEXT_NODE } from './constants.ts';
import { ATTRS } from './attrList.ts';
import type { Attr } from './Attr.ts';
import type { DocumentFragment } from './DocumentFragment.ts';
import type { Element } from './Element.ts';
import type { Node } from './Node.ts';
import type { TextNode } from './TextNode.ts';

function attrsEqual (a: Attr, b: Attr): boolean {
  return (
    a.localName === b.localName &&
    a.value === b.value &&
    a.namespaceURI === b.namespaceURI
  );
}

/**
 * Test if two nodes are equal, as DOM's `isEqualNode` does. Nodes are equal if
 * they are of the same type, have the same names, namespaces, and data, have
 * the same attributes in any order, and have equal children in the same
 * order. Parents and owner elements are not compared.
 *
 * @param a A node.
 * @param b The node to compare it to.
 * @returns True if the nodes are equal.
 */
export function isEqualNode (a: Node | DocumentFragment, b: Node | DocumentFragment | null): boolean {
  if (a === b) {
    return true;
  }
  if (a.nodeType !== b?.nodeType) {
    return false;
  }

  const type = a.nodeType;
  if (type === ELEMENT_NODE) {
    const ea = a as Element;
    const eb = b as Element;
    if (
      ea.localName !== eb.localName ||
      ea.prefix !== eb.prefix ||
      ea.namespaceURI !== eb.namespaceURI
    ) {
      return false;
    }
    const attrsA = ea[ATTRS];
    const attrsB = eb[ATTRS];
    if (
      attrsA.length !== attrsB.length ||
      !attrsA.every(attrA => attrsB.some(attrB => attrsEqual(attrA, attrB)))
    ) {
      return false;
    }
  }
  else if (type === ATTRIBUTE_NODE) {
    return attrsEqual(a as Attr, b as Attr);
  }
  else if (type === TEXT_NODE || type === CDATA_SECTION_NODE) {
    if ((a as TextNode).data !== (b as TextNode).data) {
      return false;
    }
  }

  const childrenA = a.childNodes;
  const childrenB = b.childNodes;
  if (childrenA.length !== childrenB.length) {
    return false;
  }
  for (let i = 0; i < childrenA.length; i++) {
    if (!isEqualNode(childrenA[i], childrenB[i])) {
      return false;
    }
  }
  return true;
}
