import { CDATA_SECTION_NODE, TEXT_NODE } from './constants.js';

const isText = d => (
  d.nodeType === TEXT_NODE ||
  d.nodeType === CDATA_SECTION_NODE
);

export function JsonML (node) {
  // name of the element
  const n = [ node.fullName ?? node.nodeName ];
  // it's attributes as an object
  if (node.attr && Object.keys(node.attr).length) {
    n.push(Object.assign({}, node.attr));
  }
  // it's content
  if (node.childNodes && node.childNodes.length) {
    const content = [];
    node.childNodes.forEach(d => {
      if (isText(d)) {
        const s = d.textContent;
        // if last item in content is a string, then concat
        if (typeof content[content.length - 1] === 'string') {
          content[content.length - 1] += s;
        }
        // else add the item, given that we have one
        else if (s) {
          content.push(s);
        }
      }
      else {
        content.push(JsonML(d));
      }
    });
    n.push(...content);
  }
  return n;
}
