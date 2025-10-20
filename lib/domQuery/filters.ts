import { Element } from '../Element.js';

const re_nthValue = /(-?)(\d+)?(n[+-](\d+))?/;

const nameMatch = (matchTag: string, candTag: string): boolean => matchTag === '*' || matchTag === candTag;

const xor = (a?: number | boolean, b?: number | boolean): boolean => !!(+(a || 0) ^ +(b || 0));

type Filter = (query: string, elms: Element[], not?: boolean, name?: string, last?: boolean) => Element[];

export const FILTERS: Record<string, Filter> = {
  // "E > F" => Match an F element child of an E element
  byChild: (tagName, elms) => {
    const found: Element[] = [];
    for (const parent of elms) {
      parent.children.forEach(elm => {
        if (nameMatch(tagName, elm.tagName)) {
          found.push(elm);
        }
      });
    }
    return found;
  },

  // "E + F" => Match an F element immediately preceded by an E element
  byNextSibling: (tagName, elms) => {
    const found: Element[] = [];
    for (const elm of elms) {
      if (elm.parentNode) {
        const nodes = elm.parentNode.children;
        const idx = nodes.indexOf(elm);
        const prev = nodes.at(idx + 1);
        if (prev && nameMatch(tagName, prev.tagName)) {
          found.push(prev);
        }
      }
    }
    return found;
  },

  // "E ~ F" => Match an F element preceded by an E element
  bySibling: (tagName, elms) => {
    let found: Element[] = [];
    const parents: Element[] = [];
    for (const elm of elms) {
      const parent = elm.parentNode;
      if (parent && !parents.includes(parent)) {
        parents.push(parent);
        const elmIdx = parent.childNodes.indexOf(elm);
        const siblings = parent.children.filter(d => nameMatch(tagName, d.tagName));
        for (let i = 0; i < siblings.length; i++) {
          const ref = siblings.at(i)!;
          if (ref.parentNode && elmIdx < ref.parentNode.childNodes.indexOf(ref)) {
            found = found.concat(
              siblings.slice(i, siblings.length)
            );
            break;
          }
        }
      }
    }
    return found;
  },

  // "E F" => Match an F element decended from an E element
  byAncestor: (tagName, elms) => {
    let found: Element[] = [];
    let i = 0;
    let ref: Element | undefined;
    tagName = tagName || '*';
    while ((ref = elms.at(i++))) {
      found = found.concat(ref.getElementsByTagName(tagName));
    }
    return found;
  },

  // E#myid
  // http://www.w3.org/TR/css3-selectors/#id-selectors
  byId: (id, elms, not) => (
    elms.filter(d => {
      const elmId = d.getAttribute('id');
      return (not && id !== elmId) || (!not && id === elmId);
    })
  ),

  // E.warning
  // http://www.w3.org/TR/css3-selectors/#class-html
  byClassName: (className, elms, not) => {
    const needle = ' ' + className + ' ';
    return elms.filter(d => {
      const haystack = d.getAttribute('class');
      return xor(!!haystack && (' ' + haystack + ' ').includes(needle), not);
    });
  },

  firstoftype: (_, elms, not) => FILTERS.nth('0n+1', elms, not, '*', false),

  lastoftype: (_, elms, not) => FILTERS.nth('0n+1', elms, not, '*', true),

  onlyoftype: (_, elms, not) => {
    const elms2 = FILTERS.nth('0n+1', elms, not, '*', false);
    return FILTERS.nth('0n+1', elms2, not, '*', true);
  },

  // http://www.w3.org/TR/css3-selectors/#structural-pseudos
  // - E:nth-child(n)
  // - E:nth-last-child(n)
  // - E:nth-of-type(n)
  // - E:nth-last-of-type(n)
  nth: (s, elms, not, tagName, last) => {
    const found = [];
    const m = re_nthValue.exec(s);
    if (m) {
      const interval = +(m.at(1) || 0) + +(m.at(2) ?? 1);
      const offset = +((m[3] || '').slice(1));
      for (const elm of elms) {
        let siblings = [ elm ];
        if (elm.parentNode) {
          siblings = elm.parentNode.children;
          const tn = tagName === '*' ? elm.tagName : tagName;
          if (tn !== '*' && tn) {
            siblings = siblings.filter(n => nameMatch(tn, n.tagName));
          }
        }
        const index = siblings.indexOf(elm) + 1;
        const n = last
          ? (1 + siblings.length - index) - offset
          : index - offset;
        const nth = interval
          ? (n % interval === 0 && n / interval >= 0)
          : (n === 0);
        if (xor(nth, !!not)) {
          found[found.length] = elm;
        }
      }
    }
    return found;
  },

  // http://www.w3.org/TR/css3-selectors/#UIstates
  enabled: (s, elm, not) => (
    FILTERS.disabled(s, elm, xor(1, not))
  ),

  contains: (s, elms, not) => (
    elms.filter(d => xor((d.textContent || '').includes(s), not))
  ),

  checked: (_, elms, not) => (
    elms.filter(d => xor(d.hasAttribute('checked'), not))
  ),

  disabled: (_, elms, not) => (
    elms.filter(d => xor(d.hasAttribute('disabled'), not))
  ),

  empty: (_, elms, not) => (
    elms.filter(d => xor(!d.childNodes.length, not))
  ),

  onlychild: (_, elms, not) => (
    elms.filter(d => d.parentNode && xor(d.parentNode.children.length === 1, not))
  ),

  lastchild: (_, elms, not) => (
    elms.filter(d => {
      if (!d.parentNode) { return false; }
      const siblings = d.parentNode.children;
      return xor(siblings.at(-1) === d, not);
    })
  ),

  firstchild: (_, elms, not) => (
    elms.filter(d => d.parentNode && xor(d.parentNode.children.at(0) === d, not))
  ),

  byTagName: (s, elms, not) => (
    elms.filter(d => xor(d.tagName === s, not))
  ),

  attrEqual: (s, elms, not, name) => (
    elms.filter(d => {
      const a = name && d.getAttribute(name);
      return xor(!!a && a === s, not);
    })
  ),

  attrPrefix: (s, elms, not, name) => (
    elms.filter(d => {
      const a = name && d.getAttribute(name);
      return xor(a?.startsWith(s), not);
    })
  ),

  attrSuffix: (s, elms, not, name) => (
    elms.filter(d => {
      const a = name && d.getAttribute(name);
      return xor(a?.endsWith(s), not);
    })
  ),

  attrIncludes: (s, elms, not, name) => (
    elms.filter(d => {
      const a = name && d.getAttribute(name);
      return xor(a?.includes(s), not);
    })
  ),

  attrDashStart: (s, elms, not, name) => (
    elms.filter(d => {
      const a = name && d.getAttribute(name);
      return xor(!!a && (a === s || a.startsWith(s + '-')), not);
    })
  ),

  attrWord: (s, elms, not, name) => (
    elms.filter(d => {
      const a = name && d.getAttribute(name);
      return xor(a?.split(/\s/).includes(s), not);
    })
  ),

  attr: (_, elms, not, name) => (
    elms.filter(d => xor(!!name && d.hasAttribute(name), not))
  )
};
