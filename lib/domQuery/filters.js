/* eslint-disable jsdoc/no-undefined-types */
import { Element } from '../Element.js';

const re_nthValue = /(-?)(\d+)?(n[+-](\d+))?/;

/**
 * @ignore
 * @param {string} matchTag The criteria tag the candidate tag must match
 * @param {string} candTag The candidate tag
 * @returns {boolean} is it a match?
 */
const nameMatch = (matchTag, candTag) => matchTag === '*' || matchTag === candTag;

/**
 * @ignore
 * @param {number|boolean} a Left value
 * @param {number|boolean} b Right value
 * @returns {boolean} Result
 */
const xor = (a, b) => !!(+a ^ +b);

/**
 * @ignore
 * @callback Filter
 * @param {string} query
 * @param {Element[]} elms
 * @param {boolean} [not]
 * @param {string} [name]
 * @param {boolean} [last]
 */

/** @type {Record<string, Filter>} */
export const FILTERS = {
  // "E > F" => Match an F element child of an E element
  byChild: (tagName, elms) => {
    const found = [];
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
    const found = [];
    for (const elm of elms) {
      const nodes = /** @type {Element} */(elm.parentNode).children;
      const idx = nodes.indexOf(elm);
      const prev = nodes[idx + 1];
      if (prev && nameMatch(tagName, prev.tagName)) {
        found.push(prev);
      }
    }
    return found;
  },

  // "E ~ F" => Match an F element preceded by an E element
  bySibling: (tagName, elms) => {
    let found = [];
    const parents = [];
    for (const elm of elms) {
      const parent = /** @type {Element} */(elm.parentNode);
      if (parents.indexOf(parent) === -1) {
        parents.push(parent);
        const elmIdx = parent.childNodes.indexOf(elm);
        const siblings = parent.children.filter(d => nameMatch(tagName, d.tagName));
        for (let i = 0; i < siblings.length; i++) {
          const ref = siblings[i];
          if (elmIdx < ref.parentNode.childNodes.indexOf(ref)) {
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
    let found = [];
    let i = 0;
    let ref;
    tagName = tagName || '*';
    while ((ref = elms[i++])) {
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
      return xor((haystack && (' ' + haystack + ' ').includes(needle)), not);
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
      const interval = +m[1] + +(m[2] || 1);
      const offset = +((m[3] || '').slice(1));
      for (const elm of elms) {
        let siblings = [ elm ];
        if (elm.parentNode) {
          siblings = /** @type {Element} */(elm.parentNode).children;
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
        if (xor(nth, not)) {
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
    elms.filter(d => xor(/** @type {Element} */(d.parentNode).children.length === 1, not))
  ),

  lastchild: (_, elms, not) => (
    elms.filter(d => {
      const siblings = /** @type {Element} */(d.parentNode).children;
      return xor(siblings[siblings.length - 1] === d, not);
    })
  ),

  firstchild: (_, elms, not) => (
    elms.filter(d => xor(/** @type {Element} */(d.parentNode).children[0] === d, not))
  ),

  byTagName: (s, elms, not) => (
    elms.filter(d => xor(d.tagName === s, not))
  ),

  attrEqual: (s, elms, not, n) => (
    elms.filter(d => {
      const a = d.getAttribute(n);
      return xor(a && a === s, not);
    })
  ),

  attrPrefix: (s, elms, not, n) => (
    elms.filter(d => {
      const a = d.getAttribute(n);
      return xor(a && a.startsWith(s), not);
    })
  ),

  attrSuffix: (s, elms, not, n) => (
    elms.filter(d => {
      const a = d.getAttribute(n);
      return xor(a && a.endsWith(s), not);
    })
  ),

  attrIncludes: (s, elms, not, n) => (
    elms.filter(d => {
      const a = d.getAttribute(n);
      return xor(a && a.includes(s), not);
    })
  ),

  attrDashStart: (s, elms, not, n) => (
    elms.filter(d => {
      const a = d.getAttribute(n);
      return xor(a && (a === s || a.startsWith(s + '-')), not);
    })
  ),

  attrWord: (s, elms, not, n) => (
    elms.filter(d => {
      const a = d.getAttribute(n);
      return xor(a && a.split(/\s/).includes(s), not);
    })
  ),

  attr: (_, elms, not, n) => (
    elms.filter(d => xor(d.hasAttribute(n), not))
  )
};
