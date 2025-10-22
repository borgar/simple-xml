import { CDATA_SECTION_NODE, TEXT_NODE } from './constants.js';
import type { Element } from './Element.ts';
import { isElement } from './isElement.ts';
import type { Node } from './Node.ts';

const isText = (d: Node) => (
  d.nodeType === TEXT_NODE ||
  d.nodeType === CDATA_SECTION_NODE
);

export type JsonMLAttr = Record<string, string | number | boolean | null>;
export type JsonMLElement =
  [ string, JsonMLAttr, ...JsonMLElement[] ] |
  [ string, JsonMLAttr ] |
  [ string, ...JsonMLElement[] ] |
  [ string ] |
  string;

export function JsonML (node: Element): JsonMLElement {
  // name of the element
  const n: JsonMLElement = [ node.fullName ?? node.nodeName ];
  // it's attributes as an object
  if (node.attr && Object.keys(node.attr).length) {
    // @ts-expect-error -- TS has trouble figuring out how this is built
    n.push(Object.assign({}, node.attr) as JsonMLAttr);
  }
  // it's content
  if (node.childNodes?.length) {
    const content: JsonMLElement[] = [];
    node.childNodes.forEach(d => {
      if (isText(d)) {
        const s = d.textContent;
        // if last item in content is a string, then concat
        const last = content[content.length - 1];
        if (typeof last === 'string') {
          content[content.length - 1] = last + s;
        }
        // else add the item, given that we have one
        else if (s) {
          content.push(s);
        }
      }
      else if (isElement(d)) {
        content.push(JsonML(d));
      }
    });
    // @ts-expect-error -- TS has trouble figuring out how this is built
    n.push(...content);
  }
  return n;
}
