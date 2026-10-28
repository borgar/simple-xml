import { describe, it, expect } from 'vitest';
import { Attr, CDataNode, Document, Element, NamespaceError, TextNode, parseXML } from '../lib/index.ts';

const ooxml = `
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>

<styleSheet
  mc:Ignorable="x14ac"
  xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"
  xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"
  xmlns:x14ac="http://schemas.microsoft.com/office/spreadsheetml/2009/9/ac"
>
  <font x14ac:knownFont="1">
    <name val="Aptos Narrow"/>
  </font>

  <extLst>
    <ext xmlns:x14="http://schemas.microsoft.com/office/spreadsheetml/2009/9/main">
      <x14:slicerStyles defaultSlicerStyle="SlicerStyleLight1"/>
    </ext>
    <ext xmlns:x15="http://schemas.microsoft.com/office/spreadsheetml/2010/11/main">
      <x15:timelineStyles defaultTimelineStyle="TimeSlicerStyleLight1"/>
    </ext>
  </extLst>
</styleSheet>
`;

const NS_MAIN = 'http://schemas.openxmlformats.org/spreadsheetml/2006/main';
const NS_MC = 'http://schemas.openxmlformats.org/markup-compatibility/2006';
const NS_X14 = 'http://schemas.microsoft.com/office/spreadsheetml/2009/9/main';
const NS_X15 = 'http://schemas.microsoft.com/office/spreadsheetml/2010/11/main';
const XML_NS = 'http://www.w3.org/XML/1998/namespace';
const XMLNS_NS = 'http://www.w3.org/2000/xmlns/';

const root = (src: string, options?: { ns?: boolean }) => {
  const r = parseXML(src, options).root;
  if (!r) {
    throw new Error('missing root');
  }
  return r;
};
const find = (r: Element, selector: string) => {
  const el = r.querySelector(selector);
  if (!el) {
    throw new Error('missing ' + selector);
  }
  return el;
};

describe('Element namespace lookup', () => {
  it('resolves the default namespace and prefixes from ancestors', () => {
    const r = root(ooxml);
    const font = find(r, 'font');
    expect(r.lookupNamespaceURI(null)).toBe(NS_MAIN);
    expect(font.lookupNamespaceURI(null)).toBe(NS_MAIN);
    expect(font.lookupNamespaceURI('')).toBe(NS_MAIN);
    expect(font.lookupNamespaceURI('mc')).toBe(NS_MC);
    expect(font.lookupNamespaceURI('x14')).toBeNull();
    expect(r.children[1].children[0].lookupNamespaceURI('x14')).toBe(NS_X14);
  });

  it('knows the xml and xmlns prefixes without declarations', () => {
    const el = new Element('r');
    expect(el.lookupNamespaceURI('xml')).toBe(XML_NS);
    expect(el.lookupNamespaceURI('xmlns')).toBe(XMLNS_NS);
    expect(el.lookupPrefix(XML_NS)).toBe('xml');
    expect(el.lookupPrefix(XMLNS_NS)).toBe('xmlns');
  });

  it('uses the nearest declaration', () => {
    const r = root('<r xmlns="urn:a" xmlns:p="urn:p1"><c xmlns="urn:b" xmlns:p="urn:p2"><d/></c></r>');
    const d = find(r, 'd');
    expect(d.lookupNamespaceURI(null)).toBe('urn:b');
    expect(d.lookupNamespaceURI('p')).toBe('urn:p2');
    expect(r.lookupNamespaceURI('p')).toBe('urn:p1');
  });

  it('treats xmlns="" as removing the default namespace', () => {
    const r = root('<r xmlns="urn:a"><c xmlns=""><d/></c></r>');
    expect(find(r, 'd').lookupNamespaceURI(null)).toBeNull();
    expect(find(r, 'd').namespaceURI).toBeNull();
  });

  it('finds the prefix for a URI, skipping prefixes that are redeclared nearer', () => {
    const r = root('<r xmlns:p="urn:one" xmlns:q="urn:two"><c xmlns:p="urn:other"><d/></c></r>');
    const d = find(r, 'd');
    expect(d.lookupPrefix('urn:two')).toBe('q');
    expect(d.lookupPrefix('urn:other')).toBe('p');
    expect(d.lookupPrefix('urn:one')).toBeNull();
    expect(r.lookupPrefix('urn:one')).toBe('p');
    expect(d.lookupPrefix('urn:none')).toBeNull();
    expect(d.lookupPrefix('')).toBeNull();
    expect(d.lookupPrefix(null)).toBeNull();
  });

  it('does not return a prefix for the default namespace', () => {
    const r = root('<r xmlns="urn:a"/>');
    expect(r.lookupPrefix('urn:a')).toBeNull();
    expect(r.isDefaultNamespace('urn:a')).toBe(true);
    expect(r.isDefaultNamespace('urn:b')).toBe(false);
    expect(new Element('x').isDefaultNamespace(null)).toBe(true);
    expect(new Element('x').isDefaultNamespace('')).toBe(true);
  });

  it('reports namespaceURI for elements', () => {
    const r = root(ooxml);
    expect(r.namespaceURI).toBe(NS_MAIN);
    expect(find(r, 'name').namespaceURI).toBe(NS_MAIN);
    expect(r.children[1].children[0].children[0].namespaceURI).toBe(NS_X14);
    expect(r.children[1].children[1].children[0].namespaceURI).toBe(NS_X15);
    expect(new Element('x').namespaceURI).toBeNull();
    expect(new Element('p:x').namespaceURI).toBeNull();
  });

  it('follows the element when it moves', () => {
    const a = root('<a xmlns:p="urn:one"/>');
    const b = root('<b xmlns:p="urn:two"/>');
    const el = new Element('p:x');
    a.appendChild(el);
    expect(el.namespaceURI).toBe('urn:one');
    b.appendChild(el);
    expect(el.namespaceURI).toBe('urn:two');
  });
});

