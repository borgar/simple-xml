import { appendChild } from './appendChild.js';
import { prettyPrint } from './prettyPrint.js';

/**
 * A class describing a Node.
 */
export class Node {
  /** The node's immediate children. */
  childNodes: Node[] = [];
  /** A node type string identifier. */
  nodeName: string = '#node';
  /** A numerical node type identifier. */
  nodeType: number = 0;
  /** The node's parent node. */
  parentNode: Node | null = null;

  /**
   * Appends a child node into the current one.
   *
   * @param node The new child node
   * @returns The same node that was passed in.
   */
  appendChild (node: Node): Node {
    if (!node) {
      throw new Error('1 argument required, but 0 present.');
    }
    if (!(node instanceof Node)) {
      throw new Error('Cannot appendChild: Child is not a node');
    }
    appendChild(this, node);
    return node;
  }

  /**
   * True if xml:space has been set to true for this node or any of its ancestors.
   */
  get preserveSpace (): boolean {
    if (this.parentNode) {
      return this.parentNode.preserveSpace;
    }
    return false;
  }

  /**
   * The text content of this node (and its children).
   */
  get textContent (): string {
    let s = '';
    for (const child of this.childNodes) {
      s += child.textContent;
    }
    return s;
  }

  /**
   * Returns a string representation of the node.
   * @returns A formatted XML source.
   */
  toString (): string {
    return prettyPrint(this);
  }
}
