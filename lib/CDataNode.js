import { Node } from './Node.js';
import { CDATA_SECTION_NODE } from './constants.js';

/**
 * A class describing an CDataNode.
 * 
 * @augments Node
 */
export class CDataNode extends Node {
  /**
   * Constructs a new CDataNode instance.
   *
   * @param {string} [value=''] The data for the node
   */
  constructor (value = '') {
    super();
    // inherited instance props from Node
    this.nodeName = '#cdata-section';
    this.nodeType = CDATA_SECTION_NODE;
    /**
     * The nodes data value.
     * @type {string}
     */
    this.value = value;
  }

  // overwrites super
  get textContent () {
    return this.value;
  }
}
