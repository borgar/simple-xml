import { Node } from './Node.js';
import { CDATA_SECTION_NODE } from './constants.js';

/**
 * A class describing an CDataNode.
 */
export class CDataNode extends Node {
  /** The nodes data value. */
  value: string;

  /**
   * Constructs a new CDataNode instance.
   *
   * @param [value=''] The data for the node
   */
  constructor (value: string = '') {
    super();
    // inherited instance props from Node
    this.nodeName = '#cdata-section';
    this.nodeType = CDATA_SECTION_NODE;
    this.value = value;
  }

  // overwrites super
  get textContent () {
    return this.value;
  }
}
