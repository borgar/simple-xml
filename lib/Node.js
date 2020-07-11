const { nodeTypes } = require('./constants');
const findAll = require('./findAll');
const domget = require('./domget');
const propDef = require('./propDef');

const { ELEMENT_NODE, CDATA_SECTION_NODE, TEXT_NODE } = nodeTypes;

class Node {
  constructor (root) {
    propDef(this, 'parentNode', null);
    propDef(this, 'nodeType', null);
    this.nodeName = '#node';
    this.root = root || null;
  }

  appendChild (node) {
    if (!node) {
      throw new Error('1 argument required, but 0 present.');
    }
    // if node is attached to a parent, first detach it
    if (node.parentNode) {
      const p = node.parentNode;
      p.childNodes = p.childNodes.filter(d => d !== node);
    }
    node.parentNode = this;
    this.childNodes.push(node);
    return node;
  }

  getElementsByTagName (tagName) {
    if (!tagName) {
      throw new Error('1 argument required, but 0 present.');
    }
    return findAll(this, tagName, []);
  }

  querySelectorAll (selector) {
    if (!selector) {
      throw new Error('1 argument required, but 0 present.');
    }
    return domget(this, selector);
  }

  get children () {
    return this.childNodes.filter(d => d && d.nodeType === ELEMENT_NODE);
  }

  get preserveSpace () {
    if (this.attr) {
      if (this.attr['xml:space'] === 'preserve') {
        return true;
      }
      if (this.parentNode) {
        return this.parentNode.preserveSpace;
      }
    }
    return false;
  }

  get textContent () {
    let s = '';
    for (let i = 0; i < this.childNodes.length; i++) {
      const child = this.childNodes[i];
      s += child.textContent;
    }
    return s.replace(/\r/g, '');
  }

  toJS () {
    const n = [ this.fullName ];
    if (this.attr && Object.keys(this.attr).length) {
      n.push(Object.assign({}, this.attr));
    }
    if (this.childNodes && this.childNodes.length) {
      const content = [];
      this.childNodes.forEach(d => {
        if (d.nodeType === TEXT_NODE || d.nodeType === CDATA_SECTION_NODE) {
          const s = d.textContent;
          if (typeof content[content.length - 1] === 'string') {
            content[content.length - 1] += s;
          }
          else {
            s && content.push(s);
          }
        }
        else if (d.toJS) {
          content.push(d.toJS());
        }
      });
      n.push(...content);
    }
    return n;
  }
}

Object.assign(Node, nodeTypes);

module.exports = Node;
