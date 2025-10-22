import type { CDataNode } from './CDataNode.ts';
import type { Document } from './Document.ts';
import type { Node } from './Node.js';
import type { TextNode } from './TextNode.ts';
import { CDATA_SECTION_NODE, DOCUMENT_NODE, ELEMENT_NODE, TEXT_NODE } from './constants.js';
import { escape } from './escape.js';
import { isElement } from './isElement.ts';

function printAttributes (node: Node): string {
  let attrList = '';
  if (isElement(node)) {
    const attr = node.attr;
    for (const [ key, val ] of Object.entries(attr)) {
      attrList += ` ${key}="${escape(val)}"`;
    }
  }
  return attrList;
}

function printTextNode (node: TextNode): string {
  return escape(node.value);
}

function printCData (node: CDataNode) {
  return `<![CDATA[${node.value.replace(/]]>/g, ']]&gt;')}]]>`;
}

function printDocument (node: Node): string {
  return node.childNodes
    .map(n => prettyPrint(n))
    .join('\n');
}

export function prettyPrint (node: Node, indent: string = ''): string {
  const { preserveSpace } = node;
  if (node.nodeType === DOCUMENT_NODE) {
    return printDocument(node as Document);
  }
  else if (node.nodeType === CDATA_SECTION_NODE) {
    return printCData(node as CDataNode);
  }
  else if (node.nodeType === TEXT_NODE) {
    return printTextNode(node as TextNode);
  }
  else if (isElement(node)) {
    const tagName = node.tagName;
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
      children = (childNodes as TextNode[]).map(printTextNode).join('');
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
