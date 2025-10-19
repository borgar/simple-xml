import { Node } from './Node.js';
import { ELEMENT_NODE } from './constants.js';
import { JsonML } from './JsonML.js';
import { domQuery } from './domQuery/index.js';
import { findAll } from './findAll.js';
const hasOwnProperty = Object.prototype.hasOwnProperty;

/**
 * A class describing an Element.
 *
 * @augments Node
 */
export class Element extends Node {
  /**
   * Constructs a new Element instance.
   *
   * @param {string} tagName The tag name of the node.
   * @param {object} [attr={}] A collection of attributes to assign.
   * @param {boolean} [closed=false] Was the element "self-closed" when read.
   */
  constructor (tagName, attr = {}, closed = false) {
    super();
    let tagName_ = tagName;
    let ns = null;
    if (tagName.includes(':')) {
      [ ns, tagName_ ] = tagName.split(':');
    }
    /**
     * The namespace prefix of the element, or null if no prefix is specified.
     * @type {string}
     */
    this.ns = ns;
    /**
     * The name of the tag for the given element, excluding any namespace prefix.
     * @type {string}
     */
    this.tagName = tagName_;
    /**
     * The full name of the tag for the given element, including a namespace prefix.
     * @type {string}
     */
    this.fullName = tagName;
    /**
     * A state representing if the element was "self-closed" when read.
     * @type {boolean}
     */
    this.closed = !!closed;
    /**
     * An object of attributes assigned to this element.
     * @type {Object<string,string>}
     */
    this.attr = Object.assign(Object.create(null), attr);

    // inherited instance props from Node
    this.nodeName = this.tagName.toUpperCase();
    this.nodeType = ELEMENT_NODE;
    this.childNodes = [];
  }

  // overwrites super
  get preserveSpace () {
    if (this.attr && this.attr['xml:space'] === 'preserve') {
      return true;
    }
    if (this.parentNode) {
      return this.parentNode.preserveSpace;
    }
    return false;
  }

  /**
   * A list containing all child Elements of the current Element.
   *
   * @type {Array<Element>}
   */
  get children () {
    return this.childNodes.filter(d => d && d.nodeType === ELEMENT_NODE);
  }

  /**
   * Read an attribute from the element.
   *
   * @param {string} name The attribute name to read.
   * @returns {string|null} The attribute.
   */
  getAttribute (name) {
    return this.hasAttribute(name) ? this.attr[name] : null;
  }

  /**
   * Sets an attribute on the element.
   *
   * @param {string} name The attribute name to read.
   * @param {string} value The value to set
   */
  setAttribute (name, value) {
    this.attr[name] = value;
  }

  /**
   * Test if an attribute exists on the element.
   *
   * @param {string} name The attribute name to test for.
   * @returns {boolean} True if the attribute is present.
   */
  hasAttribute (name) {
    return this.attr && hasOwnProperty.call(this.attr, name);
  }

  /**
   * Remove an attribute off the element.
   *
   * @param {string} name The attribute name to remove.
   */
  removeAttribute (name) {
    delete this.attr[name];
  }

  /**
   * Return all descendant elements that have the specified tag name.
   *
   * @param {string} tagName The tag name to filter by.
   * @returns {Array<Element>} The elements by tag name.
   */
  getElementsByTagName (tagName) {
    if (!tagName) {
      throw new Error('1 argument required, but 0 present.');
    }
    // @ts-ignore
    return findAll(this, tagName, []);
  }

  /**
   * Return the first descendant element that match a specified CSS selector.
   *
   * @param {string} selector The CSS selector to filter by.
   * @returns {Element | null} The elements by tag name.
   */
  querySelector (selector) {
    if (!selector) {
      throw new Error('1 argument required, but 0 present.');
    }
    return domQuery(this, selector)[0] || null;
  }

  /**
   * Return all descendant elements that match a specified CSS selector.
   *
   * @param {string} selector The CSS selector to filter by.
   * @returns {Array<Element>} The elements by tag name.
   */
  querySelectorAll (selector) {
    if (!selector) {
      throw new Error('1 argument required, but 0 present.');
    }
    return domQuery(this, selector);
  }

  /**
   * Returns a simple object representation of the node and its descendants.
   *
   * @returns {Array<any>|string} JsonML representation of the nodes and its subtree.
   */
  toJS () {
    return JsonML(this);
  }
}
