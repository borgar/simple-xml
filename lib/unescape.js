const entities = {
  quot: '"',
  amp: '&',
  apos: "'",
  lt: '<',
  gt: '>'
};

module.exports = s => {
  return s.replace(/&(#x?)?([^;]+);/ig, (m, a, e) => {
    if (a === '#x') {
      return String.fromCharCode(parseInt(e, 16));
    }
    if (a === '#') {
      return String.fromCharCode(+e);
    }
    return entities[e] || m;
  });
};

