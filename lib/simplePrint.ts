import type { CDataNode } from './CDataNode.ts';
import type { Document } from './Document.ts';
import { DocumentFragment } from './DocumentFragment.ts';
import type { Node } from './Node.js';
import type { TextNode } from './TextNode.ts';
import { CDATA_SECTION_NODE, DOCUMENT_NODE, TEXT_NODE } from './constants.js';
import { escape } from './escape.js';
import { HierarchyError } from './errors.js';
import { isElement } from './isElement.ts';
import { ATTRS } from './attrList.ts';

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
    if (!root) throw new HierarchyError('root element is missing');
    return simplePrint(root);
  }
  const out = { s: '' };
  writeNode(node, out);
  return out.s;
}

// Appends the node to one output string, which is faster than building and
// joining a string for each element.
function writeNode (node: Node, out: { s: string }): void {
  const type = node.nodeType;
  if (type === TEXT_NODE) {
    out.s += escape((node as TextNode).data);
  }
  else if (type === CDATA_SECTION_NODE) {
    out.s += `<![CDATA[${(node as CDataNode).value.replace(/]]>/g, ']]&gt;')}]]>`;
  }
  else if (isElement(node)) {
    const tagName = node.fullName;
    let open = '<' + tagName;
    for (const attr of node[ATTRS]) {
      open += ' ' + attr.fullName + '="' + escape(attr.value, true) + '"';
    }
    out.s += open;
    const mark = out.s.length;
    out.s += '>';
    for (const child of node.childNodes) {
      writeNode(child, out);
    }
    // an element whose children print as nothing closes itself
    if (out.s.length === mark + 1) {
      out.s = out.s.slice(0, mark) + ' />';
    }
    else {
      out.s += '</' + tagName + '>';
    }
  }
}
