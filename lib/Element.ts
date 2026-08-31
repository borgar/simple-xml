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
import type { XMLAttr } from './XMLAttr.ts';
import { createNamedNodeMap, type NamedNodeMap } from './NamedNodeMap.ts';
import { Attr } from './Attr.ts';
import { splitTagName } from './splitTagName.ts';

/**
 * A class describing an Element.
 *
 * @augments Node
 */
export class Element extends Node {
  /** The namespace prefix of the element, or null' if no prefix is specified. */
  prefix: string | null;
  /** The name of the tag for the given element, excluding any namespace prefix. */
  localName: string;
  /** A state representing if the element was "self-closed" when read. */
  closed: boolean;
  /** The node's parent node. */
  parentNode: Element | null = null;
  /** A list of attributes assigned to this element. */
  attributes: NamedNodeMap;

  /**
   * Constructs a new Element instance.
   *
   * @param tagName The tag name of the node.
   * @param [attr={}] A collection of attributes to assign. Values of null or undefined will be ignored.
   * @param [closed=false] Was the element "self-closed" when read.
   */
  constructor (tagName: string, attr?: XMLAttr | null, closed: boolean = false) {
    super();

    const [ prefix, localName ] = splitTagName(tagName);
    this.prefix = prefix;
    this.localName = localName;

    this.closed = !!closed;

    this.attributes = createNamedNodeMap();
    this.setAttrValues(attr ?? null);

    // inherited instance props from Node
    this.nodeName = this.localName.toUpperCase();
    this.nodeType = ELEMENT_NODE;
    this.childNodes = [];
  }

  get tagName () {
    return this.localName;
  }

  /** The full name of the tag for the given element, including a namespace prefix. */
  get fullName () {
    return this.prefix
      ? this.prefix + ':' + this.localName
      : this.localName;
  }

  hasAttributes () {
    return !!this.attributes.length;
  }

  // overwrites super
  get preserveSpace (): boolean {
    if (this.getAttribute('xml:space') === 'preserve') {
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
    return this.attributes.getNamedItem(name)?.value ?? null;
  }

  /**
   * Sets an attribute on the element.
   *
   * @param name The attribute name to read.
   * @param value The value to set
   */
  setAttribute (name: string, value: string | number | boolean) {
    this.attributes.setNamedItem(new Attr(name, value));
  }

  /**
   * Test if an attribute exists on the element.
   *
   * @param name The attribute name to test for.
   * @returns True if the attribute is present.
   */
  hasAttribute (name: string): boolean {
    return this.attributes.getNamedItem(name) != null;
  }

  /**
   * Assign multiple attributes at once to the current elemeent.
   *
   * @param attr A record of attributes to assign to the element.
   *             If the value is null or undefined, the attribute will be omitted.
   */
  setAttrValues (attr: XMLAttr | null) {
    if (attr) {
      for (const [ key, val ] of Object.entries(attr)) {
        if (val != null) {
          this.setAttribute(key, val);
        }
      }
    }
  }

  /**
   * Remove an attribute off the element.
   *
   * @param name The attribute name to remove.
   */
  removeAttribute (name: string) {
    this.attributes.removeNamedItem(name);
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
   * This method creates an element and immediately inserts it as a child of the element on which the
   * method was called.
   *
   * The method implicitly creates the new element in the same namespace as the parent element.
   *
   * @param qualifiedName The local tagName of the element.
   * @param attr A record of attributes to assign to the new element.
   *             If the value is null or undefined, the attribute will be omitted.
   * @param children Nodes to insert as children.
   *                 Strings will be converted to TextNodes and arrays will be flattened.
   * @returns A new Element instance.
   */
  createChild (
    qualifiedName: string,
    attr?: XMLAttr | null,
    ...children: (CreateChildArgument | CreateChildArgument[])[]
  ): Element {
    const elm = new Element(qualifiedName);
    elm.prefix ??= this.prefix;
    elm.setAttrValues(attr ?? null);
    this.appendChild(elm);
    for (const child of children) {
      elm.append(child);
    }
    return elm;
  }

  /**
   * Return all descendant elements that have the specified tag name.
   *
   * @param tagName The tag name to filter by.
   * @returns The elements by tag name.
   */
  getElementsByTagName (tagName: string): Element[] {
    if (!tagName) {
      throw new TypeError('1 argument required, but 0 present.');
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
      throw new TypeError('1 argument required, but 0 present.');
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
      throw new TypeError('1 argument required, but 0 present.');
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
