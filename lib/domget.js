/**
 * Query a DOM of all elements matching a CSS selector string.
 *
 * This is old (2007) code that has been modernized and made to be
 * smaller, and less "HTML" with its node interface access. Should
 * work fine with XML now. There may be issues with case-sensitivity,
 * however (as HTML is not but XML is).
 *
 * Copyright (C) 2008 Borgar Þorsteinsson
 * Licenced under the terms and conditions of the MIT licence
 *
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  }
  else {
    root.domget = factory();
  }
}(this, () => {

  const re_operator = /^(\s*([>+~])?\s*)/;
  const re_split = /\s*([ >+~]+[^ >+~=\d])/;
  const re_tagName = /^[ >+~]*([a-z1-6]+|\*)/i;
  const re_id = /^#([a-z][a-z0-9_-]*)/i;
  const re_className = /^\.([a-z0-9_-]+)/i;
  const re_attr = /^\[([\w-]+)\s?(?:(.=|=)\s?['"]?(.*?)["']?)?\]/;
  const re_pseudo = /^(:([\w-]+)?(\((.*?\)?)\))?)/;
  const re_nthValue = /(-?)(\d+)?(n[+-](\d+))?/;
  const re_tagOnly = /^([a-z1-6]+|\*)$/i;

  const id_attr = '$dg-' + (Math.random() * 1e4 | 0);
  let id_counter = (Math.random() * 1e4 | 0);

  // find an index of elm with a collection (array or nodelist) of elms
  const _indexOf = [].indexOf;
  function indexOf (elms, elm) {
    return elms.indexOf ? elms.indexOf(elm) : _indexOf.call(elms, elm);
  }

  function identify (elm) {
    if (!elm[id_attr]) {
      elm[id_attr] = elm[id_attr] || ++id_counter;
    }
    return elm[id_attr];
  }

  let childCache = {};
  function cleanupCache () {
    childCache = {};
  }

  function childrenOf (elm, tagName = '*') {
    const elm_id = identify(elm);
    if (!childCache[elm_id]) {
      childCache[elm_id] = {};
    }
    if (!childCache[elm_id][tagName]) {
      let ch = Array.from(elm.children);
      if (tagName !== '*' && tagName) {
        const nodeName = tagName.toUpperCase();
        ch = ch.filter(n => n.nodeName === nodeName);
      }
      childCache[elm_id][tagName] = ch;
    }
    return childCache[elm_id][tagName];
  }

  const FILTERS = {
    // "E > F" => Match an F element child of an E element
    'byChild': (tagName, elms) => {
      const found = [];
      elms.forEach(parent => {
        childrenOf(parent).forEach(elm => {
          if (tagName === '*' || tagName === elm.nodeName) {
            found.push(elm);
          }
        });
      });
      return found;
    },

    // "E + F" => Match an F element immediately preceded by an E element
    'byNextSibling': (tagName, elms) => {
      const found = [];
      elms.forEach((elm, i) => {
        const nodes = childrenOf(elm.parentNode);
        const idx = indexOf(nodes, elm);
        const prev = nodes[idx + 1];
        if (prev && (tagName === '*' || tagName === prev.nodeName)) {
          found.push(prev);
        }
      });
      return found;
    },

    // "E ~ F" => Match an F element preceded by an E element
    'bySibling': (tagName, elms) => {
      let found = [];
      let i = 0;
      let ref;
      let elm;
      const parents = [];
      while ((elm = elms[i++])) {
        const parent = elm.parentNode;
        if (indexOf(parents, parent) === -1) {
          parents.push(parent);
          const elmIdx = indexOf(parent.childNodes, elm);
          const siblings = childrenOf(parent, tagName);
          let j = 0;
          while ((ref = siblings[j])) {
            if (elmIdx < indexOf(ref.parentNode.childNodes, ref)) {
              found = found.concat(
                siblings.slice(j, siblings.length)
              );
              break;
            }
            j++;
          }
        }
      }
      return found;
    },

    // "E F" => Match an F element decended from an E element
    'byAncestor': (tagName, elms) => {
      let found = [];
      let i = 0;
      let ref;
      tagName = tagName || '*';
      while ((ref = elms[i++])) {
        found = found.concat(
          Array.from(ref.getElementsByTagName(tagName))
        );
      }
      return found;
    },

    // E#myid
    // http://www.w3.org/TR/css3-selectors/#id-selectors
    'byId': (id, elms, not) => (
      elms.filter(d => {
        const elmId = d.getAttribute('id');
        return (not && id !== elmId) || (!not && id === elmId);
      })
    ),

    // E.warning
    // http://www.w3.org/TR/css3-selectors/#class-html
    'byClassName': (className, elms, not) => {
      const needle = ' ' + className + ' ';
      return elms.filter(d => {
        const haystack = d.getAttribute('class');
        return ((haystack && (' ' + haystack + ' ').includes(needle)) ^ not);
      });
    },

    'firstoftype': (s, elms, not) => FILTERS.nth('0n+1', elms, not, '*', 0),

    'lastoftype': (s, elms, not) => FILTERS.nth('0n+1', elms, not, '*', 1),

    'onlyoftype': (s, elms, not) => {
      const elms2 = FILTERS.nth('0n+1', elms, not, '*', 0);
      return FILTERS.nth('0n+1', elms2, not, '*', 1);
    },

    // E:nth-child(n), E:nth-last-child(n), E:nth-of-type(n), E:nth-last-of-type(n)
    // http://www.w3.org/TR/css3-selectors/#structural-pseudos
    'nth': (s, elms, not, tagName, last) => {
      const found = [];
      const m = re_nthValue.exec(s);
      if (m) {
        const interval = (m[1] + (m[2] || 1)) * 1;
        const offset = (m[3] || '').slice(1) * 1;
        let i = 0;
        let elm;
        let nth;
        while ((elm = elms[i++])) {
          // find index
          let index = 0;
          let n = -1;
          const siblings = elm.parentNode
            ? childrenOf(elm.parentNode, tagName === '*' ? elm.nodeName : tagName)
            : [ elm ];
          index = indexOf(siblings, elm) + 1;
          if (last) {
            index = 1 + siblings.length - index;
          }
          n = index - offset;
          nth = (!interval)
            ? (n === 0)
            : (n % interval === 0 && n / interval >= 0);
          if (nth ^ not) {
            found[found.length] = elm;
          }
        }
      }
      return found;
    },

    // http://www.w3.org/TR/css3-selectors/#UIstates
    'enabled': (s, elm, not) => FILTERS.disabled(s, elm, 1 ^ not),

    'contains': (s, elms, not, n) => elms.filter(d => (d.textContent || '').includes(s) ^ not),

    'checked': (s, elms, not, n) => elms.filter(d => d.hasAttribute('checked') ^ not),

    'disabled': (s, elms, not, n) => elms.filter(d => d.hasAttribute('disabled') ^ not),

    'empty': (s, elms, not, n) => elms.filter(d => (!d.childNodes.length) ^ not),

    'onlychild': (s, elms, not, n) => elms.filter(d => (childrenOf(d.parentNode).length === 1) ^ not),

    'lastchild': (s, elms, not, n) => (
      elms.filter(d => {
        const siblings = childrenOf(d.parentNode);
        return (siblings[siblings.length - 1] === d) ^ not;
      })
    ),

    'firstchild': (s, elms, not, n) => (
      elms.filter(d => (childrenOf(d.parentNode)[0] === d) ^ not)
    ),

    'root': (s, elms, not, n) => (
      elms.filter(d => (d.ownerDocument && d === d.ownerDocument.documentElement) ^ not)
    ),

    'byTagName': (s, elms, not, n) => (
      elms.filter(d => (d.nodeName === s.toUpperCase()) ^ not)
    ),

    '=': (s, elms, not, n) => (
      elms.filter(d => {
        const a = d.getAttribute(n);
        return ((a && a === s) ^ not);
      })
    ),

    '^=': (s, elms, not, n) => (
      elms.filter(d => {
        const a = d.getAttribute(n);
        return ((a && a.startsWith(s)) ^ not);
      })
    ),

    '$=': (s, elms, not, n) => (
      elms.filter(d => {
        const a = d.getAttribute(n);
        return ((a && a.endsWith(s)) ^ not);
      })
    ),

    '*=': (s, elms, not, n) => (
      elms.filter(d => {
        const a = d.getAttribute(n);
        return ((a && a.includes(s)) ^ not);
      })
    ),

    '|=': (s, elms, not, n) => (
      elms.filter(d => {
        const a = d.getAttribute(n);
        return ((a && (a === s || a.slice(0, s.length + 1) === s + '-')) ^ not);
      })
    ),

    '~=': (s, elms, not, n) => (
      elms.filter(d => {
        const a = d.getAttribute(n);
        return ((a && (' ' + a + ' ').includes(' ' + s + ' ')) ^ not);
      })
    ),

    'attr': (s, elms, not, n) => elms.filter(d => (!!d.getAttribute(n)) ^ not)
  };

  const tokenCache = {};
  const tokenize = (selector) => {
    const tokens = [];
    let lastToken;
    while (selector) {
      const mop = re_operator.exec(selector);
      const operator = mop ? mop[2] : '';
      const prePos = mop ? mop[1].length : 0;
      const splitPos = selector.slice(prePos).search(re_split);
      let src = (splitPos > -1)
        ? selector.slice(0, splitPos + prePos)
        : selector;
      selector = selector.slice(src.length).trim();
      // at this point we have a operator + tokenstring to work with
      const cacheId = src;
      let m;
      if (!tokenCache[cacheId]) {
        const token = {
          tagName: '*',
          operator: operator,
          id: null,
          className: [],
          attr: [],
          pseudo: []
        };
        // name
        if ((m = re_tagName.exec(src))) {
          token.tagName = m[1];
          src = src.slice(m[0].length);
        }
        lastToken = ''; // safety-valve for broken selectors
        while (lastToken !== src) {
          lastToken = src;
          // id
          if ((m = re_id.exec(src))) {
            token.id = m[1];
            src = src.slice(m[0].length);
          }
          // className
          if ((m = re_className.exec(src))) {
            token.className.push(m[1]);
            src = src.slice(m[0].length);
          }
          // attribute
          if ((m = re_attr.exec(src))) {
            token.attr.push({
              name: m[1],
              operator: m[2] || '',
              value: m[3] || ''
            });
            src = src.slice(m[0].length);
          }
          // pseudo
          if ((m = re_pseudo.exec(src))) {
            src = src.slice(m[0].length);
            const ps = { name: m[2], value: m[4] };
            if (/^nth/.test(ps.name)) {
              ps.nth = true;
              if (ps.value === 'even') { ps.value = '2n'; }
              if (ps.value === 'odd') { ps.value = '2n+1'; }
              if (!/\D/.test(ps.value)) { ps.value = '0n+' + ps.value; }
              const nth = /^nth(-last)?-(child|of-type)/i.exec(ps.name);
              if (nth) {
                ps.last = (nth[1] === '-last') ? 1 : 0;
                ps.type = (nth[2] === 'of-type') ? 1 : 0;
              }
            }
            token.pseudo.push(ps);
          }
        }
        tokenCache[cacheId] = token;
      }
      tokens.push(tokenCache[cacheId]);
    }
    return tokens;
  };

  const ft = {
    '>': 'byChild',
    '+': 'byNextSibling',
    '~': 'bySibling',
    '': 'byAncestor'
  };

  function matchToken (t, not, elms) {
    const tagName = t.tagName;
    not = not || 0;
    if (t.operator) {
      const op = ft[t.operator];
      elms = FILTERS[op](tagName.toUpperCase(), elms);
    }
    else if (not && tagName !== '*') {
      elms = FILTERS.byTagName(tagName, elms, not);
    }
    else if (!not) {
      elms = FILTERS.byAncestor(tagName, elms);
    }
    if (t.id) {
      elms = FILTERS.byId(t.id, elms, not);
    }
    for (let j = 0, m = t.className.length; j < m; j++) {
      elms = FILTERS.byClassName(t.className[j], elms, not);
    }
    for (let j = 0, m = t.pseudo.length; j < m; j++) {
      const ps = t.pseudo[j];
      const pn = ps.name.replace(/-/g, '');
      if (pn === 'not' && !not) {
        const tok = tokenize(ps.value)[0];
        elms = matchToken(tok, 1, elms);
      }
      else if (ps.nth) {
        elms = FILTERS.nth(
          ps.value, elms, not,
          ps.type ? tagName : '',
          ps.last
        );
      }
      else if (FILTERS[pn]) {
        elms = FILTERS[pn](ps.value, elms, not);
      }
      else {
        elms = []; // unsupported pseudo
      }
    }
    for (let j = 0, m = t.attr.length; j < m; j++) {
      const { operator, value, name } = t.attr[j];
      const op = (operator in FILTERS) ? operator : 'attr';
      elms = FILTERS[op](value, elms, not, name);
    }
    return elms;
  };

  // main function
  function domget (context, selector) {
    // shortcut single tag
    if (re_tagOnly.test(selector)) {
      return Array.from(context.getElementsByTagName(selector));
    }
    cleanupCache();

    let elements = [];
    selector.trim().split(/ *, */).forEach(s => {
      let elms = [ context ];
      if (s) {
        const tokens = tokenize(s);
        let j = 0;
        let t;
        while ((t = tokens[j++]) && elms.length) {
          elms = matchToken(t, 0, elms);
        }
      }
      elements = elements.concat(elms);
    });

    cleanupCache();

    // return collection of unique nodes
    return Array.from(new Set(elements));
  };

  domget.filters = FILTERS;

  // expose the method to where we want it
  return domget;

}));
