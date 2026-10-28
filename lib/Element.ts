import { Node } from './Node.js';
import { ELEMENT_NODE, XML_NS, XMLNS_NS } from './constants.js';
import { JsonML, type JsonMLElement } from './JsonML.js';
import { domQuery } from './domQuery/index.js';
import { findAll } from './findAll.js';
import { isElement } from './isElement.ts';
import { TextNode } from './TextNode.ts';
import { DocumentFragment } from './DocumentFragment.ts';
import { checkHierarchy } from './checkHierarchy.ts';
import type { CreateChildArgument } from './CreateChildArgument.ts';
import { prettyPrint } from './prettyPrint.ts';
import { simplePrint } from './simplePrint.ts';
import type { XMLAttr } from './XMLAttr.ts';
import { createNamedNodeMap, NamedNodeMapImpl, type NamedNodeMap } from './NamedNodeMap.ts';
import { ATTRS } from './attrList.ts';
import { Attr } from './Attr.ts';
import { qnameColon } from './splitQName.ts';
import { checkNamespace } from './checkNamespace.ts';
import { NamespaceError } from './errors.ts';

// The element, then each of its ancestor elements.
function* selfAndAncestors (el: Element): Generator<Element> {
  let node: Node | null = el;
  while (isElement(node)) {
    yield node;
    node = node.parentNode;
  }
}

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
  /** The node's parent node. */
  parentNode: Element | null = null;
  /** @internal The attributes, in order. */
  [ATTRS]: Attr[];
  // A map over the same array, and the proxy that `attributes` returns, made on first read.
  #attrs: NamedNodeMapImpl;
  #attrProxy: NamedNodeMap | null = null;

  /**
   * Constructs a new Element instance.
   *
   * @param tagName The tag name of the node.
   * @param [attr={}] A collection of attributes to assign. Values of null or undefined will be ignored.
   * @throws {TypeError} If attr is not an object, or looks like a child (an array or a node).
   */
  constructor (tagName: string, attr?: XMLAttr | null) {
    super();

    const colon = qnameColon(tagName);
    this.prefix = colon === -1 ? null : tagName.slice(0, colon);
    this.localName = colon === -1 ? tagName : tagName.slice(colon + 1);

    const list: Attr[] = [];
    this[ATTRS] = list;
    this.#attrs = new NamedNodeMapImpl(list, this);
    this.setAttrValues(attr ?? null);

    // inherited instance props from Node
    this.nodeName = this.localName.toUpperCase();
    this.nodeType = ELEMENT_NODE;
  }

  /** A list of attributes assigned to this element. */
  get attributes (): NamedNodeMap {
    // Test tools such as Vitest copy elements with Object.create(prototype) and
    // then copy the own properties, so a copy has the attribute array but no
    // private fields.
    if (!(#attrs in this)) {
      return createNamedNodeMap(new NamedNodeMapImpl((this as Element)[ATTRS], this as Element));
    }
    return (this.#attrProxy ??= createNamedNodeMap(this.#attrs));
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

  /**
   * The namespace URI of the element, or null if it has none. It is resolved
   * from the element's prefix and the `xmlns` declarations on the element and
   * its ancestors, so it changes if the element is moved.
   */
  get namespaceURI (): string | null {
    return this.lookupNamespaceURI(this.prefix);
  }

  /**
   * Find the namespace URI that a prefix is bound to, using the `xmlns`
   * declarations on the element and its ancestors.
   *
   * @param prefix The prefix to look up, or null for the default namespace.
   * @returns The namespace URI, or null if the prefix is not bound.
   */
  lookupNamespaceURI (prefix: string | null): string | null {
    if (prefix === 'xml') {
      return XML_NS;
    }
    if (prefix === 'xmlns') {
      return XMLNS_NS;
    }
    const declaration = prefix ? 'xmlns:' + prefix : 'xmlns';
    for (const el of selfAndAncestors(this)) {
      const value = el.getAttribute(declaration);
      if (value != null) {
        // xmlns="" removes the default namespace
        return value || null;
      }
    }
    return null;
  }

  /**
   * Find a prefix that is bound to a namespace URI, using the `xmlns`
   * declarations on the element and its ancestors. A prefix that a nearer
   * element binds to a different URI is skipped.
   *
   * @param namespaceURI The namespace URI to look up.
   * @returns The prefix, or null if no prefix is bound to the namespace.
   */
  lookupPrefix (namespaceURI: string | null): string | null {
    if (!namespaceURI) {
      return null;
    }
    if (namespaceURI === XML_NS) {
      return 'xml';
    }
    if (namespaceURI === XMLNS_NS) {
      return 'xmlns';
    }
    for (const el of selfAndAncestors(this)) {
      for (const attr of el.attributes) {
        if (
          attr.prefix === 'xmlns' &&
          attr.value === namespaceURI &&
          this.lookupNamespaceURI(attr.localName) === namespaceURI
        ) {
          return attr.localName;
        }
      }
    }
    return null;
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
    return this.#attrs.getNamedItem(name)?.value ?? null;
  }

  /**
   * Sets an attribute on the element.
   *
   * @param name The attribute name to read.
   * @param value The value to set
   */
  setAttribute (name: string, value: string | number | boolean) {
    // as in the DOM, an existing Attr is updated rather than replaced
    for (const attr of this[ATTRS]) {
      if (attr.fullName === name) {
        attr.value = String(value);
        return;
      }
    }
    this.#attrs.setNamedItem(new Attr(name, value));
  }

  /**
   * Test if an attribute exists on the element.
   *
   * @param name The attribute name to test for.
   * @returns True if the attribute is present.
   */
  hasAttribute (name: string): boolean {
    return this.#attrs.getNamedItem(name) != null;
  }

  /**
   * Assign multiple attributes at once to the current elemeent.
   *
   * @param [attr] A record of attributes to assign to the element.
   *               If the value is null or undefined, the attribute will be omitted.
   * @throws {TypeError} If attr is not an object, or looks like a child (an array or a node).
   */
  setAttrValues (attr?: XMLAttr | null) {
    if (attr != null) {
      if (
        typeof attr !== 'object' ||
        Array.isArray(attr) ||
        Array.isArray((attr as { childNodes?: unknown }).childNodes)
      ) {
        throw new TypeError('Attributes must be an object of names and values, or null.');
      }
      for (const key in attr) {
        if (Object.hasOwn(attr, key)) {
          const val = attr[key];
          if (val != null) {
            this.setAttribute(key, val);
          }
        }
      }
    }
  }

  /**
   * Remove an attribute off the element. Does nothing if the attribute is not present.
   *
   * @param name The qualified name of the attribute to remove.
   */
  removeAttribute (name: string) {
    if (this.#attrs.getNamedItem(name)) {
      this.#attrs.removeNamedItem(name);
    }
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
    for (const n of nodes) {
      if (Array.isArray(n)) {
        for (const m of n) {
          this.#appendOne(m);
        }
      }
      else {
        this.#appendOne(n);
      }
    }
  }

  #appendOne (n: CreateChildArgument): void {
    if (typeof n === 'string' || typeof n === 'number' || typeof n === 'boolean') {
      this.appendChild(new TextNode(n));
    }
    else if (n) {
      this.appendChild(n);
    }
  }

  /**
   * Insert a set of Node objects or strings before the first child of the Element.
   * Strings are inserted as equivalent Text nodes.
   */
  prepend (...nodes: (CreateChildArgument | CreateChildArgument[])[]): void {
    const insertNodes: (Node | DocumentFragment)[] = [];
    for (const n of nodes.flat()) {
      if (typeof n === 'string' || typeof n === 'number' || typeof n === 'boolean') {
        insertNodes.push(new TextNode(n));
      }
      else if (n) {
        insertNodes.push(n);
      }
    }
    const moving = insertNodes.flatMap(n => (n instanceof DocumentFragment ? n.childNodes : [ n ]));
    checkHierarchy(this, moving);
    // as in the DOM, insert everything before the first child that isn't itself being inserted
    const reference = this.childNodes.find(child => !moving.includes(child)) ?? null;
    for (const n of insertNodes) {
      this.insertBefore(n, reference);
    }
  }

  /**
   * This method creates an element and immediately inserts it as a child of the element on which the
   * method was called.
   *
   * The method implicitly creates the new element in the same namespace as the parent element.
   *
   * @param qualifiedName The local tagName of the element.
   * @param [attr] A record of attributes to assign to the new element.
   *               If the value is null or undefined, the attribute will be omitted.
   * @param children Nodes to insert as children.
   *                 Strings will be converted to TextNodes and arrays will be flattened.
   * @returns A new Element instance.
   * @throws {TypeError} If attr is not an object, or looks like a child (an array or a node).
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
   * Create an element in a namespace and insert it as the last child of this
   * element. Unlike `createChild`, the new element doesn't take this element's
   * prefix, and missing namespace declarations are added to it.
   *
   * - With no namespace, the new element is unprefixed. If a default
   *   namespace is in scope, `xmlns=""` is added to it.
   * - With a namespace and an unprefixed name, the default namespace or a
   *   prefix in scope is used. If the namespace isn't declared, this throws.
   * - With a namespace and a prefixed name, the name is used as given. If the
   *   prefix isn't declared, `xmlns:prefix` is added to the new element. If
   *   it's bound to another namespace, this throws.
   *
   * Namespace declarations in `attr` count as being in scope, but this throws
   * if they contradict the namespace.
   *
   * @param namespaceURI The namespace of the new element, or null or an empty
   *                     string for no namespace.
   * @param qualifiedName The tagName of the element, with or without a prefix.
   * @param [attr] A record of attributes to assign to the new element.
   *               If the value is null or undefined, the attribute will be omitted.
   * @param children Nodes to insert as children.
   *                 Strings will be converted to TextNodes and arrays will be flattened.
   * @returns A new Element instance.
   * @throws {NamespaceError} If the namespace can't be used with the name here.
   * @throws {InvalidCharacterError} If the name is not a valid XML name.
   * @throws {TypeError} If attr is not an object, or looks like a child (an array or a node).
   */
  createChildNS (
    namespaceURI: string | null,
    qualifiedName: string,
    attr?: XMLAttr | null,
    ...children: (CreateChildArgument | CreateChildArgument[])[]
  ): Element {
    // as in the DOM, an empty string means no namespace
    const uri = namespaceURI || null;
    const elm = new Element(qualifiedName);
    checkNamespace(uri, elm.prefix, qualifiedName);
    elm.setAttrValues(attr ?? null);

    // what a prefix means on the new element: its own declarations come first
    const resolve = (prefix: string | null): string | null => {
      const declaration = prefix ? 'xmlns:' + prefix : 'xmlns';
      return elm.hasAttribute(declaration)
        ? elm.getAttribute(declaration) || null
        : this.lookupNamespaceURI(prefix);
    };

    let prefix = elm.prefix;
    if (uri && !prefix && resolve(null) !== uri) {
      // find a prefix for the namespace, on the new element or in scope here
      const own = [ ...elm.attributes ].find(a => a.prefix === 'xmlns' && a.value === uri)?.localName;
      prefix = own ?? this.lookupPrefix(uri);
      if (!prefix || resolve(prefix) !== uri) {
        throw new NamespaceError('Unknown namespace ' + uri);
      }
      elm.prefix = prefix;
    }

    const current = resolve(prefix);
    if (current !== uri) {
      const declaration = prefix ? 'xmlns:' + prefix : 'xmlns';
      // a declaration on the new element, or a prefix bound to another
      // namespace, can't be changed without changing what it means
      if (elm.hasAttribute(declaration) || (prefix && current)) {
        throw new NamespaceError(`${declaration} is ${current ?? 'not set'} here, not ${uri ?? 'null'}`);
      }
      elm.setAttribute(declaration, uri ?? '');
      // put the added declaration before the attributes from attr
      const list = elm[ATTRS];
      list.unshift(list.pop()!);
    }

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
    return pretty ? prettyPrint(this) : simplePrint(this);
  }
}
