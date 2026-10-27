import { describe, it, expect } from 'vitest';
import { Document, Element, HierarchyError, TextNode, parseXML } from './index.ts';

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
