import { Node } from './Node.js';
import { TEXT_NODE } from './constants.js';

/**
 * A class describing a TextNode.
 *
 * @augments Node
 */
export class TextNode extends Node {
  /**
   * Constructs a new TextNode instance.
   *
   * @param {string} [value=''] The data for the node
   */
  constructor (value = '') {
    super();
    this.nodeName = '#text';
    this.nodeType = TEXT_NODE;
    /**
     * The node's data value.
     * @type {string}
     */
    this.value = value;
  }

  // overwrites super
  get textContent () {
    const s = this.value;
    // pure whitespace nodes are ignored when xml:space="default"
    if (!/[^\r\n\t ]/.test(s)) {
      return this.preserveSpace ? s : '';
    }
    return s;
  }
}
