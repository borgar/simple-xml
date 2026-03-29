import { appendChild } from './appendChild.js';
import { DocumentFragment } from './DocumentFragment.ts';
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
   * Returns the node's first child in the tree, or null if the node has no children.
   */
  get firstChild (): Node | null {
    return this.childNodes.at(0) ?? null;
  }

  /**
   * Returns the node's last child in the tree, or null if the node has no children.
   */
  get lastChild (): Node | null {
    return this.childNodes.at(-1) ?? null;
  }

  /**
   * Appends a child node into the current one.
   *
   * @param node The new child node
   * @returns The same node that was passed in.
   */
  appendChild<T extends Node | DocumentFragment> (node: T): T {
    if (!node) {
      throw new Error('1 argument required, but 0 present.');
    }
    if (!(node instanceof Node) && !(node instanceof DocumentFragment)) {
      throw new Error('Cannot appendChild: Child is not a node');
    }
    appendChild(this, node);
    return node;
  }

  /**
   * Inserts a node before a _reference node_ as a child of a specified _parent node_.
   *
   * @param newNode The node to be inserted.
   * @param referenceNode The node before which newNode is inserted. If this is null, then newNode is inserted at the end of node's child nodes.
   * @returns The added child (unless newNode is a DocumentFragment, in which case the empty DocumentFragment is returned).
   */
  insertBefore<T extends Node | DocumentFragment> (newNode: T, referenceNode: Node | null): T {
    if (referenceNode) {
      const index = this.childNodes.indexOf(referenceNode);
      if (index > -1) {
        const insertNodes = newNode instanceof Node ? [ newNode ] : newNode.childNodes;
        // update parentage for all the new nodes
        for (const node of insertNodes) {
          node.parentNode?.removeChild(node);
          node.parentNode = this;
        }
        // insert the new nodes
        this.childNodes.splice(index, 0, ...insertNodes);
      }
      return newNode;
    }
    return this.appendChild(newNode);
  }

  /**
   * Removes a child node from the DOM and returns the removed node.
   * @param node The child node to be removed.
   * @returns The removed child node.
   */
  removeChild (child: Node) {
    if (!child) {
      throw new TypeError('parameter 1 is not of type \'Node\'');
    }
    const index = this.childNodes.indexOf(child);
    if (index === -1) {
      // DOMException
      throw new Error('The node to be removed is not a child of this node.');
    }
    const node = this.childNodes.splice(index, 1).at(0);
    if (node) {
      node.parentNode = null;
    }
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
