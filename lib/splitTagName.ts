export function splitTagName (tagName: string): [ string, string ] | [ null, string ] {
  if (tagName.includes(':')) {
    return tagName.split(':').slice(0, 2) as [ string, string ];
  }
  return [ null, tagName ];
}
