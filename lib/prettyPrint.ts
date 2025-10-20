import { Node } from './Node.js';
import { CDATA_SECTION_NODE, DOCUMENT_NODE, ELEMENT_NODE, TEXT_NODE } from './constants.js';
import { escape } from './escape.js';

function printAttributes (node) {
  let attrList = '';
  if ('attr' in node) {
    for (const [ key, val ] of Object.entries(node.attr)) {
      attrList += ` ${key}="${escape(val)}"`;
    }
  }
  return attrList;
}

function printTextNode (node) {
  return escape(node.value);
}

function printCData (node) {
  return `<![CDATA[${node.value.replace(/]]>/g, ']]&gt;')}]]>`;
}

function printDocument (node) {
  return node.childNodes
    .map(n => prettyPrint(n))
    .join('\n');
}

/**
 * @ignore
 * @param {Node} node The node to start printing at
 * @param {string} [indent=''] The indent of the output
 * @returns {string} XML source
 */
export function prettyPrint (node, indent = '') {
  const { preserveSpace } = node;
  if (node.nodeType === DOCUMENT_NODE) {
    return printDocument(node);
  }
  else if (node.nodeType === CDATA_SECTION_NODE) {
    return printCData(node);
  }
  else if (node.nodeType === TEXT_NODE) {
    return printTextNode(node);
  }
  else if (node.nodeType === ELEMENT_NODE) {
    const tagName = 'tagName' in node ? node.tagName : node.nodeName;
    const { childNodes } = node;
    let children = '';

    if (preserveSpace) {
      childNodes.forEach(n => {
        children += prettyPrint(n, indent + '  ');
      });
    }
    else if (childNodes.length === 1 && childNodes[0].nodeType === CDATA_SECTION_NODE) {
      children = prettyPrint(childNodes[0]);
    }
    else if (childNodes.every(d => d.nodeType === TEXT_NODE)) {
      children = childNodes.map(printTextNode).join('');
    }
    else {
      let lastNodeType = 0;
      for (let i = 0; i < childNodes.length; i++) {
        const child = childNodes[i];
        const isWS = child.nodeType === TEXT_NODE && !child.textContent;
        // skip if this is a whitespace textnode and last node was not
        // skip if this is a whitespace and a last-child or next node is element
        if (isWS) {
          if (
            (lastNodeType !== TEXT_NODE) ||
           (i + 1 === childNodes.length) ||
           childNodes[i + 1]?.nodeType === ELEMENT_NODE
          ) {
            continue;
          }
        }
        const r = prettyPrint(child, indent + '  ');
        if (lastNodeType !== TEXT_NODE || child.nodeType !== TEXT_NODE) {
          children += '\n' + indent + '  ';
          children += r.trim();
        }
        else {
          children += r;
        }

        lastNodeType = child.nodeType;
      }
      children += '\n' + indent;
    }

    const attrList = printAttributes(node);
    return children
      ? `<${tagName}${attrList}>${children}</${tagName}>`
      : `<${tagName}${attrList} />`;
  }
  return '';
}
