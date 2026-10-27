import { Node } from './Node.js';
import { ATTRIBUTE_NODE } from './constants.js';
import { splitTagName } from './splitTagName.ts';

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

  /**
   * Constructs a new Attr instance.
   *
   * @param name The name of the attribute.
   * @param value The data of the attribute.
   */
  constructor (name: string, value: any) {
    super();

    const [ prefix, localName ] = splitTagName(name);
    this.prefix = prefix;
    this.localName = localName;
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
}
