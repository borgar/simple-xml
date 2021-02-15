const Node = require('./Node');
const { nodeTypes } = require('./constants');

class Document extends Node {
  constructor (root) {
    super();
    this.childNodes = root ? [ root ] : [];
    this.nodeType = Node.DOCUMENT_NODE;
    this.nodeName = '#document';
    this.root = root || null;
  }

  get textContent () {
    return this.root ? this.root.textContent : '';
  }

  appendChild (node) {
    if (this.root) {
      throw new Error('Only one element on document allowed.');
    }
    return Node.appendChild.call(this, node);
  }

  toJS () {
    return this.root ? this.root.toJS() : [];
  }
}

Object.assign(Document, nodeTypes);

module.exports = Document;
