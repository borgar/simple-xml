import { Node } from './Node.js';
import { ELEMENT_NODE, TEXT_NODE } from './constants.js';

/**
 * A class describing a TextNode.
 *
 * @augments Node
 */
export class TextNode extends Node {
  /** The node's data value. */
  data: string;

  /**
   * Constructs a new TextNode instance.
   *
   * @param [value] The data for the node.
   */
  constructor (value: any) {
    super();
    this.nodeName = '#text';
    this.nodeType = TEXT_NODE;
    this.data = String(value);
  }

  get nodeValue () {
    return this.data;
  }

  set nodeValue (value) {
    this.data = String(value);
  }

  // overwrites super
  get textContent () {
    const s = this.data;
    // Whitespace-only text between child elements is indentation, and is
    // ignored unless xml:space="preserve". In an element without child
    // elements it's content, such as a separator, and is kept.
    if (!/[^\r\n\t ]/.test(s) && !this.preserveSpace) {
      for (const sibling of this.parentNode?.childNodes ?? []) {
        if (sibling.nodeType === ELEMENT_NODE) {
          return '';
        }
      }
    }
    return s;
  }
}
