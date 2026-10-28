import { Node } from './Node.js';
import { ATTRIBUTE_NODE, XML_NS, XMLNS_NS } from './constants.js';
import { qnameColon } from './splitQName.ts';
import type { Element } from './Element.ts';

/**
 * Set the element an attribute belongs to. Only attribute maps call this.
 *
 * @internal
 */
export let setOwnerElement: (attr: Attr, owner: Element | null) => void;

/**
 * A class describing an attribute.
 *
 * @augments Node
 */
export class Attr extends Node {
  /** The namespace prefix of the attribute, or null if no prefix is specified. */
  prefix: string | null;
  /** The name of the tag for the given attribute, excluding any namespace prefix. */
  localName: string;

  /** The qualified name of the attribute, including any namespace prefix. */
  name: string;
  /** The attribute's data value. */
  value: string;

  // Private so it stays out of equality checks, logs, and JSON output.
  #ownerElement: Element | null = null;

  static {
    setOwnerElement = (attr, owner) => {
      attr.#ownerElement = owner;
    };
  }

  /**
   * Constructs a new Attr instance.
   *
   * @param name The name of the attribute.
   * @param value The data of the attribute.
   */
  constructor (name: string, value: any) {
    super();

    const colon = qnameColon(name);
    this.prefix = colon === -1 ? null : name.slice(0, colon);
    this.localName = colon === -1 ? name : name.slice(colon + 1);
    this.name = this.fullName;
    this.nodeName = this.fullName;

    this.value = String(value);

    this.nodeType = ATTRIBUTE_NODE;
  }

  /** The full name of the given attribute, including a namespace prefix. */
  get fullName () {
    return this.prefix
      ? this.prefix + ':' + this.localName
      : this.localName;
  }

  /** The element the attribute belongs to, or null if it isn't on an element. */
  get ownerElement (): Element | null {
    // a copy made by a test tool has no private fields
    return #ownerElement in this ? this.#ownerElement : null;
  }

  /** @internal Namespace lookups go to the owner element. */
  protected _namespaceElement (): Element | null {
    return this.ownerElement;
  }

  /**
   * The namespace URI of the attribute, or null if it has none. Unprefixed
   * attributes have no namespace, even when the element has a default
   * namespace. Other prefixes are resolved from the `xmlns` declarations on
   * the owner element and its ancestors.
   */
  get namespaceURI (): string | null {
    const prefix = this.prefix;
    if (prefix === 'xmlns' || (!prefix && this.localName === 'xmlns')) {
      return XMLNS_NS;
    }
    if (!prefix) {
      return null;
    }
    if (prefix === 'xml') {
      return XML_NS;
    }
    return this.ownerElement?.lookupNamespaceURI(prefix) ?? null;
  }
}
