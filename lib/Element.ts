import { Node } from './Node.js';
import { ELEMENT_NODE } from './constants.js';
import { JsonML, type JsonMLElement } from './JsonML.js';
import { domQuery } from './domQuery/index.js';
import { findAll } from './findAll.js';
import { isElement } from './isElement.ts';

// eslint-disable-next-line @typescript-eslint/unbound-method
const hasOwnProperty = Object.prototype.hasOwnProperty;

/**
 * A class describing an Element.
 *
 * @augments Node
 */
export class Element extends Node {
  /** The namespace prefix of the element, or null if no prefix is specified. */
  ns: string;
  /** The name of the tag for the given element, excluding any namespace prefix. */
  tagName: string;
  /** The full name of the tag for the given element, including a namespace prefix. */
  fullName: string;
  /** A state representing if the element was "self-closed" when read. */
  closed: boolean;
  /** An object of attributes assigned to this element. */
  attr: Record<string, string>;
  /** The node's parent node. */
  parentNode: Element | null = null;

  /**
   * Constructs a new Element instance.
   *
   * @param tagName The tag name of the node.
   * @param [attr={}] A collection of attributes to assign.
   * @param [closed=false] Was the element "self-closed" when read.
   */
  constructor (tagName: string, attr: Record<string, string> = {}, closed: boolean = false) {
    super();
    let tagName_ = tagName;
    let ns: string | null = null;
    if (tagName.includes(':')) {
      [ ns, tagName_ ] = tagName.split(':');
    }
    this.ns = ns || '';
    this.tagName = tagName_;
    this.fullName = tagName;
    this.closed = !!closed;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    this.attr = Object.assign(Object.create(null), attr);

    // inherited instance props from Node
    this.nodeName = this.tagName.toUpperCase();
    this.nodeType = ELEMENT_NODE;
    this.childNodes = [];
  }

  // overwrites super
  get preserveSpace (): boolean {
    if (this.attr?.['xml:space'] === 'preserve') {
      return true;
    }
    if (this.parentNode) {
      return this.parentNode.preserveSpace;
    }
    return false;
  }

  /**
   * A list containing all child Elements of the current Element.
   */
  get children (): Element[] {
    return this.childNodes.filter(isElement);
  }

  /**
   * Read an attribute from the element.
   *
   * @param name The attribute name to read.
   * @returns The attribute.
   */
  getAttribute (name: string): string | null {
    return this.hasAttribute(name) ? this.attr[name] : null;
  }

  /**
   * Sets an attribute on the element.
   *
   * @param name The attribute name to read.
   * @param value The value to set
   */
  setAttribute (name: string, value: string) {
    this.attr[name] = value;
  }

  /**
   * Test if an attribute exists on the element.
   *
   * @param name The attribute name to test for.
   * @returns True if the attribute is present.
   */
  hasAttribute (name: string): boolean {
    return this.attr && hasOwnProperty.call(this.attr, name);
  }

  /**
   * Remove an attribute off the element.
   *
   * @param name The attribute name to remove.
   */
  removeAttribute (name: string) {
    delete this.attr[name];
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
    // @ts-ignore
    return findAll(this, tagName, []);
  }

  /**
   * Return the first descendant element that match a specified CSS selector.
   *
   * @param selector The CSS selector to filter by.
   * @returns The elements by tag name.
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

  /**
   * Returns a simple object representation of the node and its descendants.
   *
   * @returns JsonML representation of the nodes and its subtree.
   */
  toJS (): JsonMLElement {
    return JsonML(this);
  }
}
