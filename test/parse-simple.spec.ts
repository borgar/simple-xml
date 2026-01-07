import { describe, it, expect } from 'vitest';
import { parseXML } from '../lib/index.js';

const emptyOk = { emptyDoc: true };
const laxAttr = { laxAttr: true };

describe('parse-simple', () => {
  it('simple tag', () => {
    expect(parseXML('<a />').toJS()).toEqual([ 'a' ]);
    expect(parseXML('<a/>').toJS()).toEqual([ 'a' ]);
    expect(parseXML('<a></a>').toJS()).toEqual([ 'a' ]);
    expect(parseXML('<a ></a>').toJS()).toEqual([ 'a' ]);
    expect(parseXML('<a ></a >').toJS()).toEqual([ 'a' ]);
    expect(parseXML('<a ></a >').toJS()).toEqual([ 'a' ]);

    expect(() => parseXML('<')).toThrow();
    expect(() => parseXML('<!')).toThrow();
    expect(() => parseXML('<!D')).toThrow();
    expect(() => parseXML('<#')).toThrow();
    expect(() => parseXML('<node#')).toThrow();
    expect(() => parseXML('<node')).toThrow();
    expect(() => parseXML('<node/')).toThrow();
    expect(() => parseXML('<node /')).toThrow();
    expect(() => parseXML('<node / ')).toThrow();
    expect(() => parseXML('<node / >')).toThrow();
    expect(() => parseXML('<node/ >')).toThrow();
    expect(() => parseXML('</ node>')).toThrow();
    expect(() => parseXML('</node')).toThrow();
    expect(() => parseXML('</node ')).toThrow();
    expect(() => parseXML('<node></ node>')).toThrow();
    expect(() => parseXML('<node></node')).toThrow();
    expect(() => parseXML('<node></node ')).toThrow();
    expect(() => parseXML('<node></nodes>')).toThrow();
    expect(() => parseXML('<node>')).toThrow();
    expect(() => parseXML('<node/><')).toThrow();
    expect(() => parseXML('<node attr=\'value\'>')).toThrow();
    expect(() => parseXML('</></node>')).toThrow();
    expect(() => parseXML('</node>')).toThrow();
    expect(() => parseXML('</>')).toThrow();
    expect(() => parseXML('<node></node v>')).toThrow();
    expect(() => parseXML('<node&/>')).toThrow();
    expect(() => parseXML('<node& v=\'1\'/>')).toThrow();
  });

  it('nested tags', () => {
    expect(parseXML('<a><b /></a>').toJS()).toEqual([ 'a', [ 'b' ] ]);
    expect(parseXML('<a><b/></a>').toJS()).toEqual([ 'a', [ 'b' ] ]);
    expect(parseXML('<a><b></b></a>').toJS()).toEqual([ 'a', [ 'b' ] ]);
    expect(parseXML('<a><b> </b></a>').toJS()).toEqual([ 'a', [ 'b' ] ]);
    expect(parseXML('<a> <b> </b> </a>').toJS()).toEqual([ 'a', [ 'b' ] ]);
  });

  it('attributes', () => {
    expect(parseXML('<a k="1" />').toJS()).toEqual([ 'a', { k: '1' } ]);
    expect(parseXML("<a k='1' />").toJS()).toEqual([ 'a', { k: '1' } ]);
    expect(parseXML('<a k="1" w="2" />').toJS()).toEqual([ 'a', { k: '1', w: '2' } ]);

    expect(() => parseXML('<node id')).toThrow();
    expect(() => parseXML('<node id ')).toThrow();
    expect(() => parseXML('<node id  ')).toThrow();
    expect(() => parseXML('<node id   ')).toThrow();
    expect(() => parseXML('<node id/')).toThrow();
    expect(() => parseXML('<node id/>')).toThrow();
    expect(() => parseXML('<node id?/>')).toThrow();
    expect(() => parseXML('<node id=/>')).toThrow();
    expect(() => parseXML('<node id=\'/>')).toThrow();
    expect(() => parseXML('<node id="/>')).toThrow();
    expect(() => parseXML('<node id="\'/>')).toThrow();
    expect(() => parseXML('<node id=\'"/>')).toThrow();
    expect(() => parseXML('<node id=\'"/>')).toThrow();
    expect(() => parseXML('<node #/>')).toThrow();
    expect(() => parseXML('<node#/>')).toThrow();
    expect(() => parseXML('<node id1=\'1\'id2=\'2\'/>')).toThrow();
    expect(() => parseXML('<node id&=\'1\'/>')).toThrow();
    expect(() => parseXML('<node &=\'1\'/>')).toThrow();
  });

  it('> inside attribute values', () => {
    expect(parseXML('<a href="foo>bar" />').toJS()).toEqual([ 'a', { href: 'foo>bar' } ]);
    expect(parseXML("<a href='foo>bar' />").toJS()).toEqual([ 'a', { href: 'foo>bar' } ]);
    expect(parseXML('<a v="a/>b" />').toJS()).toEqual([ 'a', { v: 'a/>b' } ]);
    expect(parseXML('<a v="a>b>c" />').toJS()).toEqual([ 'a', { v: 'a>b>c' } ]);
    expect(parseXML('<a x=">" y="z" />').toJS()).toEqual([ 'a', { x: '>', y: 'z' } ]);
    expect(parseXML('<a href="foo>bar">text</a>').toJS()).toEqual([ 'a', { href: 'foo>bar' }, 'text' ]);
  });

  it('opposite quote type inside attribute values', () => {
    expect(parseXML('<a v="a\'b" />').toJS()).toEqual([ 'a', { v: "a'b" } ]);
    expect(parseXML("<a v='a\"b' />").toJS()).toEqual([ 'a', { v: 'a"b' } ]);
    expect(parseXML('<a v="a>\'b" />').toJS()).toEqual([ 'a', { v: "a>'b" } ]);
    expect(parseXML("<a v='a>\"b' />").toJS()).toEqual([ 'a', { v: 'a>"b' } ]);
  });

  it('invalid syntax', () => {
    expect(() => parseXML('')).toThrow();
    // allow empty docs with option:
    expect(parseXML('', emptyOk).toJS()).toEqual([]);

    expect(() => parseXML('<a x/>')).toThrow();
    expect(() => parseXML('<a x=1/>')).toThrow();
    expect(() => parseXML('<a x=foo />')).toThrow();
    // allow lax parsing of attr with option:
    expect(parseXML('<a x/>', laxAttr).toJS()).toEqual([ 'a', { x: '' } ]);
    expect(parseXML('<a x=1/>', laxAttr).toJS()).toEqual([ 'a', { x: '1' } ]);
    expect(parseXML('<a x=foo/>', laxAttr).toJS()).toEqual([ 'a', { x: 'foo' } ]);

    expect(() => parseXML('<a>')).toThrow();
    expect(() => parseXML('<a><b></a>')).toThrow();
    expect(() => parseXML('foo<a x=1/>')).toThrow();
    expect(() => parseXML('<a x=1/>foo')).toThrow();
  });

  it('processing instructions', () => {
    expect(parseXML('<?foo?><a />').toJS()).toEqual([ 'a' ]);
    expect(parseXML('<?foo value?><a />').toJS()).toEqual([ 'a' ]);
    expect(parseXML('<?foo?><?foo value?><a />').toJS()).toEqual([ 'a' ]);
    expect(parseXML('<?foo  \r\n\t  bar ?><a />').toJS()).toEqual([ 'a' ]);

    expect(() => parseXML('<')).toThrow();
    expect(() => parseXML('<？')).toThrow();
    expect(() => parseXML('<?？')).toThrow();
    expect(() => parseXML('<?>')).toThrow();
    expect(() => parseXML('<?#?>')).toThrow();
    expect(() => parseXML('<?name')).toThrow();
    expect(() => parseXML('<?name>')).toThrow();
    expect(() => parseXML('<?name ?')).toThrow();
    expect(() => parseXML('<?name?')).toThrow();
    expect(() => parseXML('<?name? ')).toThrow();
    expect(() => parseXML('<?name?  ')).toThrow();
    expect(() => parseXML('<?name ')).toThrow();
    expect(() => parseXML('<?name  ')).toThrow();
    expect(() => parseXML('<?name   ')).toThrow();
    expect(() => parseXML('<?name value')).toThrow();
    expect(() => parseXML('<?name value ')).toThrow();
    expect(() => parseXML('<?name value  ')).toThrow();
    expect(() => parseXML('<?name value  ?')).toThrow();
    expect(() => parseXML('<?name value  ? ')).toThrow();
    expect(() => parseXML('<?name value  ? >')).toThrow();
    expect(() => parseXML('<?name value  ? > ')).toThrow();
    expect(() => parseXML('<?name&')).toThrow();
    expect(() => parseXML('<?name&?')).toThrow();

    expect(() => parseXML('<?xx#?>')).toThrow();
    expect(() => parseXML('<?name&?>')).toThrow();
    expect(() => parseXML('<?name& x?>')).toThrow();
  });

  it('comments', () => {
    expect(parseXML('<!--comment--><a />').toJS()).toEqual([ 'a' ]);
    expect(parseXML('<a /><!--comment-->').toJS()).toEqual([ 'a' ]);
    expect(parseXML('<!----><!--value--><a />').toJS()).toEqual([ 'a' ]);
    expect(parseXML('<!--\r\rval1\rval2\r\nval3\nval4\r\r--><a />').toJS()).toEqual([ 'a' ]);
    expect(parseXML(' <!--comment--> <a /> <!--comment--> ').toJS()).toEqual([ 'a' ]);

    expect(() => parseXML('<!-', emptyOk)).toThrow();
    expect(() => parseXML('<!--', emptyOk)).toThrow();
    expect(() => parseXML('<!--v', emptyOk)).toThrow();
    expect(() => parseXML('<!-->', emptyOk)).toThrow();
    expect(() => parseXML('<!--->', emptyOk)).toThrow();
    expect(() => parseXML('<!-- <!-- --><!- -->', emptyOk)).toThrow();
  });

  it('cdata', () => {
    expect(parseXML('<a><![CDATA[]]><![CDATA[value]]></a>').toJS()).toEqual([ 'a', 'value' ]);
    expect(() => parseXML('<![', emptyOk)).toThrow();
    expect(() => parseXML('<![C', emptyOk)).toThrow();
    expect(() => parseXML('<![CD', emptyOk)).toThrow();
    expect(() => parseXML('<![CDA', emptyOk)).toThrow();
    expect(() => parseXML('<![CDAT', emptyOk)).toThrow();
    expect(() => parseXML('<![CDATA', emptyOk)).toThrow();
    expect(() => parseXML('<![CDATA[', emptyOk)).toThrow();
    expect(() => parseXML('<![CDATA[]', emptyOk)).toThrow();
    expect(() => parseXML('<![CDATA[data', emptyOk)).toThrow();
    expect(() => parseXML('<![CDATA[data]', emptyOk)).toThrow();
    expect(() => parseXML('<![CDATA[data]]', emptyOk)).toThrow();
    expect(() => parseXML('<![CDATA[>', emptyOk)).toThrow();
    expect(() => parseXML('<![CDATA[ <![CDATA[]]><![CDATA ]]>', emptyOk)).toThrow();
  });
});
