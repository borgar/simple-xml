import { appendChild } from './appendChild.ts';
import { DOCUMENT_FRAGMENT_NODE } from './constants.ts';
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
