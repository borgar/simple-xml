/**
 * @ignore
 * @param {string} source
 * @returns {string}
 */
export function removeCR (source) {
  let output = '';

  let pos = 0;
  let next = source.indexOf('\r');
  if (next === -1) {
    return source;
  }

  while (next !== -1) {
    output += source.slice(pos, next);
    if (source.charAt(next + 1) !== '\n') {
      output += '\n';
    }
    pos = next + 1;
    next = source.indexOf('\r', pos);
  }

  output += source.slice(pos);

  return output;
}
