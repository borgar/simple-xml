const entities: Record<string, string> = {
  '"': '&quot;',
  '&': '&amp;',
  "'": '&apos;',
  '<': '&lt;',
  '>': '&gt;',
  '\n': '\n',
  '\r': '\r'
};

/**
 * Escape XML entities in a string.
 *
 * @param {string} s Unescaped string
 * @returns {string} Escaped string
 */
export function escape (s: string): string {
  // eslint-disable-next-line no-control-regex
  return s.replace(/["&'<>\x00-\x1f]/ig, m => entities[m] || `&#${m.charCodeAt(0)};`);
}
