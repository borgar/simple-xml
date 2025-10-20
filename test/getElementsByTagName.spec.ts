import { describe, it, expect } from 'vitest';
import { parseXML } from '../lib/index.js';

describe('getElementByTagName', () => {
  it('should find elements by tag name', () => {
    let dom = parseXML('<a><b /></a>');
    expect(dom.getElementsByTagName('a').length).toBe(1);
    expect(dom.getElementsByTagName('b').length).toBe(1);

    dom = parseXML('<a><b /><b /><b /><b /><b /><b /></a>');
    expect(dom.getElementsByTagName('a').length).toBe(1);
    expect(dom.getElementsByTagName('b').length).toBe(6);

    dom = parseXML('<a><b><c><d><e><f /></e></d></c></b></a>');
    expect(dom.getElementsByTagName('f').length).toBe(1);
    expect(dom.getElementsByTagName('d')[0].getElementsByTagName('f').length).toBe(1);
  });

  it('should return elements in source order', () => {
    const dom = parseXML(`
<a>
  <d o="1" />
  <b>
    <d o="2" />
    <c>
      <d o="3" />
    </c>
    <d o="4" />
  </b>
  <d o="5" />
  <b>
    <d o="6" />
    <d o="7" />
  </b>
  <d o="8" />
</a>
`);
    const m1 = dom.getElementsByTagName('d').map(d => +d.attr.o);
    expect(m1).toEqual([ 1, 2, 3, 4, 5, 6, 7, 8 ]);
  });
});
