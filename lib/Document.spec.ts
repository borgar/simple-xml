import { describe, it, expect } from 'vitest';
import { Document, DocumentFragment, Element, HierarchyError, TextNode, parseXML } from './index.ts';
import type { XMLAttr } from './index.ts';

const A = 'urn:a';
const B = 'urn:b';

describe('Document.root', () => {
  it('is null for a new document', () => {
    const doc = new Document();
    expect(doc.root).toBeNull();
    expect(doc.childNodes).toEqual([]);
  });

  it('adds the namespace declarations when assigned', () => {
    const doc = new Document();
    doc.attachNS(A);
    doc.attachNS(B, 'b');
    const el = new Element('r');
    doc.root = el;
    expect(el.getAttribute('xmlns')).toBe(A);
    expect(el.getAttribute('xmlns:b')).toBe(B);
    expect(doc.print()).toContain('<r xmlns="urn:a" xmlns:b="urn:b" />');
  });

  it('declares namespaces attached after the root was assigned', () => {
    const doc = new Document();
    doc.root = new Element('r');
    doc.attachNS(B, 'b');
    expect(doc.root.getAttribute('xmlns:b')).toBe(B);
  });

  it('attaches the element to the document when assigned', () => {
    const doc = new Document();
    const el = new Element('r');
    doc.root = el;
    expect(doc.root).toBe(el);
    expect(doc.childNodes).toEqual([ el ]);
    expect(el.parentNode).toBe(doc);
  });

  it('detaches the element from its previous parent', () => {
    const parent = new Element('p');
    const el = new Element('r');
    parent.appendChild(el);
    const doc = new Document();
    doc.root = el;
    expect(parent.childNodes).toEqual([]);
    expect(el.parentNode).toBe(doc);
  });

  it('replaces an existing root', () => {
    const doc = new Document();
    doc.attachNS(A, 'a');
    const first = new Element('first');
    const second = new Element('second');
    doc.root = first;
    doc.root = second;
    expect(doc.root).toBe(second);
    expect(doc.childNodes).toEqual([ second ]);
    expect(first.parentNode).toBeNull();
    expect(second.getAttribute('xmlns:a')).toBe(A);
  });

  it('does nothing when the current root is assigned again', () => {
    const doc = new Document();
    const el = new Element('r');
    doc.root = el;
    doc.root = el;
    expect(doc.childNodes).toEqual([ el ]);
    expect(el.parentNode).toBe(doc);
  });

  it('removes the root when assigned null', () => {
    const doc = new Document();
    const el = new Element('r');
    doc.root = el;
    doc.root = null;
    expect(doc.root).toBeNull();
    expect(doc.childNodes).toEqual([]);
    expect(el.parentNode).toBeNull();
  });

  it('rejects nodes that are not elements', () => {
    const doc = new Document();
    expect(() => {
      doc.root = new TextNode('x') as unknown as Element;
    }).toThrow(HierarchyError);
    expect(doc.root).toBeNull();
  });

  it('is cleared by removeChild', () => {
    const doc = parseXML('<r/>');
    const el = doc.root;
    expect(el).not.toBeNull();
    doc.removeChild(el!);
    expect(doc.root).toBeNull();
    const next = new Element('next');
    doc.appendChild(next);
    expect(doc.root).toBe(next);
  });

  it('cannot get a second child through insertBefore', () => {
    const doc = new Document();
    const el = new Element('r');
    doc.root = el;
    expect(() => doc.insertBefore(new Element('other'), el)).toThrow(HierarchyError);
    expect(() => doc.insertBefore(new TextNode('x'), el)).toThrow(HierarchyError);
    expect(doc.childNodes).toEqual([ el ]);
  });

  it('accepts a root through insertBefore when it has none', () => {
    const doc = new Document();
    doc.attachNS(A, 'a');
    const el = new Element('r');
    doc.insertBefore(el, null);
    expect(doc.root).toBe(el);
    expect(el.getAttribute('xmlns:a')).toBe(A);
  });

  it('is set by appendChild and by the parser', () => {
    const doc = new Document();
    const el = new Element('r');
    doc.appendChild(el);
    expect(doc.root).toBe(el);
    expect(parseXML('<r><c/></r>').root?.tagName).toBe('r');
  });
});

