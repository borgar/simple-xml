import { appendChild } from './appendChild.ts';
import { DOCUMENT_FRAGMENT_NODE } from './constants.ts';
import { isEqualNode } from './isEqualNode.ts';
import type { Node } from './Node.ts';
import { prettyPrint } from './prettyPrint.ts';
import { simplePrint } from './simplePrint.ts';

/**
 * A class describing a DocumentFragment.
 */
export class DocumentFragment {
  /** The immediate children contained in the fragment. */
  childNodes: Node[] = [];
  /** A numerical node type identifier. */
  nodeType: number = DOCUMENT_FRAGMENT_NODE;

  /**
   * Appends a child node into the document fragment.
   *
   * @param node The new child node
   * @returns The same node that was passed in.
   */
  appendChild<T extends Node | DocumentFragment> (node: T): T {
    appendChild(this, node);
    return node;
  }

  /**
   * Test if a node is equal to this one, as in the DOM. Nodes are equal if
   * they are of the same type, have the same names, namespaces, and data,
   * have the same attributes in any order, and have equal children in the
   * same order. Parents and owner elements are not compared, so equal
   * subtrees in different places, or different documents, are equal.
   *
   * @param otherNode The node to compare with.
   * @returns True if the nodes are equal.
   */
  isEqualNode (otherNode: Node | DocumentFragment | null): boolean {
    return isEqualNode(this, otherNode);
  }

  /** @ignore */
  toString (): string {
    return '#document-fragment';
  }

  /**
   * Print the document as a string.
   *
   * @param pretty Apply automatic linebreaks and indentation to the output.
   * @returns The document as an XML string.
   */
  print (pretty = false): string {
    return pretty
      ? prettyPrint(this)
      : simplePrint(this);
  }
}
