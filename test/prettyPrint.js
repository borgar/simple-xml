import test from 'tape';
import { Element, parseXML, TextNode } from '../lib/index.js';

test('simple tag', t => {
  t.equal(
    parseXML('<node attr="value" />').toString(),
    '<node attr="value" />'
  );

  t.equal(
    parseXML(`
<node enc='&lt; &gt; &amp; &quot; &apos; &#12; &#xAB;'>
  pcdata &lt; &gt; &amp; &quot; &apos; &#12; &#xAB;
</node>`.trim()).toString(),
    `<node enc="&lt; &gt; &amp; &quot; &apos; &#12; «">
  pcdata &lt; &gt; &amp; &quot; &apos; &#12; «
</node>`
  );

  t.equal(
    parseXML('<a><b><c><d>text</d></c></b></a>').toString(),
    `<a>
  <b>
    <c>
      <d>text</d>
    </c>
  </b>
</a>`
  );

  t.equal(
    parseXML('<汉语 名字="name" 价值="value">世界有很多语言𤭢</汉语>').toString(),
    '<汉语 名字="name" 价值="value">世界有很多语言𤭢</汉语>'
  );

  t.equal(
    parseXML('<a xml:space="preserve"> <b> <c> c </c> b </b> </a>').toString(),
    '<a xml:space="preserve"> <b> <c> c </c> b </b> </a>'
  );

  t.equal(
    parseXML('<a> <b> <c> c </c> b </b> </a>').toString(),
    `<a>
  <b>
    <c> c </c>
    b
  </b>
</a>`
  );

  t.equal(
    parseXML(`
<?xml version='1.0'?>
<!DOCTYPE html>
<node attr="value">
  <child/>
  pcdata
  <![CDATA[ te<>&'"st ]]>
  <!-- comment -->
  <?pi value?>
</node>`.trim()).toString(),
    `<node attr="value">
  <child />
  pcdata
  <![CDATA[ te<>&'"st ]]>
</node>`
  );

  {
    const dom = parseXML('<a><![CDATA[ test ]]></a>');
    t.equal(dom.toString(), '<a><![CDATA[ test ]]></a>');

    dom.childNodes[0].childNodes[0].value = ' ]]> ';
    t.equal(dom.toString(), '<a><![CDATA[ ]]&gt; ]]></a>');
  }

  {
    const dom = parseXML('<a></a>');
    dom.childNodes[0].appendChild(new TextNode('Foo'));
    dom.childNodes[0].appendChild(new TextNode(' '));
    dom.childNodes[0].appendChild(new TextNode('Bar'));
    t.equal(dom.toString(), '<a>Foo Bar</a>');
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
    t.equal(
      dom.toString(),
      `<a>
  Foo Bar
  <b />
  Baz
</a>`
    );
  }

  t.end();
});
