import { describe, it, expect } from 'vitest';
import { Attr, Element, InUseAttributeError, XMLError, parseXML } from './index.ts';

const XML_NS = 'http://www.w3.org/XML/1998/namespace';
const XMLNS_NS = 'http://www.w3.org/2000/xmlns/';

const attrOf = (el: Element, name: string) => {
  const attr = el.attributes.getNamedItem(name);
  if (!attr) {
    throw new Error('missing attribute ' + name);
  }
  return attr;
};

describe('Attr.ownerElement', () => {
  it('is null for a new Attr', () => {
    expect(new Attr('x', '1').ownerElement).toBeNull();
  });

  it('is the element for attributes set in any way', () => {
    const el = new Element('a', { x: '1' });
    el.setAttribute('y', '2');
    el.attributes.setNamedItem(new Attr('z', '3'));
    expect(attrOf(el, 'x').ownerElement).toBe(el);
    expect(attrOf(el, 'y').ownerElement).toBe(el);
    expect(attrOf(el, 'z').ownerElement).toBe(el);
    const parsed = parseXML('<r><c x="1"/></r>').root!.children[0];
    expect(attrOf(parsed, 'x').ownerElement).toBe(parsed);
  });

  it('is read-only', () => {
    const attr = attrOf(new Element('a', { x: '1' }), 'x');
    // @ts-expect-error -- ownerElement has no setter
    expect(() => { attr.ownerElement = null; }).toThrow(TypeError);
  });

  it('is cleared when the attribute is removed', () => {
    const el = new Element('a', { x: '1', y: '2' });
    const x = attrOf(el, 'x');
    const y = attrOf(el, 'y');
    el.removeAttribute('x');
    el.attributes.removeNamedItem('y');
    expect(x.ownerElement).toBeNull();
    expect(y.ownerElement).toBeNull();
  });

  it('is cleared on the attribute that setNamedItem replaces', () => {
    const el = new Element('a', { x: '1' });
    const old = attrOf(el, 'x');
    const next = new Attr('x', '2');
    expect(el.attributes.setNamedItem(next)).toBe(old);
    expect(old.ownerElement).toBeNull();
    expect(next.ownerElement).toBe(el);
    expect(el.getAttribute('x')).toBe('2');
  });

  it('is not part of JSON output', () => {
    const attr = attrOf(new Element('a', { x: '1' }), 'x');
    expect(JSON.parse(JSON.stringify(attr))).not.toHaveProperty('ownerElement');
  });

  it('is null on a copy made from own properties, as test tools make', () => {
    const attr = attrOf(new Element('a', { x: '1' }), 'x');
    const copy = Object.assign(Object.create(Attr.prototype) as Attr, attr);
    expect(copy.ownerElement).toBeNull();
    expect(copy.value).toBe('1');
  });
});

describe('setNamedItem with an Attr that belongs to an element', () => {
  it('throws InUseAttributeError for another element, and changes nothing', () => {
    const one = new Element('one', { y: '1' });
    const two = new Element('two');
    const y = attrOf(one, 'y');
    expect(() => two.attributes.setNamedItem(y)).toThrow(InUseAttributeError);
    expect(two.attributes.length).toBe(0);
    expect(y.ownerElement).toBe(one);
    expect(one.getAttribute('y')).toBe('1');
  });

  it('allows the Attr once it is removed from its element', () => {
    const one = new Element('one', { y: '1' });
    const two = new Element('two');
    const y = attrOf(one, 'y');
    one.attributes.removeNamedItem('y');
    two.attributes.setNamedItem(y);
    expect(y.ownerElement).toBe(two);
    expect(two.getAttribute('y')).toBe('1');
    expect(one.hasAttribute('y')).toBe(false);
  });

  it('returns the Attr itself when it is already set on the same element', () => {
    const el = new Element('a', { x: '1' });
    const x = attrOf(el, 'x');
    expect(el.attributes.setNamedItem(x)).toBe(x);
    expect(x.ownerElement).toBe(el);
    expect(el.attributes.length).toBe(1);
  });

  it('is an XMLError', () => {
    expect(new InUseAttributeError('x')).toBeInstanceOf(XMLError);
    expect(new InUseAttributeError('x').name).toBe('InUseAttributeError');
  });
});

describe('setAttribute on an existing attribute', () => {
  it('updates the existing Attr in place', () => {
    const el = new Element('a', { x: '1' });
    const held = attrOf(el, 'x');
    el.setAttribute('x', 2);
    expect(held.value).toBe('2');
    expect(attrOf(el, 'x')).toBe(held);
    expect(held.ownerElement).toBe(el);
    expect(el.attributes.length).toBe(1);
  });

  it('keeps the attribute order', () => {
    const el = new Element('a', { x: '1', y: '2' });
    el.setAttribute('x', '3');
    expect([ ...el.attributes ].map(d => d.name)).toEqual([ 'x', 'y' ]);
  });
});

describe('Attr.namespaceURI', () => {
  const el = parseXML('<r xmlns="urn:default" xmlns:p="urn:p" id="1" p:x="2" xml:space="preserve"/>').root!;

  it('is null for unprefixed attributes, even with a default namespace', () => {
    expect(attrOf(el, 'id').namespaceURI).toBeNull();
  });

  it('is the XMLNS namespace for namespace declarations', () => {
    expect(attrOf(el, 'xmlns').namespaceURI).toBe(XMLNS_NS);
    expect(attrOf(el, 'xmlns:p').namespaceURI).toBe(XMLNS_NS);
  });

  it('is the XML namespace for xml: attributes', () => {
    expect(attrOf(el, 'xml:space').namespaceURI).toBe(XML_NS);
  });

  it('resolves other prefixes against the owner element', () => {
    expect(attrOf(el, 'p:x').namespaceURI).toBe('urn:p');
  });

  it('is null for an unknown or detached prefix', () => {
    expect(attrOf(new Element('a', { 'q:x': '1' }), 'q:x').namespaceURI).toBeNull();
    expect(new Attr('p:x', '1').namespaceURI).toBeNull();
    expect(new Attr('xml:lang', 'en').namespaceURI).toBe(XML_NS);
  });

  it('follows the element when it moves', () => {
    const a = parseXML('<a xmlns:p="urn:one"/>').root!;
    const b = parseXML('<b xmlns:p="urn:two"/>').root!;
    const c = new Element('c', { 'p:x': '1' });
    a.appendChild(c);
    expect(attrOf(c, 'p:x').namespaceURI).toBe('urn:one');
    b.appendChild(c);
    expect(attrOf(c, 'p:x').namespaceURI).toBe('urn:two');
  });
});
