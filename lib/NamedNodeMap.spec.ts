import { describe, it, expect } from 'vitest';
import { Element } from '../lib/index.ts';
import { Attr } from '../lib/Attr.ts';

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
      const names: string[] = [];
      for (let i = 0; i < el.attributes.length; i++) {
        names.push(el.attributes.item(i).name);
      }
      expect(names).toEqual([ 'a', 'b', 'c', 'd' ]);
    });

    it('keeps an attribute in place when its value is overwritten', () => {
      const el = new Element('foo', { a: '1', b: '2', c: '3' });
      el.setAttribute('b', '20');
      const names: string[] = [];
      for (let i = 0; i < el.attributes.length; i++) {
        names.push(el.attributes.item(i).name);
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
      expect(arr.map(a => a.name)).toEqual([ 'a', 'b' ]);
    });
  });

  describe('Attr objects exposed by the map', () => {
    it('expose a name and value that match what was assigned', () => {
      const el = new Element('foo', { color: 'red' });
      const attr = el.attributes.getNamedItem('color');
      expect(attr?.name).toBe('color');
      expect(attr?.value).toBe('red');
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