describe('Node namespace lookup', () => {
  const src = '<r xmlns="urn:default" xmlns:p="urn:p" p:x="1">text<![CDATA[data]]></r>';

  it('resolves text and CDATA nodes through their parent element', () => {
    const r = root(src);
    for (const node of r.childNodes) {
      expect(node.lookupNamespaceURI('p')).toBe('urn:p');
      expect(node.lookupNamespaceURI(null)).toBe('urn:default');
      expect(node.lookupPrefix('urn:p')).toBe('p');
      expect(node.isDefaultNamespace('urn:default')).toBe(true);
      expect(node.lookupNamespaceURI('xml')).toBe(XML_NS);
    }
  });

  it('resolves a document through its root element', () => {
    const doc = parseXML(src);
    expect(doc.lookupNamespaceURI('p')).toBe('urn:p');
    expect(doc.lookupPrefix('urn:p')).toBe('p');
    expect(doc.isDefaultNamespace('urn:default')).toBe(true);
  });

  it('resolves an attribute through its owner element', () => {
    const attr = root(src).attributes.getNamedItem('p:x')!;
    expect(attr.lookupNamespaceURI('p')).toBe('urn:p');
    expect(attr.lookupPrefix('urn:p')).toBe('p');
    expect(attr.isDefaultNamespace('urn:default')).toBe(true);
  });

  it('returns null for detached nodes and an empty document, even for xml', () => {
    const detached = [ new TextNode('x'), new CDataNode('x'), new Attr('p:x', '1'), new Document() ];
    for (const node of detached) {
      expect(node.lookupNamespaceURI('xml')).toBeNull();
      expect(node.lookupNamespaceURI(null)).toBeNull();
      expect(node.lookupPrefix(XML_NS)).toBeNull();
      expect(node.isDefaultNamespace(null)).toBe(true);
      expect(node.isDefaultNamespace('urn:a')).toBe(false);
    }
  });

  it('follows a text node when it moves', () => {
    const a = root('<a xmlns:p="urn:one"/>');
    const b = root('<b xmlns:p="urn:two"/>');
    const text = new TextNode('x');
    a.appendChild(text);
    expect(text.lookupNamespaceURI('p')).toBe('urn:one');
    b.appendChild(text);
    expect(text.lookupNamespaceURI('p')).toBe('urn:two');
  });
});

