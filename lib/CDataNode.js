const Node = require('./Node');
const propDef = require('./propDef');

module.exports = class CDataNode extends Node {
  constructor (value = '') {
    super();
    this.nodeName = '#cdata-section';
    this.value = value;
    propDef(this, 'parentNode', null);
    propDef(this, 'nodeType', Node.CDATA_SECTION_NODE);
  }

  toJS () {
    return this.value;
  }

  get children () {
    return null;
  }

  get textContent () {
    return this.value;
  }
};
