/* eslint-disable @typescript-eslint/prefer-string-starts-ends-with */

import { ParserError } from './errors.js';

export function unquote (s: string, laxValue = false): string {
  if (s && s.length > 1) {
    if (s[0] === '"' && s[s.length - 1] === '"') {
      return s.slice(1, -1);
    }
    if (s[0] === "'" && s[s.length - 1] === "'") {
      return s.slice(1, -1);
    }
  }
  if (laxValue) {
    return s;
  }
  throw new ParserError('Invalid attribute: ' + s);
}
