import { describe, it, expect } from 'vitest';
import { parseXML } from './index.ts';
import { parseAttr } from './parseAttr.ts';

const attr = (src: string, name = 'a') => parseXML(src).root?.getAttribute(name);

// XML 1.0, section 3.3.3 Attribute-Value Normalization
describe('attribute-value normalization', () => {
  it('turns raw tab, LF, and CR into spaces', () => {
    expect(attr('<r a="x\ty"/>')).toBe('x y');
    expect(attr('<r a="x\ny"/>')).toBe('x y');
    expect(attr('<r a="x\ry"/>')).toBe('x y');
    expect(attr("<r a='x\ty\nz'/>")).toBe('x y z');
  });

  it('turns CRLF into a single space', () => {
    expect(attr('<r a="x\r\ny"/>')).toBe('x y');
    expect(attr('<r a="x\r\n\r\ny"/>')).toBe('x  y');
  });

  it('keeps every space without trimming or collapsing', () => {
    expect(attr('<r a="  x \n\t y  "/>')).toBe('  x    y  ');
  });

  it('keeps whitespace written as character references', () => {
    expect(attr('<r a="x&#9;y&#10;z&#13;w"/>')).toBe('x\ty\nz\rw');
    expect(attr('<r a="x&#x9;y&#xA;z&#xD;w"/>')).toBe('x\ty\nz\rw');
  });

  it('matches the example in the spec', () => {
    expect(attr('<r a="&#xd;&#xd;A&#xa;&#xa;B&#xd;&#xa;"/>')).toBe('\r\rA\n\nB\r\n');
    expect(attr('<r a="\n\nxyz"/>')).toBe('  xyz');
  });

  it('normalizes attributes on the root element and on descendants', () => {
    const doc = parseXML('<r a="1\n2"><c b="3\t4"/></r>');
    expect(doc.root?.getAttribute('a')).toBe('1 2');
    expect(doc.root?.firstChild && (doc.root.firstChild as typeof doc.root).getAttribute('b')).toBe('3 4');
  });

  it('normalizes unterminated values in lax mode', () => {
    expect(parseAttr('a="x\ny', true)).toEqual({ a: 'x y' });
  });

  it('does not change line breaks in text content', () => {
    expect(parseXML('<r>x\ny\tz</r>').root?.textContent).toBe('x\ny\tz');
  });
});
