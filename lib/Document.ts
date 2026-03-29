import { JsonML, type JsonMLElement } from './JsonML.js';
import { Node } from './Node.js';
import { Element } from './Element.js';
import { appendChild } from './appendChild.js';
import { DOCUMENT_NODE, XML_DECLARATION } from './constants.js';
import { domQuery } from './domQuery/index.js';
import { findAll } from './findAll.js';
import { isElement } from './isElement.ts';
import { DocumentFragment } from './DocumentFragment.ts';
import { NSMap } from './NSMap.ts';
import { prettyPrint } from './prettyPrint.ts';
import { simplePrint } from './simplePrint.ts';
import type { CreateChildArgument } from './CreateChildArgument.ts';
import type { XMLAttr } from './XMLAttr.ts';

/**
 * This class describes an XML document.
 *
 * @augments Node
 */
export class Document extends Node {
  root: Element | null = null;
  /** @ignore */
  namespaces = new NSMap();

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
    this.namespaces.add(namespaceURI, prefix);
    this._updateNS();

    // Return a new create function bound to the namespace
    return this.createElementNS.bind(this, namespaceURI);
  }

  /** @ignore */
  _updateNS () {
    // ensure that namespaces exist on the root node
    if (this.root) {
      for (const [ namespaceURI, prefix ] of this.namespaces.list()) {
        const key = 'xmlns' + (prefix ? ':' + prefix : '');
        this.root.setAttribute(key, namespaceURI);
      }
    }
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
   * @param attr A record of attributes to assign to the new element.
   *             If the value is null or undefined, the attribute will be omitted.
   * @param children Nodes to insert as children.
   *                 Strings will be converted to TextNodes and arrays will be flattened.
   * @returns A new Element instance.
   */
  createElement = (
    qualifiedName: string,
    attr: XMLAttr | null | undefined,
    ...children: (CreateChildArgument | CreateChildArgument[])[]
  ): Element => {
    const element = new Element(qualifiedName);
    if (attr) {
      for (const [ key, val ] of Object.entries(attr)) {
        if (val != null) {
          element.setAttribute(key, String(val));
        }
      }
    }
    for (const child of children) {
      element.append(child);
    }
    return element;
  };

  createElementNS = (
    namespaceURI: string,
    qualifiedName: string,
    attr: XMLAttr | null | undefined,
    ...children: (CreateChildArgument | CreateChildArgument[])[]
  ): Element => {
    const ns = this.namespaces.get(namespaceURI);
    if (!ns) {
      throw new Error('Unknown namespace ' + namespaceURI);
    }
    const element = new Element(ns + ':' + qualifiedName);
    // can this not be solved by Element(name, attr) ... does the same thing internally, right?
    if (attr) {
      for (const [ key, val ] of Object.entries(attr)) {
        if (val != null) {
          element.setAttribute(key, String(val));
        }
      }
    }
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
  appendChild<T extends Node | DocumentFragment> (node: T): T {
    if (this.root || (node instanceof DocumentFragment && node.childNodes.length > 1)) {
      throw new Error('A document must have only one child element.');
    }
    let root: Element;
    if (node instanceof DocumentFragment) {
      if (!(node.childNodes[0] instanceof Element)) {
        throw new Error('Document root node must be an Element');
      }
      root = node.childNodes[0];
    }
    else if (node instanceof Element) {
      root = node;
    }
    else {
      throw new Error('Document root node must be an Element');
    }
    appendChild(this, root);
    this.root = root;
    this._updateNS();
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

  /**
   * Print the document as a string.
   *
   * @param pretty Apply automatic linebreaks and indentation to the output.
   * @returns The document as an XML string.
   */
  print (pretty = false): string {
    if (!(this.root instanceof Element)) {
      throw new Error('root element is missing');
    }
    return `${XML_DECLARATION}\n` + (
      pretty ? prettyPrint(this.root) : simplePrint(this.root)
    );
  }
}
