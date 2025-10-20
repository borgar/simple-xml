import { appendChild } from './appendChild.js';
import { prettyPrint } from './prettyPrint.js';

/**
 * A class describing a Node.
 *
 * @class Node
 */
export class Node {
  /**
   * Constructs a new Node instance.
   */
  constructor () {
    /**
     * The node's children.
     * @type {Array<Node>}
     */
    this.childNodes = [];
    /**
     * A node type string identifier.
     * @type {string}
     */
    this.nodeName = '#node';
    /**
     * A numerical node type identifier.
     * @type {number|null}
     */
    this.nodeType = null;
    /**
     * The node's parent node.
     * @type {Node|null}
     */
    this.parentNode = null;
  }

  /**
   * Appends a child node into the current one.
   *
   * @param {Node} node The new child node
   * @returns {Node} The same node that was passed in.
   */
  appendChild (node) {
    if (!node) {
      throw new Error('1 argument required, but 0 present.');
    }
    appendChild(this, node);
    return node;
  }

  /**
   * True if xml:space has been set to true for this node or any of its ancestors.
   *
   * @type {boolean}
   */
  get preserveSpace () {
    if (this.parentNode) {
      return this.parentNode.preserveSpace;
    }
    return false;
  }

  /**
   * The text content of this node (and its children).
   *
   * @type {string}
   */
  get textContent () {
    let s = '';
    for (const child of this.childNodes) {
      s += child.textContent;
    }
    return s;
  }

  /**
   * Returns a string representation of the node.
   * @returns {string} A formatted XML source.
   */
  toString () {
    return prettyPrint(this);
  }
}
