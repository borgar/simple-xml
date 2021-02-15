const Node = require('./Node');

module.exports = class TextNode extends Node {
  constructor (value = '') {
    super();
    this.nodeName = '#text';
    this.value = value;
    this.nodeType = Node.TEXT_NODE;
  }

  toJS () {
    return this.value;
  }

  get children () {
    return null;
  }

  get preserveSpace () {
    return this.parentNode && this.parentNode.preserveSpace;
  }

  get textContent () {
    const s = this.value;
    // pure whitespace nodes are ignored when xml:space="default"
    if (!/[^\r\n\t ]/.test(s)) {
      return this.preserveSpace ? s : '';
    }
    return s;
  }
};
