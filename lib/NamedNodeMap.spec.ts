import { describe, it, expect, expectTypeOf } from 'vitest';
import { Attr, Element, NotFoundError } from '../lib/index.ts';
import type { NamedNodeMap } from '../lib/index.ts';

describe('NamedNodeMap', () => {
  describe('construction and identity', () => {
    it('a new Element exposes an attributes NamedNodeMap', () => {
      const el = new Element('foo');
      expect(el.attributes).toBeDefined();
      expect(el.attributes).not.toBeNull();
    });

    it('the attributes map is empty for an element constructed with no attrs', () => {
      const el = new Element('foo');
      expect(el.attributes.length).toBe(0);
    });

    it('returns the same NamedNodeMap instance on repeated reads', () => {
      const el = new Element('foo');
      expect(el.attributes).toBe(el.attributes);
    });

    it('each element gets its own independent NamedNodeMap', () => {
      const a = new Element('a');
      const b = new Element('b');
      a.setAttribute('x', '1');
      expect(b.attributes.length).toBe(0);
      expect(a.attributes).not.toBe(b.attributes);
    });

    it('exposes Attr instances, and the types are exported from the package', () => {
      const el = new Element('foo', { a: '1' });
      const map: NamedNodeMap = el.attributes;
      const attr: Attr | null = map.item(0);
      expect(attr).toBeInstanceOf(Attr);
    });
  });

  describe('length', () => {
    it('reflects the number of attributes assigned at construction time', () => {
      const el = new Element('foo', { a: '1', b: '2', c: '3' });
      expect(el.attributes.length).toBe(3);
    });

    it('grows when new attributes are added via setAttribute', () => {
      const el = new Element('foo');
      expect(el.attributes.length).toBe(0);
      el.setAttribute('a', '1');
      expect(el.attributes.length).toBe(1);
      el.setAttribute('b', '2');
      expect(el.attributes.length).toBe(2);
    });

    it('does not grow when an existing attribute is overwritten', () => {
      const el = new Element('foo');
      el.setAttribute('a', '1');
      el.setAttribute('a', '2');
      expect(el.attributes.length).toBe(1);
    });

    it('shrinks when an attribute is removed via removeAttribute', () => {
      const el = new Element('foo', { a: '1', b: '2' });
      el.removeAttribute('a');
      expect(el.attributes.length).toBe(1);
      el.removeAttribute('b');
      expect(el.attributes.length).toBe(0);
    });

    it('is read-only (assigning to length has no effect)', () => {
      const el = new Element('foo', { a: '1', b: '2' });
      try {
        // @ts-expect-error - testing runtime immutability
        el.attributes.length = 0;
      }
      catch {
        // strict mode may throw; either way, length should not change
      }
      expect(el.attributes.length).toBe(2);
    });
  });

  describe('getNamedItem', () => {
    it('returns an Attr object for an attribute that exists', () => {
      const el = new Element('foo', { color: 'red' });
      const attr = el.attributes.getNamedItem('color');
      expect(attr).not.toBeNull();
      expect(attr?.value).toBe('red');
    });

    it('returns null for an attribute that does not exist', () => {
      const el = new Element('foo', { color: 'red' });
      expect(el.attributes.getNamedItem('missing')).toBeNull();
    });

    it('is case-sensitive (XML semantics)', () => {
      const el = new Element('foo', { color: 'red' });
      expect(el.attributes.getNamedItem('Color')).toBeNull();
      expect(el.attributes.getNamedItem('COLOR')).toBeNull();
      expect(el.attributes.getNamedItem('color')?.value).toBe('red');
    });

    it('reflects updated values after setAttribute overwrites an existing attribute', () => {
      const el = new Element('foo', { color: 'red' });
      el.setAttribute('color', 'blue');
      expect(el.attributes.getNamedItem('color')?.value).toBe('blue');
    });

    it('returns null after the attribute has been removed', () => {
      const el = new Element('foo', { color: 'red' });
      el.removeAttribute('color');
      expect(el.attributes.getNamedItem('color')).toBeNull();
    });
  });

  describe('setNamedItem', () => {
    it('adds a new Attr to the map and increases length', () => {
      const el = new Element('foo');
      el.attributes.setNamedItem(new Attr('color', 'red'));
      expect(el.attributes.length).toBe(1);
      expect(el.attributes.getNamedItem('color')?.value).toBe('red');
    });

    it('replaces an existing attribute with the same name', () => {
      const el = new Element('foo', { color: 'red' });
      el.attributes.setNamedItem(new Attr('color', 'green'));
      expect(el.attributes.length).toBe(1);
      expect(el.attributes.getNamedItem('color')?.value).toBe('green');
    });

    it('returns null when adding a brand-new attribute (per DOM spec)', () => {
      const el = new Element('foo');
      const result = el.attributes.setNamedItem(new Attr('color', 'red'));
      expect(result).toBeNull();
    });

    it('returns the previously-stored Attr when replacing (per DOM spec)', () => {
      const el = new Element('foo', { color: 'red' });
      const previous = el.attributes.getNamedItem('color');
      const result = el.attributes.setNamedItem(new Attr('color', 'green'));
      expect(result).toBe(previous);
    });

    it('Element.setAttribute is observable through the NamedNodeMap', () => {
      const el = new Element('foo');
      el.setAttribute('a', '1');
      expect(el.attributes.getNamedItem('a')?.value).toBe('1');
    });
  });

  describe('removeNamedItem', () => {
    it('removes the named attribute and decreases length', () => {
      const el = new Element('foo', { a: '1', b: '2' });
      el.attributes.removeNamedItem('a');
      expect(el.attributes.length).toBe(1);
      expect(el.attributes.getNamedItem('a')).toBeNull();
      expect(el.attributes.getNamedItem('b')?.value).toBe('2');
    });

    it('returns the removed Attr (per DOM spec)', () => {
      const el = new Element('foo', { color: 'red' });
      const target = el.attributes.getNamedItem('color');
      const removed = el.attributes.removeNamedItem('color');
      expect(removed).toBe(target);
    });

    it('throws (or otherwise signals failure) when removing a name that does not exist', () => {
      const el = new Element('foo');
      // Per DOM spec a NotFoundError should be thrown; some implementations
      // return null instead. Accept either, but never silently mutate state.
      let threw = false;
      let returned: unknown = undefined;
      try {
        returned = el.attributes.removeNamedItem('missing');
      }
      catch {
        threw = true;
      }
      expect(threw || returned === null).toBe(true);
      expect(el.attributes.length).toBe(0);
    });

    it('Element.removeAttribute is observable through the NamedNodeMap', () => {
      const el = new Element('foo', { a: '1' });
      el.removeAttribute('a');
      expect(el.attributes.length).toBe(0);
      expect(el.attributes.getNamedItem('a')).toBeNull();
    });

    it('matches prefixed attributes by qualified name', () => {
      const el = new Element('foo', { 'a:c': '1', 'xml:space': 'preserve', 'xmlns:a': 'urn:a' });
      expect(el.attributes.removeNamedItem('a:c').fullName).toBe('a:c');
      expect(el.attributes.removeNamedItem('xml:space').fullName).toBe('xml:space');
      expect(el.attributes.removeNamedItem('xmlns:a').fullName).toBe('xmlns:a');
      expect(el.attributes.length).toBe(0);
    });

    it('does not match a prefixed attribute by its local name', () => {
      const el = new Element('foo', { 'p:q': '1', 'r:q': '2' });
      expect(() => el.attributes.removeNamedItem('q')).toThrow(NotFoundError);
      expect(el.attributes.length).toBe(2);
    });

    it('throws NotFoundError when the attribute is missing', () => {
      const el = new Element('foo');
      expect(() => el.attributes.removeNamedItem('missing')).toThrow(NotFoundError);
    });
  });

  describe('Element.removeAttribute', () => {
    it('removes prefixed attributes by qualified name', () => {
      const el = new Element('foo', { 'a:c': '1', 'xml:space': 'preserve', 'xmlns:a': 'urn:a', 'b': '2' });
      el.removeAttribute('a:c');
      el.removeAttribute('xml:space');
      el.removeAttribute('xmlns:a');
      expect([ ...el.attributes ].map(d => d.fullName)).toEqual([ 'b' ]);
    });

    it('removes only the attribute whose qualified name matches', () => {
      const el = new Element('foo', { 'p:q': '1', 'r:q': '2', 'q': '3' });
      el.removeAttribute('q');
      expect([ ...el.attributes ].map(d => d.fullName)).toEqual([ 'p:q', 'r:q' ]);
      el.removeAttribute('r:q');
      expect([ ...el.attributes ].map(d => d.fullName)).toEqual([ 'p:q' ]);
    });

    it('does nothing when the attribute is missing', () => {
      const el = new Element('foo', { 'p:q': '1' });
      expect(() => el.removeAttribute('missing')).not.toThrow();
      expect(() => el.removeAttribute('q')).not.toThrow();
      expect(el.attributes.length).toBe(1);
    });
  });

  describe('item() and indexed access', () => {
    it('item(i) returns the Attr at the given position', () => {
      const el = new Element('foo', { a: '1', b: '2', c: '3' });
      const first = el.attributes.item(0);
      const second = el.attributes.item(1);
      const third = el.attributes.item(2);
      expect(first?.name).toBe('a');
      expect(first?.value).toBe('1');
      expect(second?.name).toBe('b');
      expect(third?.name).toBe('c');
    });

    it('item(i) returns null for out-of-range indices', () => {
      const el = new Element('foo', { a: '1' });
      expect(el.attributes.item(1)).toBeNull();
      expect(el.attributes.item(99)).toBeNull();
      expect(el.attributes.item(-1)).toBeNull();
    });

    it('preserves insertion order across constructor + setAttribute', () => {
      const el = new Element('foo', { a: '1', b: '2' });
      el.setAttribute('c', '3');
      el.setAttribute('d', '4');
      const names: (string | undefined)[] = [];
      for (let i = 0; i < el.attributes.length; i++) {
        names.push(el.attributes.item(i)?.name);
      }
      expect(names).toEqual([ 'a', 'b', 'c', 'd' ]);
    });

    it('keeps an attribute in place when its value is overwritten', () => {
      const el = new Element('foo', { a: '1', b: '2', c: '3' });
      el.setAttribute('b', '20');
      const names: (string | undefined)[] = [];
      for (let i = 0; i < el.attributes.length; i++) {
        names.push(el.attributes.item(i)?.name);
      }
      expect(names).toEqual([ 'a', 'b', 'c' ]);
      expect(el.attributes.getNamedItem('b')?.value).toBe('20');
    });

    it('closes the gap when an attribute is removed (no holes)', () => {
      const el = new Element('foo', { a: '1', b: '2', c: '3' });
      el.removeAttribute('b');
      expect(el.attributes.length).toBe(2);
      expect(el.attributes.item(0)?.name).toBe('a');
      expect(el.attributes.item(1)?.name).toBe('c');
      expect(el.attributes.item(2)).toBeNull();
    });

    it('attributes[i] returns the same Attr as item(i)', () => {
      const el = new Element('foo', { a: '1', b: '2' });
      expect(el.attributes[0]).toBe(el.attributes.item(0));
      expect(el.attributes[1]).toBe(el.attributes.item(1));
      expect(el.attributes['1']).toBe(el.attributes.item(1));
    });

    it('in agrees with indexed access', () => {
      const el = new Element('foo', { a: '1' });
      expect(0 in el.attributes).toBe(true);
      expect(1 in el.attributes).toBe(false);
      expect(-1 in el.attributes).toBe(false);
      expect('0.5' in el.attributes).toBe(false);
      expect('a' in el.attributes).toBe(true);
      expect('b' in el.attributes).toBe(false);
    });
  });

  describe('own properties', () => {
    it('Object.keys lists the indices', () => {
      const el = new Element('foo', { 'a': '1', 'xmlns:a': 'urn:a' });
      expect(Object.keys(el.attributes)).toEqual([ '0', '1' ]);
    });

    it('Object.getOwnPropertyNames lists indices and qualified names', () => {
      const el = new Element('foo', { 'a': '1', 'xmlns:a': 'urn:a' });
      expect(Object.getOwnPropertyNames(el.attributes)).toEqual([ '0', '1', 'a', 'xmlns:a' ]);
    });

    it('names are own properties but not enumerable', () => {
      const el = new Element('foo', { a: '1' });
      expect(Object.hasOwn(el.attributes, 'a')).toBe(true);
      expect(Object.getOwnPropertyDescriptor(el.attributes, 'a')).toMatchObject({
        value: el.attributes.getNamedItem('a'),
        enumerable: false
      });
      expect(Object.getOwnPropertyDescriptor(el.attributes, 0)).toMatchObject({
        value: el.attributes.item(0),
        enumerable: true
      });
      expect(Object.getOwnPropertyDescriptor(el.attributes, 1)).toBeUndefined();
    });

    it('object spread copies the indexed attributes', () => {
      const el = new Element('foo', { a: '1', b: '2' });
      const copy = { ...el.attributes };
      expect(Object.keys(copy)).toEqual([ '0', '1' ]);
      expect(copy[0]).toBe(el.attributes.item(0));
      expect(copy[1]).toBe(el.attributes.item(1));
    });

    it('JSON.stringify includes the indexed attributes', () => {
      const el = new Element('foo', { a: '1', b: '2' });
      const json = JSON.parse(JSON.stringify(el.attributes)) as Record<string, { value: string }>;
      expect(Object.keys(json)).toEqual([ '0', '1' ]);
      expect(json[0].value).toBe('1');
      expect(json[1].value).toBe('2');
    });

    it('reflects later changes', () => {
      const el = new Element('foo', { a: '1' });
      el.setAttribute('b', '2');
      el.removeAttribute('a');
      expect(Object.getOwnPropertyNames(el.attributes)).toEqual([ '0', 'b' ]);
    });
  });

  describe('iteration', () => {
    it('is iterable with for...of, yielding Attr objects', () => {
      const el = new Element('foo', { a: '1', b: '2', c: '3' });
      const collected: [string, string][] = [];
      for (const attr of el.attributes) {
        collected.push([ attr.name, attr.value ]);
      }
      expect(collected).toEqual([ [ 'a', '1' ], [ 'b', '2' ], [ 'c', '3' ] ]);
    });

    it('supports the spread operator', () => {
      const el = new Element('foo', { a: '1', b: '2' });
      const spread = [ ...el.attributes ];
      expect(spread).toHaveLength(2);
      expect(spread[0].name).toBe('a');
      expect(spread[1].name).toBe('b');
    });

    it('Array.from converts the map into an array of Attrs', () => {
      const el = new Element('foo', { a: '1', b: '2' });
      const arr = Array.from(el.attributes);
      expect(arr).toHaveLength(2);
      expect(arr.map(a => a?.name)).toEqual([ 'a', 'b' ]);
    });
  });

  // These are checked by `tsc` when running `npm run typecheck`.
  describe('types', () => {
    it('types named and indexed access as possibly null', () => {
      const el = new Element('foo', { a: '1' });
      expectTypeOf(el.attributes.a).toEqualTypeOf<Attr | null>();
      expectTypeOf(el.attributes.Missing).toEqualTypeOf<Attr | null>();
      expectTypeOf(el.attributes[0]).toEqualTypeOf<Attr | null>();
      expect(el.attributes.Missing).toBeNull();
      // @ts-expect-error -- a missing attribute is null, so .value must not compile unchecked
      expect(() => el.attributes.Missing.value).toThrow(TypeError);
      expect(el.attributes.Missing?.value).toBeUndefined();
    });

    it('keeps the types of the map members', () => {
      const map: NamedNodeMap = new Element('foo', { a: '1' }).attributes;
      expectTypeOf(map.length).toEqualTypeOf<number>();
      expectTypeOf(map.item(5)).toEqualTypeOf<Attr | null>();
      expectTypeOf(map.getNamedItem('b')).toEqualTypeOf<Attr | null>();
      expectTypeOf(map.removeNamedItem('a')).toEqualTypeOf<Attr>();
    });
  });

  describe('Attr objects exposed by the map', () => {
    it('expose a name and value that match what was assigned', () => {
      const el = new Element('foo', { color: 'red' });
      const attr = el.attributes.getNamedItem('color');
      expect(attr?.name).toBe('color');
      expect(attr?.value).toBe('red');
    });

    it('use the qualified name for name and nodeName', () => {
      const el = new Element('foo', { 'a': '1', 'xmlns:a': 'urn:a', 'xml:space': 'preserve' });
      const [ plain, xmlns, space ] = [ ...el.attributes ];
      expect([ plain.name, plain.nodeName, plain.prefix, plain.localName ]).toEqual([ 'a', 'a', null, 'a' ]);
      expect([ xmlns.name, xmlns.nodeName, xmlns.prefix, xmlns.localName ]).toEqual([ 'xmlns:a', 'xmlns:a', 'xmlns', 'a' ]);
      expect([ space.name, space.nodeName, space.prefix, space.localName ]).toEqual([ 'xml:space', 'xml:space', 'xml', 'space' ]);
    });

    it('reflect later updates to the same attribute name', () => {
      const el = new Element('foo', { color: 'red' });
      const first = el.attributes.getNamedItem('color');
      el.setAttribute('color', 'blue');
      const second = el.attributes.getNamedItem('color');
      // After a replacement, the value reported should be 'blue' whether or
      // not the same Attr instance is reused.
      expect(second?.value).toBe('blue');
      expect(first === second ? first?.value : 'blue').toBe('blue');
    });
  });

  describe('live behavior', () => {
    it('changes made through Element are immediately visible on the map', () => {
      const el = new Element('foo');
      const map = el.attributes;
      expect(map.length).toBe(0);
      el.setAttribute('a', '1');
      expect(map.length).toBe(1);
      expect(map.getNamedItem('a')?.value).toBe('1');
      el.removeAttribute('a');
      expect(map.length).toBe(0);
      expect(map.getNamedItem('a')).toBeNull();
    });

    it('changes made through the map are visible on Element accessors', () => {
      const el = new Element('foo');
      el.attributes.setNamedItem(new Attr('a', '1'));
      expect(el.getAttribute('a')).toBe('1');
      expect(el.hasAttribute('a')).toBe(true);
      el.attributes.removeNamedItem('a');
      expect(el.getAttribute('a')).toBeNull();
      expect(el.hasAttribute('a')).toBe(false);
    });
  });
});
