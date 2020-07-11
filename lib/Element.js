const Node = require('./Node');
const propDef = require('./propDef');
const { nodeTypes } = require('./constants');

class Element extends Node {
  constructor (tag, attr = {}, closed = false) {
    super();
    propDef(this, 'ns', null);
    propDef(this, 'tagName', tag);
    propDef(this, 'fullName', tag);
    propDef(this, 'closed', !!closed);
    this.nodeType = Node.ELEMENT_NODE;
    if (tag.includes(':')) {
      const [ ns, tn ] = tag.split(':');
      this.ns = ns;
      this.tagName = tn;
    }
    this.nodeName = this.tagName.toUpperCase();
    this.attr = attr;
    this.childNodes = [];
  }

  getAttribute (name) {
    return this.hasAttribute(name) ? this.attr[name] : null;
  }

  setAttribute (name, value) {
    this.attr[name] = value;
  }

  hasAttribute (name) {
    return this.attr && this.attr.hasOwnProperty(name);
  }

  removeAttribute (name) {
    delete this.attr[name];
  }
};

Object.assign(Element, nodeTypes);

module.exports = Element;
