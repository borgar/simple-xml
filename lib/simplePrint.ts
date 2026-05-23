import type { CDataNode } from './CDataNode.ts';
import type { Document } from './Document.ts';
import { DocumentFragment } from './DocumentFragment.ts';
import type { Node } from './Node.js';
import type { TextNode } from './TextNode.ts';
import { CDATA_SECTION_NODE, DOCUMENT_NODE, TEXT_NODE } from './constants.js';
import { escape } from './escape.js';
import { isElement } from './isElement.ts';

/**
 * Serialize a node tree to a compact XML string without added whitespace,
 * preserving the original child order and content verbatim.
 *
 * @param {Node | DocumentFragment} node The node to serialize.
 * @returns {string} The serialized XML string.
 */
export function simplePrint (node: Node | DocumentFragment): string {
  if (node instanceof DocumentFragment) {
    return node.childNodes.map(n => simplePrint(n)).join('');
  }
  if (node.nodeType === DOCUMENT_NODE) {
    const root = (node as Document).root;
    if (!root) throw new Error('root element is missing');
    return simplePrint(root);
  }
  else if (node.nodeType === CDATA_SECTION_NODE) {
    return `<![CDATA[${(node as CDataNode).value.replace(/]]>/g, ']]&gt;')}]]>`;
  }
  else if (node.nodeType === TEXT_NODE) {
    return escape((node as TextNode).data);
  }
  else if (isElement(node)) {
    const tagName = node.fullName;
    const { childNodes } = node;
    let children = '';
    for (const n of childNodes) {
      children += simplePrint(n);
    }
    let attrList = '';
    if (isElement(node)) {
      for (const attr of node.attributes) {
        attrList += ` ${attr.fullName}="${escape(attr.value)}"`;
      }
    }
    return children
      ? `<${tagName}${attrList}>${children}</${tagName}>`
      : `<${tagName}${attrList} />`;
  }
  return '';
}
