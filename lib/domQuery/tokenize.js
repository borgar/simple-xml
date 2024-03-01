const re_operator = /^(\s*([>+~])?\s*)/;
const re_split = /\s*([ >+~]+[^ >+~=\d])/;
const re_tagName = /^[ >+~]*(\*|[\w-]+)/i;
const re_id = /^#([\w-]+)/i;
const re_className = /^\.([\w-]+)/i;
const re_attr = /^\[([\w-]+)\s?(?:(.=|=)\s?['"]?(.*?)["']?)?\]/;
const re_pseudo = /^(:([\w-]+)?(\((.*?\)?)\))?)/;

const ft = {
  '>': 'byChild',
  '+': 'byNextSibling',
  '~': 'bySibling',
  '': 'byAncestor'
};

const attr = {
  '=':  'attrEqual',
  '^=': 'attrPrefix',
  '$=': 'attrSuffix',
  '*=': 'attrIncludes',
  '|=': 'attrDashStart',
  '~=': 'attrWord'
};

export function tokenize (selector) {
  const tokens = [];
  let lastToken;
  while (selector) {
    const mop = re_operator.exec(selector);
    const operator = mop ? ft[mop[2]] : '';
    const prePos = mop ? mop[1].length : 0;
    const splitPos = selector.slice(prePos).search(re_split);
    let src = (splitPos > -1)
      ? selector.slice(0, splitPos + prePos)
      : selector;
    selector = selector.slice(src.length).trim();
    // at this point we have a operator + tokenstring to work with
    let m;
    const token = {
      tagName: '*',
      operator: operator,
      id: '',
      className: [],
      attr: [],
      pseudo: []
    };
    // name
    if ((m = re_tagName.exec(src))) {
      token.tagName = m[1];
      src = src.slice(m[0].length);
    }

    lastToken = '';
    while (lastToken !== src) {
      lastToken = src;
      // id
      if ((m = re_id.exec(src))) {
        token.id = m[1];
      }
      // className
      else if ((m = re_className.exec(src))) {
        token.className.push(m[1]);
      }
      // attribute
      else if ((m = re_attr.exec(src))) {
        token.attr.push({
          name: m[1],
          operator: attr[m[2]] || '',
          value: m[3] || ''
        });
      }
      // pseudo
      else if ((m = re_pseudo.exec(src))) {
        const ps = { name: m[2], value: m[4] };
        if (/^nth/.test(ps.name)) {
          ps.nth = true;
          if (ps.value === 'even') {
            ps.value = '2n';
          }
          else if (ps.value === 'odd') {
            ps.value = '2n+1';
          }
          else if (!/\D/.test(ps.value)) {
            ps.value = '0n+' + ps.value;
          }
          const nth = /^nth(-last)?-(child|of-type)/i.exec(ps.name);
          if (nth) {
            ps.last = (nth[1] === '-last') ? 1 : 0;
            ps.type = (nth[2] === 'of-type') ? 1 : 0;
          }
        }
        token.pseudo.push(ps);
      }
      if (m) {
        src = src.slice(m[0].length);
      }
    }

    tokens.push(token);
  }
  return tokens;
}
