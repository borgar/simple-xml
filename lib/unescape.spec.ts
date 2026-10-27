import { describe, it, expect } from 'vitest';
import { unescape } from './unescape.ts';

describe('unescape', () => {
  it('returns strings without references unchanged', () => {
    expect(unescape('')).toBe('');
    expect(unescape('plain text')).toBe('plain text');
  });

  it('expands the predefined entities', () => {
    expect(unescape('&lt;a&gt; &amp; &quot;b&quot; &apos;c&apos;')).toBe('<a> & "b" \'c\'');
  });

  it('expands decimal and hex character references', () => {
    expect(unescape('&#65;&#x42;&#X43;&#xe9;&#x1F600;')).toBe('ABC\u00E9\u{1F600}');
    expect(unescape('x&#9;y&#10;z&#13;w')).toBe('x\ty\nz\rw');
  });

  it('keeps invalid code points as written', () => {
    expect(unescape('&#0;')).toBe('&#0;');
    expect(unescape('&#xD800;')).toBe('&#xD800;');
    expect(unescape('&#x110000;')).toBe('&#x110000;');
    expect(unescape('&#x100000041;')).toBe('&#x100000041;');
    expect(unescape('&#4294967361;')).toBe('&#4294967361;');
  });

  it('keeps malformed references as written', () => {
    expect(unescape('&')).toBe('&');
    expect(unescape('a & b')).toBe('a & b');
    expect(unescape('&#;')).toBe('&#;');
    expect(unescape('&#x;')).toBe('&#x;');
    expect(unescape('&#zz')).toBe('&#zz');
    expect(unescape('&#xZZ;')).toBe('&#xZZ;');
    expect(unescape('&#12')).toBe('&#12');
    expect(unescape('&foo;')).toBe('&foo;');
    expect(unescape('&;')).toBe('&;');
  });

  it('expands references that follow a malformed one', () => {
    expect(unescape('&lt &gt;')).toBe('&lt >');
    expect(unescape('& &amp;')).toBe('& &');
    expect(unescape('&#zz&#65;')).toBe('&#zzA');
  });

  it('keeps raw whitespace in text', () => {
    expect(unescape('a\tb\nc\rd &amp; e\n')).toBe('a\tb\nc\rd & e\n');
  });

  describe('attribute values', () => {
    it('turns raw tab, LF, and CR into spaces', () => {
      expect(unescape('a\tb\nc\rd', true)).toBe('a b c d');
      expect(unescape('\n\nxyz\t', true)).toBe('  xyz ');
    });

    it('keeps whitespace written as character references', () => {
      expect(unescape('&#xd;&#xd;A&#xa;&#xa;B&#xd;&#xa;', true)).toBe('\r\rA\n\nB\r\n');
    });

    it('handles references and raw whitespace together', () => {
      expect(unescape('a\n&lt;\tb&#10;c\r&amp;', true)).toBe('a < b\nc &');
      expect(unescape('&lt\n&gt;', true)).toBe('&lt >');
    });

    it('returns strings without references or whitespace unchanged', () => {
      expect(unescape('', true)).toBe('');
      expect(unescape('plain text', true)).toBe('plain text');
    });
  });
});
