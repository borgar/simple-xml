import { JsonML, type JsonMLElement } from './JsonML.js';
import { Node } from './Node.js';
import { Element } from './Element.js';
import { appendChild } from './appendChild.js';
import { DOCUMENT_NODE, XML_DECLARATION } from './constants.js';
import { splitQName } from './splitQName.ts';
import { checkNamespace } from './checkNamespace.ts';
import { domQuery } from './domQuery/index.js';
import { findAll } from './findAll.js';
import { isElement } from './isElement.ts';
import { DocumentFragment } from './DocumentFragment.ts';
import { NSMap } from './NSMap.ts';
import { prettyPrint } from './prettyPrint.ts';
import { simplePrint } from './simplePrint.ts';
import type { CreateChildArgument } from './CreateChildArgument.ts';
import type { XMLAttr } from './XMLAttr.ts';
import { HierarchyError, NamespaceError } from './errors.js';

/**
 * This class describes an XML document.
 *
 * @augments Node
 */
export class Document extends Node {
  // namespaces attached with attachNS, which are kept declared on the root
  #namespaces = new NSMap();

  /**
   * Constructs a new Document instance.
   */
  constructor () {
    super();
    // inherited instance props from Node
    this.nodeName = '#document';
    this.nodeType = DOCUMENT_NODE;
  }

  /**
   * Attach a namespace to the document.
   *
   * @param namespaceURI The namespace URI to attach.
   * @param [prefix] Prefix to use on elements belonging to the namespace.
   */
  attachNS (namespaceURI: string, prefix = ''): (name: string, attr?: XMLAttr | null, ...children: (CreateChildArgument | CreateChildArgument[])[]) => Element {
    this.#namespaces.add(namespaceURI, prefix);
    this._updateNS();

    // Return a new create function bound to the namespace
    return this.createElementNS.bind(this, namespaceURI);
  }

  // The prefix to use for a namespace ('' for the default namespace)
  #prefixFor (namespaceURI: string): string {
    const attached = this.#namespaces.get(namespaceURI);
    if (attached != null) {
      return attached;
    }
    const root = this.root;
    if (root && namespaceURI) {
      if (root.isDefaultNamespace(namespaceURI)) {
        return '';
      }
      const prefix = root.lookupPrefix(namespaceURI);
      if (prefix) {
        return prefix;
      }
    }
    throw new NamespaceError('Unknown namespace ' + namespaceURI);
  }

  /** @ignore */
  private _updateNS () {
    // ensure that namespaces exist on the root node
    if (this.root) {
      for (const [ namespaceURI, prefix ] of this.#namespaces.list()) {
        const key = 'xmlns' + (prefix ? ':' + prefix : '');
        this.root.setAttribute(key, namespaceURI);
      }
    }
  }

  /**
   * The root element of the document, or null if it has none.
   * Assigning an element replaces the current root and declares the
   * document's namespaces on it. Assigning null removes the root.
   */
  get root (): Element | null {
    // appendChild and insertBefore only ever allow a single Element child
    return (this.childNodes[0] as Element | undefined) ?? null;
  }

  set root (element: Element | null) {
    const current = this.root;
    if (element === current) {
      return;
    }
    if (element && !(element instanceof Element)) {
      throw new HierarchyError('Document root node must be an Element');
    }
    if (current) {
      this.removeChild(current);
    }
    if (element) {
      this.appendChild(element);
    }
  }

  /** @internal Namespace lookups go to the root element. */
  protected _namespaceElement (): Element | null {
    return this.root;
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
   * Create a new element node.
   *
   * @param qualifiedName The local tagName of the element.
   * @param [attr] A record of attributes to assign to the new element.
   *               If the value is null or undefined, the attribute will be omitted.
   * @param children Nodes to insert as children.
   *                 Strings will be converted to TextNodes and arrays will be flattened.
   * @returns A new Element instance.
   * @throws {TypeError} If attr is not an object, or looks like a child (an array or a node).
   */
  createElement = (
    qualifiedName: string,
    attr?: XMLAttr | null,
    ...children: (CreateChildArgument | CreateChildArgument[])[]
  ): Element => {
    const element = new Element(qualifiedName);
    element.setAttrValues(attr ?? null);
    for (const child of children) {
      element.append(child);
    }
    return element;
  };

  /**
   * Create a new element node associated with a given namespace.
   *
   * If the name has a prefix, it is used as given, and the caller is
   * responsible for declaring it. Otherwise, the prefix comes from a namespace
   * attached with `attachNS`, or from the declarations on the root element.
   * With no namespace, the element has no prefix. To create an element in
   * place, with any missing declarations added, use `Element.createChildNS`.
   *
   * @param namespaceURI The namespaceURI to associate with the element, or
   *                     null or an empty string for no namespace.
   * @param qualifiedName The tagName of the element, with or without a prefix.
   * @param [attr] A record of attributes to assign to the new element.
   *               If the value is null or undefined, the attribute will be omitted.
   * @param children Nodes to insert as children.
   *                 Strings will be converted to TextNodes and arrays will be flattened.
   * @returns A new Element instance.
   * @throws {NamespaceError} If no prefix is known for the namespace, or the
   *                          name breaks the rules for the xml and xmlns prefixes.
   * @throws {TypeError} If attr is not an object, or looks like a child (an array or a node).
   */
  createElementNS = (
    namespaceURI: string | null,
    qualifiedName: string,
    attr?: XMLAttr | null,
    ...children: (CreateChildArgument | CreateChildArgument[])[]
  ): Element => {
    // as in the DOM, an empty string means no namespace
    const uri = namespaceURI || null;
    const [ prefix, localName ] = splitQName(qualifiedName);
    checkNamespace(uri, prefix, qualifiedName);
    const ns = prefix ?? (uri ? this.#prefixFor(uri) : '');
    const element = new Element(ns ? ns + ':' + localName : localName);
    element.setAttrValues(attr ?? null);
    for (const child of children) {
      element.append(child);
    }
    return element;
  };

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

  // overwrites super
  appendChild<T extends Node | DocumentFragment> (node: T): T {
    if (this.root || (node instanceof DocumentFragment && node.childNodes.length > 1)) {
      throw new HierarchyError('A document must have only one child element.');
    }
    let root: Element;
    if (node instanceof DocumentFragment) {
      if (!(node.childNodes[0] instanceof Element)) {
        throw new HierarchyError('Document root node must be an Element');
      }
      root = node.childNodes[0];
    }
    else if (node instanceof Element) {
      root = node;
    }
    else {
      throw new HierarchyError('Document root node must be an Element');
    }
    appendChild(this, root);
    this._updateNS();
    return node;
  }

  // overwrites super: a document has at most one child, so this is appendChild
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  insertBefore<T extends Node | DocumentFragment> (newNode: T, referenceNode: Node | null): T {
    return this.appendChild(newNode);
  }

  /**
   * Returns a simple object representation of the node and its descendants.
   *
   * @returns JsonML representation of the nodes and its subtree.
   */
  toJS (): JsonMLElement | [] {
    return this.root ? JsonML(this.root) : [];
  }

  /**
   * Print the document as a string.
   *
   * @param pretty Apply automatic linebreaks and indentation to the output.
   * @returns The document as an XML string.
   */
  print (pretty = false): string {
    if (!(this.root instanceof Element)) {
      throw new HierarchyError('root element is missing');
    }
    return `${XML_DECLARATION}\n` + (
      pretty ? prettyPrint(this.root) : simplePrint(this.root)
    );
  }
}
