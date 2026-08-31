import { describe, it, expect } from 'vitest';
import { Node } from './Node.ts';
import { Element } from './Element.ts';
import { TextNode } from './TextNode.ts';
import { CDataNode } from './CDataNode.ts';
import { DocumentFragment } from './DocumentFragment.ts';

describe('Node', () => {
  describe('constructor / default properties', () => {
    it('has expected default property values', () => {
      const node = new Node();
      expect(node.childNodes).toEqual([]);
      expect(node.nodeName).toBe('#node');
      expect(node.nodeType).toBe(0);
      expect(node.parentNode).toBeNull();
    });
  });

  describe('appendChild', () => {
    it('appends a child node and sets parentNode', () => {
      const parent = new Node();
      const child = new Node();
      parent.appendChild(child);
      expect(parent.childNodes).toContain(child);
      expect(child.parentNode).toBe(parent);
    });

    it('returns the appended node', () => {
      const parent = new Node();
      const child = new Node();
      const result = parent.appendChild(child);
      expect(result).toBe(child);
    });

    it('throws when called with no argument, null or undefined', () => {
      const parent = new Node();
      // @ts-expect-error - testing runtime error
      expect(() => parent.appendChild()).toThrow('1 argument required');
      // @ts-expect-error - testing runtime error
      expect(() => parent.appendChild(null)).toThrow();
      // @ts-expect-error - testing runtime error
      expect(() => parent.appendChild(undefined)).toThrow();
    });

    it('throws when called with a non-node value', () => {
      const parent = new Node();
      // @ts-expect-error - testing runtime error
      expect(() => parent.appendChild('hello')).toThrow('Cannot appendChild');
      // @ts-expect-error - testing runtime error
      expect(() => parent.appendChild(42)).toThrow('Cannot appendChild');
      // @ts-expect-error - testing runtime error
      expect(() => parent.appendChild({})).toThrow('Cannot appendChild');
    });

    it('moves a child from one parent to another', () => {
      const parent1 = new Node();
      const parent2 = new Node();
      const child = new Node();
      parent1.appendChild(child);
      expect(parent1.childNodes).toContain(child);
      expect(child.parentNode).toBe(parent1);
      parent2.appendChild(child);
      expect(parent1.childNodes).not.toContain(child);
      expect(parent2.childNodes).toContain(child);
      expect(child.parentNode).toBe(parent2);
    });

    it('appends multiple children in order', () => {
      const parent = new Node();
      const a = parent.appendChild(new Node());
      const b = parent.appendChild(new Node());
      const c = parent.appendChild(new Node());
      expect(parent.childNodes).toEqual([ a, b, c ]);
    });

    it('appends DocumentFragment children in order', () => {
      const frag = new DocumentFragment();
      const a = frag.appendChild(new Node());
      const b = frag.appendChild(new Node());
      const c = frag.appendChild(new Node());
      expect(frag.childNodes).toEqual([ a, b, c ]);

      const parent = new Node();
      parent.appendChild(frag);
      expect(parent.childNodes).toEqual([ a, b, c ]);
    });

    it('re-appending an existing child moves it to the end', () => {
      const parent = new Node();
      const a = new Node();
      const b = new Node();
      parent.appendChild(a);
      parent.appendChild(b);
      expect(parent.childNodes).toEqual([ a, b ]);

      parent.appendChild(a);
      expect(parent.childNodes).toEqual([ b, a ]);
    });
  });

  describe('insertBefore', () => {
    it('inserts a node before a reference node', () => {
      const parent = new Node();
      const a = new Node();
      const b = new Node();
      const c = new Node();
      parent.appendChild(a);
      parent.appendChild(c);

      parent.insertBefore(b, c);
      expect(b.parentNode).toBe(parent);
      expect(parent.childNodes.filter(d => d === b).length).toBe(1);
    });

    it('inserts DocumentFragment children in order', () => {
      const frag = new DocumentFragment();
      const a = frag.appendChild(new Node());
      const b = frag.appendChild(new Node());
      const c = frag.appendChild(new Node());
      expect(frag.childNodes).toEqual([ a, b, c ]);

      const parent = new Node();
      const z = new Node();
      parent.appendChild(z); // parent now only contains z

      parent.insertBefore(frag, z);
      expect(parent.childNodes).toEqual([ a, b, c, z ]);
    });

    it('falls back to appendChild when referenceNode is null', () => {
      const parent = new Node();
      const child = new Node();
      parent.insertBefore(child, null);
      expect(parent.childNodes).toContain(child);
      expect(child.parentNode).toBe(parent);
    });

    it('moves node from previous parent when inserting', () => {
      const oldParent = new Node();
      const newParent = new Node();
      const ref = new Node();
      const child = new Node();

      oldParent.appendChild(child);
      newParent.appendChild(ref);

      newParent.insertBefore(child, ref);
      expect(oldParent.childNodes).not.toContain(child);
      expect(child.parentNode).toBe(newParent);
    });
  });

  describe('removeChild', () => {
    it('removes a child and returns it', () => {
      const parent = new Node();
      const child = new Node();
      parent.appendChild(child);
      const removed = parent.removeChild(child);
      expect(removed).toBe(child);
      expect(parent.childNodes).not.toContain(child);
      expect(child.parentNode).toBeNull();
    });

    it('throws when no argument is provided', () => {
      const parent = new Node();
      // @ts-expect-error - testing runtime error
      expect(() => parent.removeChild()).toThrow('not of type');
      // @ts-expect-error - testing runtime error
      expect(() => parent.removeChild(null)).toThrow('not of type');
      // @ts-expect-error - testing runtime error
      expect(() => parent.removeChild(undefined)).toThrow('not of type');
    });

    it('throws when the node is not a child', () => {
      const parent = new Node();
      const orphan = new Node();
      expect(() => parent.removeChild(orphan)).toThrow(
        'The node to be removed is not a child of this node.'
      );
    });

    it('removes the correct child when there are multiple', () => {
      const parent = new Node();
      const a = new Node();
      const b = new Node();
      const c = new Node();
      parent.appendChild(a);
      parent.appendChild(b);
      parent.appendChild(c);

      parent.removeChild(b);
      expect(parent.childNodes).toEqual([ a, c ]);
      expect(b.parentNode).toBeNull();
    });

    it('allows removing and re-adding a child', () => {
      const parent = new Node();
      const child = new Node();
      parent.appendChild(child);
      parent.removeChild(child);
      expect(parent.childNodes.length).toBe(0);
      expect(child.parentNode).toBeNull();

      parent.appendChild(child);
      expect(parent.childNodes).toEqual([ child ]);
      expect(child.parentNode).toBe(parent);
    });
  });

  describe('preserveSpace', () => {
    it('returns false by default on a root node', () => {
      const node = new Node();
      expect(node.preserveSpace).toBe(false);
    });

    it('inherits preserveSpace from parent', () => {
      // Use an Element with xml:space="preserve" as parent
      const parent = new Element('root', { 'xml:space': 'preserve' });
      const child = new Node();
      parent.appendChild(child);
      expect(child.preserveSpace).toBe(true);
    });

    it('returns false when parent does not preserve space', () => {
      const parent = new Node();
      const child = new Node();
      parent.appendChild(child);
      expect(child.preserveSpace).toBe(false);
    });

    it('propagates through multiple levels of ancestry', () => {
      const grandparent = new Element('root', { 'xml:space': 'preserve' });
      const parent = new Node();
      const child = new Node();
      grandparent.appendChild(parent);
      parent.appendChild(child);
      expect(child.preserveSpace).toBe(true);
    });
  });

  describe('textContent', () => {
    it('returns empty string for a node with no children', () => {
      const node = new Node();
      expect(node.textContent).toBe('');
    });

    it('returns text from TextNode children', () => {
      const parent = new Node();
      const text = new TextNode('hello world');
      parent.appendChild(text);
      expect(parent.textContent).toBe('hello world');
    });

    it('concatenates text from multiple TextNode children', () => {
      // A whitespace-only TextNode returns '' when preserveSpace is false,
      // so 'foo' + '' + 'bar' = 'foobar'
      const parent = new Node();
      parent.appendChild(new TextNode('foo'));
      parent.appendChild(new TextNode(' '));
      parent.appendChild(new TextNode('bar'));
      expect(parent.textContent).toBe('foobar');
    });

    it('concatenates text including spaces when preserveSpace is true', () => {
      const parent = new Element('div', { 'xml:space': 'preserve' });
      parent.appendChild(new TextNode('foo'));
      parent.appendChild(new TextNode(' '));
      parent.appendChild(new TextNode('bar'));
      expect(parent.textContent).toBe('foo bar');
    });

    it('collects text content from nested children recursively', () => {
      const root = new Element('root');
      const child = new Element('child');
      const text = new TextNode('deep');
      root.appendChild(child);
      child.appendChild(text);
      expect(root.textContent).toBe('deep');
    });

    it('includes CDataNode values', () => {
      const parent = new Node();
      parent.appendChild(new TextNode('before'));
      parent.appendChild(new CDataNode(' cdata '));
      parent.appendChild(new TextNode('after'));
      expect(parent.textContent).toBe('before cdata after');
    });

    it('returns empty string for whitespace-only TextNode children (no preserveSpace)', () => {
      const parent = new Element('div');
      parent.appendChild(new TextNode('   '));
      // TextNode with only whitespace returns '' when preserveSpace is false
      expect(parent.textContent).toBe('');
    });

    it('preserves whitespace-only TextNode when preserveSpace is true', () => {
      const parent = new Element('div', { 'xml:space': 'preserve' });
      parent.appendChild(new TextNode('   '));
      expect(parent.textContent).toBe('   ');
    });
  });

  describe('toString', () => {
    it('returns a string', () => {
      const node = new Node();
      expect(typeof node.toString()).toBe('string');
    });

    it('renders child elements to XML', () => {
      const root = new Element('root');
      const child = new Element('child');
      root.appendChild(child);
      const str = root.toString();
      expect(str).toContain('<root>');
      expect(str).toContain('<child');
      expect(str).toContain('</root>');
    });
  });
});
