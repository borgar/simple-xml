import { describe, it, expect } from 'vitest';
import { Element, parseXML, TextNode } from '../lib/index.js';

describe('prettyPrint', () => {
  it('simple tag', () => {
    expect(
      parseXML('<node attr="value" />').toString()
    ).toBe('<node attr="value" />');

    expect(
      parseXML(`
<node enc='&lt; &gt; &amp; &quot; &apos; &#12; &#xAB;'>
  pcdata &lt; &gt; &amp; &quot; &apos; &#12; &#xAB;
</node>`.trim()).toString()
    ).toBe(`<node enc="&lt; &gt; &amp; &quot; &apos; &#12; «">
  pcdata &lt; &gt; &amp; &quot; &apos; &#12; «
</node>`);

    expect(
      parseXML('<a><b><c><d>text</d></c></b></a>').toString()
    ).toBe(`<a>
  <b>
    <c>
      <d>text</d>
    </c>
  </b>
</a>`);

    expect(
      parseXML('<汉语 名字="name" 价值="value">世界有很多语言𤭢</汉语>').toString()
    ).toBe('<汉语 名字="name" 价值="value">世界有很多语言𤭢</汉语>');

    expect(
      parseXML('<a xml:space="preserve"> <b> <c> c </c> b </b> </a>').toString()
    ).toBe('<a xml:space="preserve"> <b> <c> c </c> b </b> </a>');

    expect(
      parseXML('<a> <b> <c> c </c> b </b> </a>').toString()
    ).toBe(`<a>
  <b>
    <c> c </c>
    b
  </b>
</a>`);

    expect(
      parseXML(`
<?xml version='1.0'?>
<!DOCTYPE html>
<node attr="value">
  <child/>
  pcdata
  <![CDATA[ te<>&'"st ]]>
  <!-- comment -->
  <?pi value?>
</node>`.trim()).toString()
    ).toBe(`<node attr="value">
  <child />
  pcdata
  <![CDATA[ te<>&'"st ]]>
</node>`);

    {
      const dom = parseXML('<a><![CDATA[ test ]]></a>');
      expect(dom.toString()).toBe('<a><![CDATA[ test ]]></a>');
      // @ts-ignore
      dom.childNodes[0].childNodes[0].value = ' ]]> ';
      expect(dom.toString()).toBe('<a><![CDATA[ ]]&gt; ]]></a>');
    }

    {
      const dom = parseXML('<a></a>');
      dom.childNodes[0].appendChild(new TextNode('Foo'));
      dom.childNodes[0].appendChild(new TextNode(' '));
      dom.childNodes[0].appendChild(new TextNode('Bar'));
      expect(dom.toString()).toBe('<a>Foo Bar</a>');
    }

    {
      const dom = parseXML('<a></a>');
      dom.childNodes[0].appendChild(new TextNode('Foo'));
      dom.childNodes[0].appendChild(new TextNode(' '));
      dom.childNodes[0].appendChild(new TextNode('Bar'));
      dom.childNodes[0].appendChild(new TextNode(' '));
      dom.childNodes[0].appendChild(new Element('b'));
      dom.childNodes[0].appendChild(new TextNode(' '));
      dom.childNodes[0].appendChild(new TextNode('Baz'));
      dom.childNodes[0].appendChild(new TextNode(' '));
      expect(
        dom.toString()
      ).toBe(`<a>
  Foo Bar
  <b />
  Baz
</a>`);
    }
  });
});
