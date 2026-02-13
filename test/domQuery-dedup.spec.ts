import { describe, it, expect } from 'vitest';
import { parseXML } from '../lib/index.js';

describe('domQuery dedup fix', () => {
  it('preserves document order for single-group selectors', () => {
    const doc = parseXML('<root><x/><y/><z/></root>');
    const result = doc.root!.querySelectorAll('*');
    expect(result.map(e => e.tagName)).toEqual(['x', 'y', 'z']);
  });

  it('preserves document order for multi-group (comma) selectors', () => {
    const doc = parseXML('<root><a/><b/><c/></root>');
    // Even if groups are listed out of document order, results should
    // be in document order (via the getElementsByTagName tree walk).
    const result = doc.root!.querySelectorAll('c, a');
    expect(result.map(e => e.tagName)).toEqual(['a', 'c']);
  });

  it('deduplicates descendant combinator results', () => {
    // A descendant selector can match the same element via multiple ancestors.
    const doc = parseXML('<root><a><a><c/></a></a></root>');
    // "a c" matches <c> through both <a>'s; should find exactly one <c>
    const result = doc.root!.querySelectorAll('a c');
    expect(result.map(e => e.tagName)).toEqual(['c']);
  });

  it('deduplicates multi-group (comma) selector results', () => {
    // Two selector groups that both match the same element:
    // "a c" matches <c> as a descendant of <a>,
    // "b c" matches <c> as a descendant of <b>.
    const doc = parseXML('<root><a><b><c/></b></a></root>');
    const result = doc.root!.querySelectorAll('a c, b c');
    expect(result.length).toBe(1);
    expect(result[0].tagName).toBe('c');
  });
});
