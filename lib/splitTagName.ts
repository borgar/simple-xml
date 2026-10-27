export function splitTagName (tagName: string): [ string, string ] | [ null, string ] {
  const i = tagName.indexOf(':');
  if (i < 0) {
    return [ null, tagName ];
  }
  // only the first two parts of a name with more colons are kept
  const j = tagName.indexOf(':', i + 1);
  return [ tagName.slice(0, i), j < 0 ? tagName.slice(i + 1) : tagName.slice(i + 1, j) ];
}
