export function unquote (s, laxValue = false) {
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
  throw new Error('Invalid attribute');
}
