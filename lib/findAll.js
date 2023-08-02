export const findAll = (node, tagName, list = []) => {
  const ch = node && node.childNodes;
  if (ch) {
    for (let i = 0; i < ch.length; i++) {
      const c = ch[i];
      if (c.nodeType === 1) { // Node.ELEMENT_NODE
        if (c.tagName === tagName || tagName === '*') {
          list.push(c);
        }
        // and it's children... (traversal order)
        findAll(c, tagName, list);
      }
    }
  }
  return list;
};
