import { describe, it, expect } from 'vitest';
import { NSMap } from './NSMap.ts';

describe('NSMap', () => {
  describe('initial state', () => {
    it('has no entries by default', () => {
      const map = new NSMap();
      expect(map.list()).toEqual([]);
    });

    it('get returns undefined for unknown URI', () => {
      const map = new NSMap();
      expect(map.get('http://example.com/ns')).toBeUndefined();
    });

    it('getByPrefix returns undefined for unknown prefix', () => {
      const map = new NSMap();
      expect(map.getByPrefix('ex')).toBeUndefined();
    });
  });

  describe('add', () => {
    it('registers a URI/prefix pair', () => {
      const map = new NSMap();
      map.add('http://example.com/ns', 'ex');
      expect(map.get('http://example.com/ns')).toBe('ex');
      expect(map.getByPrefix('ex')).toBe('http://example.com/ns');
    });

    it('registers a pair with an empty prefix', () => {
      const map = new NSMap();
      map.add('http://example.com/default', '');
      expect(map.get('http://example.com/default')).toBe('');
      expect(map.getByPrefix('')).toBe('http://example.com/default');
    });

    it('re-adding the same URI/prefix pair is idempotent', () => {
      const map = new NSMap();
      map.add('http://example.com/ns', 'ex');
      expect(() => map.add('http://example.com/ns', 'ex')).not.toThrow();
      expect(map.list()).toHaveLength(1);
    });

    it('supports multiple prefixes for the same URI', () => {
      const map = new NSMap();
      map.add('http://example.com/ns', 'ex');
      map.add('http://example.com/ns', 'alt');
      expect(map.getByPrefix('ex')).toBe('http://example.com/ns');
      expect(map.getByPrefix('alt')).toBe('http://example.com/ns');
    });

    it('get returns a non-empty prefix when a URI has multiple', () => {
      const map = new NSMap();
      map.add('http://example.com/ns', 'first');
      map.add('http://example.com/ns', 'second');
      expect(map.get('http://example.com/ns')).toBe('first');
    });

    it('get prefers a named prefix over an empty one', () => {
      const map = new NSMap();
      map.add('http://example.com/ns', '');
      map.add('http://example.com/ns', 'wx');
      expect(map.get('http://example.com/ns')).toBe('wx');
    });

    it('get returns empty prefix when it is the only one', () => {
      const map = new NSMap();
      map.add('http://example.com/ns', '');
      expect(map.get('http://example.com/ns')).toBe('');
    });

    it('supports multiple distinct URI/prefix pairs', () => {
      const map = new NSMap();
      map.add('http://example.com/a', 'a');
      map.add('http://example.com/b', 'b');
      map.add('http://example.com/c', 'c');
      expect(map.get('http://example.com/a')).toBe('a');
      expect(map.get('http://example.com/b')).toBe('b');
      expect(map.get('http://example.com/c')).toBe('c');
      expect(map.getByPrefix('a')).toBe('http://example.com/a');
      expect(map.getByPrefix('b')).toBe('http://example.com/b');
      expect(map.getByPrefix('c')).toBe('http://example.com/c');
    });

    it('throws when adding a prefix that already has a different URI', () => {
      const map = new NSMap();
      map.add('http://example.com/first', 'ex');
      expect(() => map.add('http://example.com/second', 'ex')).toThrow(
        'ex already has a different URI'
      );
    });
  });

  describe('get', () => {
    it('returns the prefix for a registered URI', () => {
      const map = new NSMap();
      map.add('urn:foo', 'foo');
      expect(map.get('urn:foo')).toBe('foo');
    });

    it('returns undefined for an unregistered URI', () => {
      const map = new NSMap();
      map.add('urn:foo', 'foo');
      expect(map.get('urn:bar')).toBeUndefined();
    });
  });

  describe('getByPrefix', () => {
    it('returns the URI for a registered prefix', () => {
      const map = new NSMap();
      map.add('urn:foo', 'foo');
      expect(map.getByPrefix('foo')).toBe('urn:foo');
    });

    it('returns undefined for an unregistered prefix', () => {
      const map = new NSMap();
      map.add('urn:foo', 'foo');
      expect(map.getByPrefix('bar')).toBeUndefined();
    });
  });

  describe('list', () => {
    it('returns an empty array when no entries exist', () => {
      const map = new NSMap();
      expect(map.list()).toEqual([]);
    });

    it('returns [uri, prefix] tuples for all entries', () => {
      const map = new NSMap();
      map.add('http://a.com', 'a');
      map.add('http://b.com', 'b');
      const entries = map.list();
      expect(entries).toHaveLength(2);
      expect(entries).toContainEqual([ 'http://a.com', 'a' ]);
      expect(entries).toContainEqual([ 'http://b.com', 'b' ]);
    });

    it('returns one entry per prefix when a URI has multiple prefixes', () => {
      const map = new NSMap();
      map.add('http://a.com', 'a1');
      map.add('http://a.com', 'a2');
      map.add('http://b.com', 'b');
      const entries = map.list();
      expect(entries).toHaveLength(3);
      expect(entries).toContainEqual([ 'http://a.com', 'a1' ]);
      expect(entries).toContainEqual([ 'http://a.com', 'a2' ]);
      expect(entries).toContainEqual([ 'http://b.com', 'b' ]);
    });

    it('returns a new array each time (not a reference to internal state)', () => {
      const map = new NSMap();
      map.add('http://a.com', 'a');
      const list1 = map.list();
      const list2 = map.list();
      expect(list1).toEqual(list2);
      expect(list1).not.toBe(list2);
    });
  });

  describe('bi-directional consistency', () => {
    it('every listed URI resolves to its prefix and vice-versa', () => {
      const map = new NSMap();
      const pairs: [string, string][] = [
        [ 'http://www.w3.org/2000/svg', 'svg' ],
        [ 'http://www.w3.org/1999/xlink', 'xlink' ],
        [ 'http://www.w3.org/XML/1998/namespace', 'xml' ]
      ];
      for (const [ uri, prefix ] of pairs) {
        map.add(uri, prefix);
      }
      for (const [ uri, prefix ] of map.list()) {
        expect(map.getByPrefix(prefix)).toBe(uri);
      }
    });
  });
});
