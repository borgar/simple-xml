import fs from 'fs';
import { describe, it, expect } from 'vitest';
import { parseXML } from '../lib/index.js';

const src = fs.readFileSync('test/data/css-selectors.xml', 'utf8');
const dom = parseXML(src);

describe('querySelectorAll', () => {
  it('a.url.fn', () => {
    expect(dom.root.querySelectorAll('a.url.fn').length).toBe(2);
  });

  it('a.url, a.fn', () => {
    expect(dom.root.querySelectorAll('a.url, a.fn').length).toBe(2);
  });

  it('li[class]:nth-of-type(2n+1)', () => {
    expect(dom.root.querySelectorAll('li[class]:nth-of-type(2n+1)').length).toBe(18);
  });

  it('*[class]:nth-of-type(2n+1)', () => {
    expect(dom.root.querySelectorAll('*[class]:nth-of-type(2n+1)').length).toBe(160);
  });

  it('li:nth-of-type(2n+1)', () => {
    expect(dom.root.querySelectorAll('li:nth-of-type(2n+1)').length).toBe(55);
  });

  it('li:nth-of-type(2n+2)', () => {
    expect(dom.root.querySelectorAll('li:nth-of-type(2n+2)').length).toBe(44);
  });

  it('li:nth-of-type(2n+3)', () => {
    expect(dom.root.querySelectorAll('li:nth-of-type(2n+3)').length).toBe(31);
  });

  it('li:nth-of-type(2n+4)', () => {
    expect(dom.root.querySelectorAll('li:nth-of-type(2n+4)').length).toBe(23);
  });

  it('li:nth-last-of-type(2n+1)', () => {
    expect(dom.root.querySelectorAll('li:nth-last-of-type(2n+1)').length).toBe(55);
  });

  it('li:nth-last-of-type(2n+2)', () => {
    expect(dom.root.querySelectorAll('li:nth-last-of-type(2n+2)').length).toBe(44);
  });

  it('li:nth-last-of-type(2n+3)', () => {
    expect(dom.root.querySelectorAll('li:nth-last-of-type(2n+3)').length).toBe(31);
  });

  it('li:nth-last-of-type(2n+4)', () => {
    expect(dom.root.querySelectorAll('li:nth-last-of-type(2n+4)').length).toBe(23);
  });

  it('li:nth-of-type(1n)', () => {
    expect(dom.root.querySelectorAll('li:nth-of-type(1n)').length).toBe(99);
  });

  it('li:nth-of-type(2n)', () => {
    expect(dom.root.querySelectorAll('li:nth-of-type(2n)').length).toBe(44);
  });

  it('li:nth-of-type(3n)', () => {
    expect(dom.root.querySelectorAll('li:nth-of-type(3n)').length).toBe(26);
  });

  it('li:nth-of-type(4n)', () => {
    expect(dom.root.querySelectorAll('li:nth-of-type(4n)').length).toBe(15);
  });

  it('li:nth-last-of-type(1n)', () => {
    expect(dom.root.querySelectorAll('li:nth-last-of-type(1n)').length).toBe(99);
  });

  it('li:nth-last-of-type(2n)', () => {
    expect(dom.root.querySelectorAll('li:nth-last-of-type(2n)').length).toBe(44);
  });

  it('li:nth-last-of-type(3n)', () => {
    expect(dom.root.querySelectorAll('li:nth-last-of-type(3n)').length).toBe(26);
  });

  it('li:nth-last-of-type(4n)', () => {
    expect(dom.root.querySelectorAll('li:nth-last-of-type(4n)').length).toBe(15);
  });

  it('li:nth-of-type(1)', () => {
    expect(dom.root.querySelectorAll('li:nth-of-type(1)').length).toBe(24);
  });

  it('li:nth-of-type(2)', () => {
    expect(dom.root.querySelectorAll('li:nth-of-type(2)').length).toBe(21);
  });

  it('li:nth-of-type(3)', () => {
    expect(dom.root.querySelectorAll('li:nth-of-type(3)').length).toBe(15);
  });

  it('li:nth-of-type(4)', () => {
    expect(dom.root.querySelectorAll('li:nth-of-type(4)').length).toBe(9);
  });

  it('li:nth-last-of-type(1)', () => {
    expect(dom.root.querySelectorAll('li:nth-last-of-type(1)').length).toBe(24);
  });

  it('li:nth-last-of-type(2)', () => {
    expect(dom.root.querySelectorAll('li:nth-last-of-type(2)').length).toBe(21);
  });

  it('li:nth-last-of-type(3)', () => {
    expect(dom.root.querySelectorAll('li:nth-last-of-type(3)').length).toBe(15);
  });

  it('li:nth-last-of-type(4)', () => {
    expect(dom.root.querySelectorAll('li:nth-last-of-type(4)').length).toBe(9);
  });

  it('div:nth-child(2n+1)', () => {
    expect(dom.root.querySelectorAll('div:nth-child(2n+1)').length).toBe(26);
  });

  it('div:nth-child(2n+2)', () => {
    expect(dom.root.querySelectorAll('div:nth-child(2n+2)').length).toBe(25);
  });

  it('div:nth-child(2n+3)', () => {
    expect(dom.root.querySelectorAll('div:nth-child(2n+3)').length).toBe(25);
  });

  it('div:nth-child(2n+4)', () => {
    expect(dom.root.querySelectorAll('div:nth-child(2n+4)').length).toBe(25);
  });

  it('div:nth-last-child(2n+1)', () => {
    expect(dom.root.querySelectorAll('div:nth-last-child(2n+1)').length).toBe(24);
  });

  it('div:nth-last-child(2n+2)', () => {
    expect(dom.root.querySelectorAll('div:nth-last-child(2n+2)').length).toBe(27);
  });

  it('div:nth-last-child(2n+3)', () => {
    expect(dom.root.querySelectorAll('div:nth-last-child(2n+3)').length).toBe(23);
  });

  it('div:nth-last-child(2n+4)', () => {
    expect(dom.root.querySelectorAll('div:nth-last-child(2n+4)').length).toBe(27);
  });

  it('div:nth-child(1n)', () => {
    expect(dom.root.querySelectorAll('div:nth-child(1n)').length).toBe(51);
  });

  it('div:nth-child(2n)', () => {
    expect(dom.root.querySelectorAll('div:nth-child(2n)').length).toBe(25);
  });

  it('div:nth-child(3n)', () => {
    expect(dom.root.querySelectorAll('div:nth-child(3n)').length).toBe(18);
  });

  it('div:nth-child(4n)', () => {
    expect(dom.root.querySelectorAll('div:nth-child(4n)').length).toBe(15);
  });

  it('div:nth-last-child(1n)', () => {
    expect(dom.root.querySelectorAll('div:nth-last-child(1n)').length).toBe(51);
  });

  it('div:nth-last-child(2n)', () => {
    expect(dom.root.querySelectorAll('div:nth-last-child(2n)').length).toBe(27);
  });

  it('div:nth-last-child(3n)', () => {
    expect(dom.root.querySelectorAll('div:nth-last-child(3n)').length).toBe(16);
  });

  it('div:nth-last-child(4n)', () => {
    expect(dom.root.querySelectorAll('div:nth-last-child(4n)').length).toBe(17);
  });

  it('div:nth-child(1)', () => {
    expect(dom.root.querySelectorAll('div:nth-child(1)').length).toBe(1);
  });

  it('div:nth-child(2)', () => {
    expect(dom.root.querySelectorAll('div:nth-child(2)').length).toBe(0);
  });

  it('div:nth-child(3)', () => {
    expect(dom.root.querySelectorAll('div:nth-child(3)').length).toBe(0);
  });

  it('div:nth-child(4)', () => {
    expect(dom.root.querySelectorAll('div:nth-child(4)').length).toBe(2);
  });

  it('div:nth-last-child(1)', () => {
    expect(dom.root.querySelectorAll('div:nth-last-child(1)').length).toBe(1);
  });

  it('div:nth-last-child(2)', () => {
    expect(dom.root.querySelectorAll('div:nth-last-child(2)').length).toBe(0);
  });

  it('div:nth-last-child(3)', () => {
    expect(dom.root.querySelectorAll('div:nth-last-child(3)').length).toBe(0);
  });

  it('div:nth-last-child(4)', () => {
    expect(dom.root.querySelectorAll('div:nth-last-child(4)').length).toBe(1);
  });

  it('div:nth-child(even)', () => {
    expect(dom.root.querySelectorAll('div:nth-child(even)').length).toBe(25);
  });

  it('div:nth-child(odd)', () => {
    expect(dom.root.querySelectorAll('div:nth-child(odd)').length).toBe(26);
  });

  it('div:nth-child(n)', () => {
    expect(dom.root.querySelectorAll('div:nth-child(n)').length).toBe(51);
  });

  it('div:nth-last-child(even)', () => {
    expect(dom.root.querySelectorAll('div:nth-last-child(even)').length).toBe(27);
  });

  it('div:nth-last-child(odd)', () => {
    expect(dom.root.querySelectorAll('div:nth-last-child(odd)').length).toBe(24);
  });

  it('div:nth-last-child(n)', () => {
    expect(dom.root.querySelectorAll('div:nth-last-child(n)').length).toBe(51);
  });

  it('div:first-of-type', () => {
    expect(dom.root.querySelectorAll('div:first-of-type').length).toBe(3);
  });

  it('div:last-of-type', () => {
    expect(dom.root.querySelectorAll('div:last-of-type').length).toBe(3);
  });

  it('div:only-of-type', () => {
    expect(dom.root.querySelectorAll('div:only-of-type').length).toBe(2);
  });

  it('div:nth-of-type(even)', () => {
    expect(dom.root.querySelectorAll('div:nth-of-type(even)').length).toBe(24);
  });

  it('div:nth-of-type(2n)', () => {
    expect(dom.root.querySelectorAll('div:nth-of-type(2n)').length).toBe(24);
  });

  it('div:nth-of-type(odd)', () => {
    expect(dom.root.querySelectorAll('div:nth-of-type(odd)').length).toBe(27);
  });

  it('div:nth-of-type(2n+1)', () => {
    expect(dom.root.querySelectorAll('div:nth-of-type(2n+1)').length).toBe(27);
  });

  it('div:nth-of-type(n)', () => {
    expect(dom.root.querySelectorAll('div:nth-of-type(n)').length).toBe(51);
  });

  it('div:nth-last-of-type(even)', () => {
    expect(dom.root.querySelectorAll('div:nth-last-of-type(even)').length).toBe(24);
  });

  it('div:nth-last-of-type(2n)', () => {
    expect(dom.root.querySelectorAll('div:nth-last-of-type(2n)').length).toBe(24);
  });

  it('div:nth-last-of-type(odd)', () => {
    expect(dom.root.querySelectorAll('div:nth-last-of-type(odd)').length).toBe(27);
  });

  it('div:nth-last-of-type(2n+1)', () => {
    expect(dom.root.querySelectorAll('div:nth-last-of-type(2n+1)').length).toBe(27);
  });

  it('div:nth-last-of-type(n)', () => {
    expect(dom.root.querySelectorAll('div:nth-last-of-type(n)').length).toBe(51);
  });

  it('label[for]', () => {
    expect(dom.root.querySelectorAll('label[for]').length).toBe(0);
  });

  it('*', () => {
    expect(dom.root.querySelectorAll('*').length).toBe(1778);
  });

  it('body', () => {
    expect(dom.root.querySelectorAll('body').length).toBe(0);
  });

  it('div', () => {
    expect(dom.root.querySelectorAll('div').length).toBe(51);
  });

  it('body div', () => {
    expect(dom.root.querySelectorAll('body div').length).toBe(0);
  });

  it('div div', () => {
    expect(dom.root.querySelectorAll('div div').length).toBe(2);
  });

  it('div div div', () => {
    expect(dom.root.querySelectorAll('div div div').length).toBe(0);
  });

  it('div p', () => {
    expect(dom.root.querySelectorAll('div p').length).toBe(140);
  });

  it('div > p', () => {
    expect(dom.root.querySelectorAll('div > p').length).toBe(134);
  });

  it('div + p', () => {
    expect(dom.root.querySelectorAll('div + p').length).toBe(22);
  });

  it('div ~ p', () => {
    expect(dom.root.querySelectorAll('div ~ p').length).toBe(183);
  });

  it('div.example ~ p', () => {
    expect(dom.root.querySelectorAll('div.example ~ p').length).toBe(152);
  });

  it('div[class^=exa][class$=mple]', () => {
    expect(dom.root.querySelectorAll('div[class^=exa][class$=mple]').length).toBe(43);
  });

  it('div p a', () => {
    expect(dom.root.querySelectorAll('div p a').length).toBe(12);
  });

  it('div, p, a', () => {
    expect(dom.root.querySelectorAll('div, p, a').length).toBe(671);
  });

  it('.note', () => {
    expect(dom.root.querySelectorAll('.note').length).toBe(14);
  });

  it('div.example', () => {
    expect(dom.root.querySelectorAll('div.example').length).toBe(43);
  });

  it('ul .tocline2', () => {
    expect(dom.root.querySelectorAll('ul .tocline2').length).toBe(12);
  });

  it('div.example, div.note', () => {
    expect(dom.root.querySelectorAll('div.example, div.note').length).toBe(44);
  });

  it('#title', () => {
    expect(dom.root.querySelectorAll('#title').length).toBe(1);
  });

  it('h1#title', () => {
    expect(dom.root.querySelectorAll('h1#title').length).toBe(1);
  });

  it('div #title', () => {
    expect(dom.root.querySelectorAll('div #title').length).toBe(1);
  });

  it('ul.toc li.tocline2', () => {
    expect(dom.root.querySelectorAll('ul.toc li.tocline2').length).toBe(12);
  });

  it('ul.toc > li.tocline2', () => {
    expect(dom.root.querySelectorAll('ul.toc > li.tocline2').length).toBe(12);
  });

  it('h1#title + div > p', () => {
    expect(dom.root.querySelectorAll('h1#title + div > p').length).toBe(0);
  });

  it('h1[id]:contains(Selectors)', () => {
    expect(dom.root.querySelectorAll('h1[id]:contains(Selectors)').length).toBe(1);
  });

  it('a[href][lang][class]', () => {
    expect(dom.root.querySelectorAll('a[href][lang][class]').length).toBe(1);
  });

  it('div[class]', () => {
    expect(dom.root.querySelectorAll('div[class]').length).toBe(51);
  });

  it('div[class=example]', () => {
    expect(dom.root.querySelectorAll('div[class=example]').length).toBe(43);
  });

  it('div[class^=exa]', () => {
    expect(dom.root.querySelectorAll('div[class^=exa]').length).toBe(43);
  });

  it('div[class$=mple]', () => {
    expect(dom.root.querySelectorAll('div[class$=mple]').length).toBe(43);
  });

  it('div[class*=e]', () => {
    expect(dom.root.querySelectorAll('div[class*=e]').length).toBe(50);
  });

  it('div[class|=dialog]', () => {
    expect(dom.root.querySelectorAll('div[class|=dialog]').length).toBe(0);
  });

  it('div[class!=made_up]', () => {
    expect(dom.root.querySelectorAll('div[class!=made_up]').length).toBe(51);
  });

  it('div[class~=example]', () => {
    expect(dom.root.querySelectorAll('div[class~=example]').length).toBe(43);
  });

  it('div:not(.example)', () => {
    expect(dom.root.querySelectorAll('div:not(.example)').length).toBe(8);
  });

  it('p:contains(selectors)', () => {
    expect(dom.root.querySelectorAll('p:contains(selectors)').length).toBe(54);
  });

  it('p:nth-child(even)', () => {
    expect(dom.root.querySelectorAll('p:nth-child(even)').length).toBe(158);
  });

  it('p:nth-child(2n)', () => {
    expect(dom.root.querySelectorAll('p:nth-child(2n)').length).toBe(158);
  });

  it('p:nth-child(odd)', () => {
    expect(dom.root.querySelectorAll('p:nth-child(odd)').length).toBe(166);
  });

  it('p:nth-child(2n+1)', () => {
    expect(dom.root.querySelectorAll('p:nth-child(2n+1)').length).toBe(166);
  });

  it('p:nth-child(n)', () => {
    expect(dom.root.querySelectorAll('p:nth-child(n)').length).toBe(324);
  });

  it('p:only-child', () => {
    expect(dom.root.querySelectorAll('p:only-child').length).toBe(3);
  });

  it('p:last-child', () => {
    expect(dom.root.querySelectorAll('p:last-child').length).toBe(19);
  });

  it('p:first-child', () => {
    expect(dom.root.querySelectorAll('p:first-child').length).toBe(54);
  });
});
