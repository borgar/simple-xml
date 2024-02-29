import { FILTERS } from './filters.js';
import { tokenize } from './tokenize.js';

export function matchToken (t, not, elms) {
  const tagName = t.tagName;
  not = not || 0;

  if (t.operator) {
    elms = FILTERS[t.operator](tagName, elms);
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

  for (const className of t.className) {
    elms = FILTERS.byClassName(className, elms, not);
  }

  for (const ps of t.pseudo) {
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

  for (const { operator, value, name } of t.attr) {
    const op = (operator in FILTERS) ? operator : 'attr';
    elms = FILTERS[op](value, elms, not, name);
  }

  return elms;
}
