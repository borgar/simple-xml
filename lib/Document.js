import { JsonML } from './JsonML.js';
import { Node } from './Node.js';
import { appendChild } from './appendChild.js';
import { ELEMENT_NODE, DOCUMENT_NODE } from './constants.js';
import { domQuery } from './domget.js';
import { findAll } from './findAll.js';

/**
 * This class describes an XML document.
 *
 * @augments Node
 */
export class Document extends Node {
  /**
   * Constructs a new Document instance.
   */
  constructor () {
    super();
    // inherited instance props from Node
    this.nodeName = '#document';
    this.nodeType = DOCUMENT_NODE;
  }

  // overwrites super
  get textContent () {
    return this.root ? this.root.textContent : '';
  }

  /**
   * A list containing all child Elements of the current Element.
   *
   * @type {Array<Node>}
   */
  get children () {
    return this.childNodes.filter(d => d && d.nodeType === ELEMENT_NODE);
  }

  /**
   * Return all child elements that have the specified tag name.
   *
   * @param {string} tagName The tag name to filter by.
   * @returns {Array<Node>} The elements by tag name.
   */
  getElementsByTagName (tagName) {
    if (!tagName) {
      throw new Error('1 argument required, but 0 present.');
    }
    return findAll(this, tagName, []);
  }

  /**
   * Return all child elements that match a specified CSS selector.
   *
   * @param {string} selector The CSS selector to filter by.
   * @returns {Array<Node>} The elements by tag name.
   */
  querySelectorAll (selector) {
    if (!selector) {
      throw new Error('1 argument required, but 0 present.');
    }
    return domQuery(this, selector);
  }

  // overwrites super
  appendChild (node) {
    if (this.root) {
      throw new Error('A document may only have one child/root element.');
    }
    appendChild(this, node);
    this.root = node;
    return node;
  }

  /**
   * Returns a simple object representation of the node and its descendants.
   *
   * @returns {Array<any>|null} JsonML representation of the nodes and its subtree.
   */
  toJS () {
    return this.root ? JsonML(this.root) : [];
  }
}