describe('create functions', () => {
  const attrNames = (el: Element) => [ ...el.attributes ].map(d => d.fullName);

  it('accept a single argument', () => {
    const doc = new Document();
    const create = doc.attachNS(A, 'p');
    expect(attrNames(doc.createElement('br'))).toEqual([]);
    expect(doc.createElementNS(A, 'r').fullName).toBe('p:r');
    expect(create('r').fullName).toBe('p:r');
    expect(new Element('r').createChild('c').tagName).toBe('c');
  });

  it('accept null, undefined, and empty objects as attributes', () => {
    const doc = new Document();
    for (const attr of [ null, undefined, {}, Object.create(null) as XMLAttr ]) {
      expect(attrNames(doc.createElement('r', attr))).toEqual([]);
      expect(attrNames(new Element('p').createChild('c', attr))).toEqual([]);
      expect(attrNames(new Element('r', attr))).toEqual([]);
    }
  });

  it('skip null children by position', () => {
    const el = new Document().createElement('r', null, null, 'x', null);
    expect(attrNames(el)).toEqual([]);
    expect(el.childNodes).toHaveLength(1);
    expect(el.textContent).toBe('x');
  });

  it('accept attributes named childNodes and nodeType', () => {
    const el = new Document().createElement('r', { childNodes: 'x', nodeType: '1' });
    expect(el.getAttribute('childNodes')).toBe('x');
    expect(el.getAttribute('nodeType')).toBe('1');
  });

  describe('reject a child passed as attributes', () => {
    const badAttrs: [string, () => unknown][] = [
      [ 'a string', () => 'text' ],
      [ 'a number', () => 1 ],
      [ 'a boolean', () => true ],
      [ 'an array', () => [ new TextNode('x') ] ],
      [ 'a text node', () => new TextNode('x') ],
      [ 'an element', () => new Element('x') ],
      [ 'a fragment', () => new DocumentFragment() ],
      [ 'a node from another copy of the library', () => ({ nodeType: 1, childNodes: [] }) ]
    ];
    const creators: [string, (attr: unknown) => unknown][] = [
      [ 'createElement', attr => new Document().createElement('r', attr as XMLAttr) ],
      [ 'createElementNS', attr => {
        const doc = new Document();
        doc.attachNS(A, 'p');
        return doc.createElementNS(A, 'r', attr as XMLAttr);
      } ],
      [ 'the attachNS function', attr => new Document().attachNS(A, 'p')('r', attr as XMLAttr) ],
      [ 'createChild', attr => new Element('p').createChild('r', attr as XMLAttr) ],
      [ 'the Element constructor', attr => new Element('r', attr as XMLAttr) ],
      [ 'setAttrValues', attr => new Element('r').setAttrValues(attr as XMLAttr) ]
    ];
    for (const [ creatorName, create ] of creators) {
      for (const [ badName, bad ] of badAttrs) {
        it(`${creatorName} throws TypeError for ${badName}`, () => {
          expect(() => create(bad())).toThrow(TypeError);
        });
      }
    }

    it('throws before createChild appends the new element', () => {
      const parent = new Element('p');
      expect(() => parent.createChild('r', 'text' as unknown as XMLAttr)).toThrow(TypeError);
      expect(parent.childNodes).toEqual([]);
    });

    // These are checked by `tsc` when running `npm run typecheck`.
    it('are also rejected by the types', () => {
      const doc = new Document();
      // @ts-expect-error -- a string is a child, not attributes
      expect(() => doc.createElement('r', 'text')).toThrow(TypeError);
      // @ts-expect-error -- a number is a child, not attributes
      expect(() => doc.createElement('r', 1)).toThrow(TypeError);
      // @ts-expect-error -- a boolean is a child, not attributes
      expect(() => doc.createElement('r', true)).toThrow(TypeError);
      // @ts-expect-error -- an array holds children, not attributes
      expect(() => doc.createElement('r', [ new TextNode('x') ])).toThrow(TypeError);
      // @ts-expect-error -- a node is a child, not attributes
      expect(() => doc.createElement('r', new TextNode('x'))).toThrow(TypeError);
      // @ts-expect-error -- an element is a child, not attributes
      expect(() => doc.createElement('r', new Element('x'))).toThrow(TypeError);
      // @ts-expect-error -- a fragment holds children, not attributes
      expect(() => doc.createElement('r', new DocumentFragment())).toThrow(TypeError);
    });
  });
});
