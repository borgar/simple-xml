import { describe, it, expect } from 'vitest';
import { splitQName } from './splitQName.ts';
import { Attr, Document, Element, InvalidCharacterError, XMLError } from './index.ts';

const valid: [ string, string | null, string ][] = [
  [ 'a', null, 'a' ],
  [ 'A_b-c.d1', null, 'A_b-c.d1' ],
  [ '_x', null, '_x' ],
  [ 'p:x', 'p', 'x' ],
  [ 'xml:space', 'xml', 'space' ],
  [ 'xmlns', null, 'xmlns' ],
  [ 'xmlns:p', 'xmlns', 'p' ],
  [ '\u00E9l\u00E9ment', null, '\u00E9l\u00E9ment' ],
  [ 'p:\u00E9', 'p', '\u00E9' ],
  [ 'a\u00B7b', null, 'a\u00B7b' ],
  [ 'x\u0300', null, 'x\u0300' ],
  [ '\u65E5\u672C', null, '\u65E5\u672C' ],
  [ '\u{10000}a', null, '\u{10000}a' ],
  [ 'a\u{EFFFF}', null, 'a\u{EFFFF}' ]
];

const invalid = [
  '',
  ':',
  'a:',
  ':a',
  'a:b:c',
  '1a',
  '-a',
  '.a',
  'p:1a',
  'p:-a',
  'a b',
  'a\tb',
  'a>b',
  'a<b',
  'a"b',
  "a'b",
  'a=b',
  'a/b',
  'a&b',
  'a\x00b',
  '\u00B7a',
  '\u0300a',
  '\u00D7',
  'a\u00F7',
  'a\uD800',
  '\uDC00a',
  'a\u{F0000}',
  'a\uFFFE'
];

describe('splitQName', () => {
  it('splits valid names into prefix and local name', () => {
    for (const [ name, prefix, localName ] of valid) {
      expect(splitQName(name), name).toEqual([ prefix, localName ]);
    }
  });

  it('throws InvalidCharacterError for invalid names', () => {
    for (const name of invalid) {
      expect(() => splitQName(name), JSON.stringify(name)).toThrow(InvalidCharacterError);
    }
  });

  it('names the invalid name in the error', () => {
    expect(() => splitQName('a b')).toThrow(/'a b'/);
  });

  it('throws an XMLError subclass', () => {
    expect(new InvalidCharacterError('x')).toBeInstanceOf(XMLError);
    expect(new InvalidCharacterError('x').name).toBe('InvalidCharacterError');
  });
});

describe('name validation', () => {
  it('applies to every way of making an element', () => {
    const doc = new Document();
    doc.attachNS('urn:p', 'p');
    expect(() => new Element('a b')).toThrow(InvalidCharacterError);
    expect(() => doc.createElement('a b')).toThrow(InvalidCharacterError);
    expect(() => doc.createElementNS('urn:p', 'a b')).toThrow(InvalidCharacterError);
    expect(() => doc.createElementNS('urn:p', 'p:a:b')).toThrow(InvalidCharacterError);
    expect(() => new Element('p').createChild('a b')).toThrow(InvalidCharacterError);
  });

  it('applies to every way of setting an attribute', () => {
    const el = new Element('r');
    expect(() => new Attr('a b', '1')).toThrow(InvalidCharacterError);
    expect(() => el.setAttribute('a="1" b', '1')).toThrow(InvalidCharacterError);
    expect(() => el.setAttrValues({ 'a b': '1' })).toThrow(InvalidCharacterError);
    expect(() => new Element('r', { '1a': '1' })).toThrow(InvalidCharacterError);
    expect(() => new Document().createElement('r', { 'a:b:c': '1' })).toThrow(InvalidCharacterError);
    expect(el.attributes.length).toBe(0);
  });

  it('does not change existing names', () => {
    const el = new Element('p:r', { 'a': '1', 'xml:space': 'preserve' });
    el.setAttribute('a', '2');
    expect(el.fullName).toBe('p:r');
    expect(el.toString()).toBe('<p:r a="2" xml:space="preserve" />');
  });
});
