import { JsonML, type JsonMLElement } from './JsonML.js';
import { Node } from './Node.js';
import { Element } from './Element.js';
import { appendChild } from './appendChild.js';
import { DOCUMENT_NODE } from './constants.js';
import { domQuery } from './domQuery/index.js';
import { findAll } from './findAll.js';
import { isElement } from './isElement.ts';

/**
 * This class describes an XML document.
 *
 * @augments Node
 */
export class Document extends Node {
  root: Element | null = null;

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
   */
  get children (): Element[] {
    return this.childNodes.filter(isElement);
  }

  /**
   * Return all descendant elements that have the specified tag name.
   *
   * @param tagName The tag name to filter by.
   * @returns The elements by tag name.
   */
  getElementsByTagName (tagName: string): Element[] {
    if (!tagName) {
      throw new Error('1 argument required, but 0 present.');
    }
    return findAll(this, tagName, []);
  }

  /**
   * Return the first descendant element that match a specified CSS selector.
   *
   * @param {string} selector The CSS selector to filter by.
   * @returns {Element | null} The elements by tag name.
   */
  querySelector (selector: string): Element | null {
    if (!selector) {
      throw new Error('1 argument required, but 0 present.');
    }
    return domQuery(this, selector)[0] || null;
  }

  /**
   * Return all descendant elements that match a specified CSS selector.
   *
   * @param selector The CSS selector to filter by.
   * @returns The elements by tag name.
   */
  querySelectorAll (selector: string): Element[] {
    if (!selector) {
      throw new Error('1 argument required, but 0 present.');
    }
    return domQuery(this, selector);
  }

  // overwrites super
  appendChild (node: Element): Element {
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
   * @returns JsonML representation of the nodes and its subtree.
   */
  toJS (): JsonMLElement | [] {
    return this.root ? JsonML(this.root) : [];
  }
}