describe('Document.createElementNS', () => {
  const URI = '{140A7094-0E35-4892-8432-C4D2E57EDEB5}';

  it('uses the prefix in a qualified name as given', () => {
    const doc = parseXML('<workbook xmlns="' + NS_MAIN + '"/>');
    const extLst = doc.root!.appendChild(doc.createElement('extLst'));
    const ext1 = extLst.appendChild(doc.createElement('ext', { 'xmlns:x15': NS_X15, 'uri': URI }));
    const pr = ext1.appendChild(doc.createElementNS(NS_X15, 'x15:workbookPr', { chartTrackingRefBase: '1' }));
    expect(pr.fullName).toBe('x15:workbookPr');
    expect(pr.namespaceURI).toBe(NS_X15);
    expect(doc.root!.getAttribute('xmlns:x15')).toBeNull();
  });

  it('uses the prefix registered with attachNS', () => {
    const doc = new Document();
    doc.attachNS('urn:a', 'a');
    expect(doc.createElementNS('urn:a', 'x').fullName).toBe('a:x');
    expect(doc.attachNS('urn:b')('y').fullName).toBe('y');
  });

  it('resolves the namespace against the root declarations of a parsed document', () => {
    const doc = parseXML(ooxml);
    expect(doc.createElementNS(NS_MAIN, 'dxfs').fullName).toBe('dxfs');
    expect(doc.createElementNS(NS_MC, 'AlternateContent').fullName).toBe('mc:AlternateContent');
  });

  it('throws NamespaceError for an unknown namespace', () => {
    expect(() => new Document().createElementNS('urn:x', 'y')).toThrow(NamespaceError);
    // x15 is declared on a nested element, not on the root
    expect(() => parseXML(ooxml).createElementNS(NS_X15, 'y')).toThrow(NamespaceError);
  });

  it('enforces the reserved xml and xmlns prefixes', () => {
    const doc = new Document();
    expect(doc.createElementNS(XML_NS, 'xml:x').fullName).toBe('xml:x');
    expect(() => doc.createElementNS('urn:x', 'xml:x')).toThrow(NamespaceError);
    expect(() => doc.createElementNS('urn:x', 'xmlns:x')).toThrow(NamespaceError);
    expect(() => doc.createElementNS('urn:x', 'xmlns')).toThrow(NamespaceError);
    expect(() => doc.createElementNS(XMLNS_NS, 'p:x')).toThrow(NamespaceError);
    expect(() => doc.createElementNS('', 'p:x')).toThrow(NamespaceError);
  });

  it('keeps its namespace registry private', () => {
    const doc = new Document();
    expect('namespaces' in doc).toBe(false);
  });
});

describe('parsing with ns: true', () => {
  it('accepts a valid document and does not change it', () => {
    const doc = parseXML(ooxml, { ns: true });
    expect(doc.root?.toString()).toBe(parseXML(ooxml).root?.toString());
    expect(doc.root?.hasAttribute('xmlns:x14')).toBe(false);
    expect(doc.root?.hasAttribute('xmlns:x15')).toBe(false);
  });

  it('allows a prefix to be bound to different URIs in separate subtrees', () => {
    const r = root('<r><a xmlns:p="urn:one"><p:x/></a><b xmlns:p="urn:two"><p:y/></b></r>', { ns: true });
    expect(find(r, 'x').namespaceURI).toBe('urn:one');
    expect(find(r, 'y').namespaceURI).toBe('urn:two');
  });

  it('rejects a prefix used outside the scope of its declaration', () => {
    expect(() => parseXML('<r><a xmlns:p="urn:one"/><p:x/></r>', { ns: true })).toThrow(NamespaceError);
    expect(() => parseXML('<p:r/>', { ns: true })).toThrow(NamespaceError);
  });

  it('checks attribute prefixes too', () => {
    expect(() => parseXML('<r p:a="1"/>', { ns: true })).toThrow(NamespaceError);
    expect(() => parseXML('<r><c xmlns:p="u"/><d p:a="1"/></r>', { ns: true })).toThrow(NamespaceError);
    expect(root('<r xmlns:p="u" p:a="1"/>', { ns: true }).getAttribute('p:a')).toBe('1');
    expect(root('<r xmlns:p="u" id="1" p:a="2" ab="3"/>', { ns: true }).getAttribute('ab')).toBe('3');
    expect(root('<r xml:space="preserve"/>', { ns: true }).getAttribute('xml:space')).toBe('preserve');
  });

  it('allows declarations on the element that uses them', () => {
    expect(root('<p:r xmlns:p="urn:p"/>', { ns: true }).namespaceURI).toBe('urn:p');
  });

  it('allows xmlns="" to remove the default namespace', () => {
    expect(root('<r xmlns="urn:a"><c xmlns=""/></r>', { ns: true }).children[0].namespaceURI).toBeNull();
  });

  it('rejects misuse of the xml and xmlns prefixes', () => {
    const bad = [
      '<r xmlns:xmlns="urn:x"/>',
      `<r xmlns:xml="urn:x"/>`,
      `<r xmlns:p="${XML_NS}"/>`,
      `<r xmlns:p="${XMLNS_NS}"/>`,
      `<r xmlns="${XMLNS_NS}"/>`,
      '<r xmlns:p=""/>',
      '<xmlns:r/>',
    ];
    for (const src of bad) {
      expect(() => parseXML(src, { ns: true }), src).toThrow(NamespaceError);
    }
    expect(root(`<r xmlns:xml="${XML_NS}"/>`, { ns: true }).tagName).toBe('r');
  });

  it('does not validate prefixes without the ns option', () => {
    expect(root('<r><p:x q:a="1"/></r>').children[0].fullName).toBe('p:x');
  });
});
