import { describe, it, expect } from 'vitest';
import { Element, escapeXML, parseXML, simplePrint } from './index.ts';

const REPLACEMENT = '&#xFFFD;';

describe('escapeXML', () => {
  it('escapes markup characters', () => {
    expect(escapeXML('<a href="x">&\'</a>')).toBe('&lt;a href=&quot;x&quot;&gt;&amp;&apos;&lt;/a&gt;');
  });

  it('writes tab as a character reference and keeps line breaks', () => {
    expect(escapeXML('a\tb\nc\rd')).toBe('a&#9;b\nc\rd');
    expect(escapeXML('a\tb\nc\rd', false)).toBe('a&#9;b\nc\rd');
  });

  it('writes tab, LF, and CR as character references in attribute values', () => {
    expect(escapeXML('a\tb\nc\rd\r\ne', true)).toBe('a&#9;b&#10;c&#13;d&#13;&#10;e');
    expect(escapeXML('\n', true)).toBe('&#10;');
    expect(escapeXML('<"&\x01>', true)).toBe(`&lt;&quot;&amp;${REPLACEMENT}&gt;`);
  });

  it('keeps line breaks in attribute values through a print and parse round trip', () => {
    const value = 'line1\nline2\r\nline3\rline4\tend';
    const el = new Element('a', { v: value });
    el.append('text\nkeeps\nraw\nbreaks');
    const expected = '<a v="line1&#10;line2&#13;&#10;line3&#13;line4&#9;end">text\nkeeps\nraw\nbreaks</a>';
    expect(simplePrint(el)).toBe(expected);
    expect(el.toString()).toBe(expected);
    expect(parseXML(simplePrint(el)).root?.getAttribute('v')).toBe(value);
    expect(parseXML(el.toString()).root?.getAttribute('v')).toBe(value);
  });

  it('writes C0 control characters that XML 1.0 forbids as a U+FFFD reference', () => {
    expect(escapeXML('a\x01b')).toBe(`a${REPLACEMENT}b`);
    expect(escapeXML('\x00\x08\x0B\x0C\x0E\x1F')).toBe(REPLACEMENT.repeat(6));
  });

  it('writes U+FFFE and U+FFFF as a U+FFFD reference', () => {
    expect(escapeXML('a\uFFFEb\uFFFFc')).toBe(`a${REPLACEMENT}b${REPLACEMENT}c`);
  });

  it('writes lone surrogates as a U+FFFD reference', () => {
    expect(escapeXML('a\uD800b')).toBe(`a${REPLACEMENT}b`);
    expect(escapeXML('a\uDC00b')).toBe(`a${REPLACEMENT}b`);
    expect(escapeXML('a\uDC00\uD800b')).toBe(`a${REPLACEMENT}${REPLACEMENT}b`);
    expect(escapeXML('a\uD800\u{10000}b')).toBe(`a${REPLACEMENT}\u{10000}b`);
    expect(escapeXML('ab\uD800')).toBe(`ab${REPLACEMENT}`);
  });

  it('keeps characters that XML 1.0 allows', () => {
    const allowed = ' ~\x7F\x85\u00A0\uD7FF\uE000\uFFFD\u{10000}\u{1F600}\u{10FFFF}';
    expect(escapeXML(allowed)).toBe(allowed);
  });

  it('produces well-formed output from the printers', () => {
    const el = new Element('a', { v: 'x\x01y' });
    el.append('p\x02q\uD800');
    const expected = `<a v="x${REPLACEMENT}y">p${REPLACEMENT}q${REPLACEMENT}</a>`;
    expect(simplePrint(el)).toBe(expected);
    expect(el.toString()).toBe(expected);
    const root = parseXML(expected).root;
    expect(root?.getAttribute('v')).toBe('x\uFFFDy');
    expect(root?.textContent).toBe('p\uFFFDq\uFFFD');
  });
});
