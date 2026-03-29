import { Node } from './Node.js';
import { ELEMENT_NODE, XML_DECLARATION } from './constants.js';
import { JsonML, type JsonMLElement } from './JsonML.js';
import { domQuery } from './domQuery/index.js';
import { findAll } from './findAll.js';
import { isElement } from './isElement.ts';
import { TextNode } from './TextNode.ts';
import type { CreateChildArgument } from './CreateChildArgument.ts';
import { prettyPrint } from './prettyPrint.ts';
import { simplePrint } from './simplePrint.ts';

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
   * @param [attr={}] A collection of attributes to assign. Values of null or undefined will be ignored.
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
    this.attr = Object.create(null);
    for (const [ k, v ] of Object.entries(attr)) {
      if (v != null) {
        this.setAttribute(k, v);
      }
    }

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
   * Returns an element's first child Element, or null if there are no child elements
   */
  get firstElementChild (): Element | null {
    for (const child of this.childNodes) {
      if (isElement(child)) {
        return child;
      }
    }
    return null;
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
  setAttribute (name: string, value: string | number | boolean) {
    this.attr[name] = String(value);
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

  get className (): string {
    return this.getAttribute('class') ?? '';
  }

  set className (val: unknown) {
    this.setAttribute('class', String(val));
  }

  /**
   * Inserts a set of Node objects or strings after the last child of the Element.
   * Strings are inserted as equivalent Text nodes.
   */
  append (...nodes: (CreateChildArgument | CreateChildArgument[])[]): void {
    const flatNodes = nodes.flat();
    for (const n of flatNodes) {
      if (typeof n === 'string' || typeof n === 'number' || typeof n === 'boolean') {
        this.appendChild(new TextNode(n));
      }
      else if (n) {
        this.appendChild(n);
      }
    }
  }

  /**
   * Insert a set of Node objects or strings before the first child of the Element.
   * Strings are inserted as equivalent Text nodes.
   */
  prepend (...nodes: (CreateChildArgument | CreateChildArgument[])[]): void {
    const flatNodes = nodes.flat();
    for (const n of flatNodes) {
      if (typeof n === 'string' || typeof n === 'number' || typeof n === 'boolean') {
        this.insertBefore(new TextNode(n), this.firstChild);
      }
      else if (n) {
        this.insertBefore(n, this.firstChild);
      }
    }
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

  /**
   * Print the document as a string.
   *
   * @param pretty Apply automatic linebreaks and indentation to the output.
   * @returns The document as an XML string.
   */
  print (pretty = false): string {
    return `${XML_DECLARATION}\n` + (
      pretty ? prettyPrint(this) : simplePrint(this)
    );
  }
}
