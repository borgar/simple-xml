import { describe, it, expect } from 'vitest';
import { Attr, CDataNode, Document, DocumentFragment, Element, TextNode, parseXML } from './index.ts';
import type { Node } from './index.ts';

const doc = (src: string) => parseXML(src);
const el = (src: string) => parseXML(src).root!;

// test both directions, as the result must not depend on the order
function expectEqual (a: Node | DocumentFragment, b: Node | DocumentFragment, equal: boolean) {
  expect(a.isEqualNode(b)).toBe(equal);
  expect(b.isEqualNode(a)).toBe(equal);
}

describe('isEqualNode', () => {
  it('is true for the same node, and false for null', () => {
    const a = el('<a/>');
    expect(a.isEqualNode(a)).toBe(true);
    expect(a.isEqualNode(null)).toBe(false);
  });

  it('compares parsed documents', () => {
    const src = '<r xmlns:p="urn:p" a="1"><p:c x="2">text</p:c><![CDATA[data]]><d/></r>';
    expectEqual(doc(src), doc(src), true);
    expectEqual(doc('<r/>'), doc('<s/>'), false);
    expectEqual(doc('<r/>'), new Document(), false);
    expectEqual(new Document(), new Document(), true);
  });

  it('ignores attribute order', () => {
    expectEqual(el('<a x="1" y="2"/>'), el('<a y="2" x="1"/>'), true);
  });

  it('compares attribute names and values', () => {
    expectEqual(el('<a x="1"/>'), el('<a x="2"/>'), false);
    expectEqual(el('<a x="1"/>'), el('<a y="1"/>'), false);
    expectEqual(el('<a x="1"/>'), el('<a x="1" y="2"/>'), false);
    expectEqual(el('<a x="1"/>'), el('<a/>'), false);
  });

  it('compares element names', () => {
    expectEqual(el('<a/>'), el('<b/>'), false);
    expectEqual(el('<r xmlns:p="u" xmlns:q="u"><p:a/></r>'), el('<r xmlns:p="u" xmlns:q="u"><q:a/></r>'), false);
  });

  it('compares children in order', () => {
    expectEqual(el('<a><b/><c/></a>'), el('<a><c/><b/></a>'), false);
    expectEqual(el('<a><b/></a>'), el('<a><b/><b/></a>'), false);
    expectEqual(el('<a><b>x</b></a>'), el('<a><b>y</b></a>'), false);
  });

  it('treats self-closing and empty elements as equal', () => {
    expectEqual(el('<a><b/></a>'), el('<a><b></b></a>'), true);
  });

  it('compares text exactly, and keeps text and CDATA apart', () => {
    expectEqual(new TextNode('x'), new TextNode('x'), true);
    expectEqual(new TextNode('x'), new TextNode('y'), false);
    expectEqual(el('<a>x</a>'), el('<a> x </a>'), false);
    expectEqual(new TextNode('x'), new CDataNode('x'), false);
    expectEqual(new CDataNode('x'), new CDataNode('x'), true);
  });

  it('ignores the parents of the nodes being compared', () => {
    const a = el('<p><c x="1">t</c></p>').childNodes[0];
    const b = el('<q><c x="1">t</c></q>').childNodes[0];
    expectEqual(a, b, true);
  });

  it('compares namespaces, which depend on where the elements are', () => {
    const one = el('<r xmlns:p="urn:one"><p:a/></r>').childNodes[0];
    const two = el('<r xmlns:p="urn:two"><p:a/></r>').childNodes[0];
    const same = el('<s xmlns:p="urn:one"><p:a/></s>').childNodes[0];
    expectEqual(one, two, false);
    expectEqual(one, same, true);
    expectEqual(el('<a xmlns="urn:x"/>'), el('<a xmlns="urn:y"/>'), false);
  });

  it('compares attributes by namespace, local name, and value, ignoring the owner', () => {
    const x1 = el('<a xmlns:p="u" p:x="1"/>').attributes.getNamedItem('p:x')!;
    const x2 = el('<b xmlns:p="u" p:x="1"/>').attributes.getNamedItem('p:x')!;
    expectEqual(x1, x2, true);
    expectEqual(new Attr('x', '1'), new Attr('x', '1'), true);
    expectEqual(new Attr('x', '1'), new Attr('x', '2'), false);
    expectEqual(new Attr('x', '1'), new Attr('y', '1'), false);
  });

  it('compares nodes of different types as not equal', () => {
    expectEqual(new Element('a'), new TextNode('a'), false);
    expectEqual(new Element('a'), new Attr('a', ''), false);
    expectEqual(doc('<a/>'), el('<a/>'), false);
  });

  it('compares document fragments by their children', () => {
    const f1 = new DocumentFragment();
    f1.appendChild(new Element('a'));
    f1.appendChild(new TextNode('x'));
    const f2 = new DocumentFragment();
    f2.appendChild(new Element('a'));
    f2.appendChild(new TextNode('x'));
    expectEqual(f1, f2, true);
    f2.appendChild(new Element('b'));
    expectEqual(f1, f2, false);
    expectEqual(f1, new Element('a'), false);
  });
});
