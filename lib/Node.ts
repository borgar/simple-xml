import { appendChild } from './appendChild.js';
import { checkHierarchy } from './checkHierarchy.ts';
import { DocumentFragment } from './DocumentFragment.ts';
import { NotFoundError } from './errors.js';
import { prettyPrint } from './prettyPrint.js';
import { isElement } from './isElement.ts';
import { isEqualNode } from './isEqualNode.ts';
import type { Element } from './Element.ts';

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
  appendChild<T extends Node | DocumentFragment> (this: Node, node: T): T {
    if (!node) {
      throw new TypeError('1 argument required, but 0 present.');
    }
    if (!(node instanceof Node) && !(node instanceof DocumentFragment)) {
      throw new TypeError('Cannot appendChild: Child is not a node');
    }
    // a detached node without children can't contain this one, so it needs no checks
    if (node instanceof Node && node !== this && !node.parentNode && !node.childNodes.length) {
      node.parentNode = this;
      this.childNodes.push(node);
      return node;
    }
    appendChild(this, node);
    return node;
  }

  /**
   * Inserts a node before a _reference node_ as a child of a specified _parent node_.
   *
   * @param newNode The node to be inserted.
   * @param referenceNode The node before which newNode is inserted. If this is null, then newNode is inserted at the end of node's child nodes.
   * @returns The node or DocumentFragment that was passed in.
   * @throws {HierarchyError} If newNode is this node or one of its ancestors.
   * @throws {NotFoundError} If referenceNode is not a child of this node.
   */
  insertBefore<T extends Node | DocumentFragment> (newNode: T, referenceNode: Node | null): T {
    if (!referenceNode) {
      return this.appendChild(newNode);
    }
    const insertNodes = newNode instanceof Node ? [ newNode ] : [ ...newNode.childNodes ];
    checkHierarchy(this, insertNodes);
    if (referenceNode.parentNode !== this) {
      throw new NotFoundError('The reference node is not a child of this node.');
    }
    // as in the DOM, a node that is its own reference goes before its next sibling
    if (referenceNode === newNode) {
      const next = this.childNodes[this.childNodes.indexOf(referenceNode) + 1];
      if (!next) {
        return newNode;
      }
      referenceNode = next;
    }
    // detach the new nodes before finding the index, as they may be children here
    for (const node of insertNodes) {
      node.parentNode?.removeChild(node);
      node.parentNode = this;
    }
    this.childNodes.splice(this.childNodes.indexOf(referenceNode), 0, ...insertNodes);
    return newNode;
  }

  /**
   * Removes a child node from the DOM and returns the removed node.
   * @param child The child node to be removed.
   * @returns The removed child node.
   */
  removeChild (child: Node) {
    if (!child) {
      throw new TypeError('parameter 1 is not of type \'Node\'');
    }
    const index = this.childNodes.indexOf(child);
    if (index === -1) {
      throw new NotFoundError('The node to be removed is not a child of this node.');
    }
    const node = this.childNodes.splice(index, 1).at(0);
    if (node) {
      node.parentNode = null;
    }
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

  /**
   * Find the namespace URI that a prefix is bound to. As in the DOM, elements
   * resolve it from their own `xmlns` declarations and their ancestors', and
   * other nodes ask an element: a document its root, an attribute its owner
   * element, and anything else its parent element.
   *
   * @param prefix The prefix to look up, or null for the default namespace.
   * @returns The namespace URI, or null if the prefix is not bound.
   */
  lookupNamespaceURI (prefix: string | null): string | null {
    return this._namespaceElement()?.lookupNamespaceURI(prefix) ?? null;
  }

  /**
   * Find a prefix that is bound to a namespace URI. Nodes other than elements
   * ask an element, as `lookupNamespaceURI` does.
   *
   * @param namespaceURI The namespace URI to look up.
   * @returns The prefix, or null if no prefix is bound to the namespace.
   */
  lookupPrefix (namespaceURI: string | null): string | null {
    return this._namespaceElement()?.lookupPrefix(namespaceURI) ?? null;
  }

  /**
   * Test if a namespace URI is the default namespace at this node.
   *
   * @param namespaceURI The namespace URI to test, or null for no namespace.
   * @returns True if unprefixed elements here belong to the namespace.
   */
  isDefaultNamespace (namespaceURI: string | null): boolean {
    return this.lookupNamespaceURI(null) === (namespaceURI || null);
  }

  /**
   * The element that namespace lookups on this node are delegated to.
   *
   * @internal
   */
  protected _namespaceElement (): Element | null {
    return isElement(this.parentNode) ? this.parentNode : null;
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
