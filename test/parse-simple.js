import test from 'tape';
import { parseXML } from '../lib/index.js';

const emptyOk = { emptyDoc: true };
const laxAttr = { laxAttr: true };

test('simple tag', t => {
  t.deepEqual(parseXML('<a />').toJS(), [ 'a' ], '<a />');
  t.deepEqual(parseXML('<a/>').toJS(), [ 'a' ], '<a/>');
  t.deepEqual(parseXML('<a></a>').toJS(), [ 'a' ], '<a></a>');
  t.deepEqual(parseXML('<a ></a>').toJS(), [ 'a' ], '<a ></a>');
  t.deepEqual(parseXML('<a ></a >').toJS(), [ 'a' ], '<a ></a >');
  t.deepEqual(parseXML('<a ></a >').toJS(), [ 'a' ], '<a ></a >');

  t.throws(() => parseXML('<'), '<');
  t.throws(() => parseXML('<!'), '<!');
  t.throws(() => parseXML('<!D'), '<!D');
  t.throws(() => parseXML('<#'), '<#');
  t.throws(() => parseXML('<node#'), '<node#');
  t.throws(() => parseXML('<node'), '<node');
  t.throws(() => parseXML('<node/'), '<node/');
  t.throws(() => parseXML('<node /'), '<node /');
  t.throws(() => parseXML('<node / '), '<node / ');
  t.throws(() => parseXML('<node / >'), '<node / >');
  t.throws(() => parseXML('<node/ >'), '<node/ >');
  t.throws(() => parseXML('</ node>'), '</ node>');
  t.throws(() => parseXML('</node'), '</node>');
  t.throws(() => parseXML('</node '), '</node ');
  t.throws(() => parseXML('<node></ node>'), '<node></ node>');
  t.throws(() => parseXML('<node></node'), '<node></node');
  t.throws(() => parseXML('<node></node '), '<node></node ');
  t.throws(() => parseXML('<node></nodes>'), '<node></nodes>');
  t.throws(() => parseXML('<node>'), '<node>');
  t.throws(() => parseXML('<node/><'), '<node/><');
  t.throws(() => parseXML('<node attr=\'value\'>'), '<node attr=\'value\'>');
  t.throws(() => parseXML('</></node>'), '</></node>');
  t.throws(() => parseXML('</node>'), '</node>');
  t.throws(() => parseXML('</>'), '</>');
  t.throws(() => parseXML('<node></node v>'), '<node></node v>');
  t.throws(() => parseXML('<node&/>'), '<node&/>');
  t.throws(() => parseXML('<node& v=\'1\'/>'), '<node& v=\'1\'/>');

  t.end();
});

test('nested tags', t => {
  t.deepEqual(parseXML('<a><b /></a>').toJS(), [ 'a', [ 'b' ] ], '<a><b /></a>');
  t.deepEqual(parseXML('<a><b/></a>').toJS(), [ 'a', [ 'b' ] ], '<a><b/></a>');
  t.deepEqual(parseXML('<a><b></b></a>').toJS(), [ 'a', [ 'b' ] ], '<a><b></b></a>');
  t.deepEqual(parseXML('<a><b> </b></a>').toJS(), [ 'a', [ 'b' ] ], '<a><b> </b></a>');
  t.deepEqual(parseXML('<a> <b> </b> </a>').toJS(), [ 'a', [ 'b' ] ], '<a> <b> </b> </a>');
  t.end();
});

test('attributes', t => {
  t.deepEqual(parseXML('<a k="1" />').toJS(),
    [ 'a', { k: '1' } ], '<a k="1" />');
  t.deepEqual(parseXML("<a k='1' />").toJS(),
    [ 'a', { k: '1' } ], "<a k='1' />");
  t.deepEqual(parseXML('<a k="1" w="2" />').toJS(),
    [ 'a', { k: '1', w: '2' } ], '<a k="1" w="2" />');

  t.throws(() => parseXML('<node id'), '<node id');
  t.throws(() => parseXML('<node id '), '<node id ');
  t.throws(() => parseXML('<node id  '), '<node id  ');
  t.throws(() => parseXML('<node id   '), '<node id   ');
  t.throws(() => parseXML('<node id/'), '<node id/');
  t.throws(() => parseXML('<node id/>'), '<node id/>');
  t.throws(() => parseXML('<node id?/>'), '<node id?/>');
  t.throws(() => parseXML('<node id=/>'), '<node id=/>');
  t.throws(() => parseXML('<node id=\'/>'), '<node id=\'/>');
  t.throws(() => parseXML('<node id="/>'), '<node id="/>');
  t.throws(() => parseXML('<node id="\'/>'), '<node id="\'/>');
  t.throws(() => parseXML('<node id=\'"/>'), '<node id=\'"/>');
  t.throws(() => parseXML('<node id=\'"/>'), '<node id=\'"/>');
  t.throws(() => parseXML('<node #/>'), '<node #/>');
  t.throws(() => parseXML('<node#/>'), '<node#/>');
  t.throws(() => parseXML('<node id1=\'1\'id2=\'2\'/>'), '<node id1=\'1\'id2=\'2\'/>');
  t.throws(() => parseXML('<node id&=\'1\'/>'), '<node id&=\'1\'/>');
  t.throws(() => parseXML('<node &=\'1\'/>'), '<node &=\'1\'/>');

  t.end();
});

test('invalid syntax', t => {
  t.throws(() => parseXML(''), '');
  // allow empty docs with option:
  t.deepEqual(parseXML('', emptyOk).toJS(), []);

  t.throws(() => parseXML('<a x/>'), '<a x/>');
  t.throws(() => parseXML('<a x=1/>'), '<a x=1/>');
  t.throws(() => parseXML('<a x=foo />'), '<a x=foo />');
  // allow lax parsing of attr with option:
  t.deepEqual(parseXML('<a x/>', laxAttr).toJS(), [ 'a', { x: '' } ]);
  t.deepEqual(parseXML('<a x=1/>', laxAttr).toJS(), [ 'a', { x: '1' } ]);
  t.deepEqual(parseXML('<a x=foo/>', laxAttr).toJS(), [ 'a', { x: 'foo' } ]);

  t.throws(() => parseXML('<a>'), '<a>');
  t.throws(() => parseXML('<a><b></a>'), '<a><b></a>');
  t.throws(() => parseXML('foo<a x=1/>'), 'foo<a x=1/>');
  t.throws(() => parseXML('<a x=1/>foo'), '<a x=1/>foo');
  t.end();
});

test('processing instructions', t => {
  t.deepEqual(parseXML('<?foo?><a />').toJS(), [ 'a' ]);
  t.deepEqual(parseXML('<?foo value?><a />').toJS(), [ 'a' ]);
  t.deepEqual(parseXML('<?foo?><?foo value?><a />').toJS(), [ 'a' ]);
  t.deepEqual(parseXML('<?foo  \r\n\t  bar ?><a />').toJS(), [ 'a' ]);

  t.throws(() => parseXML('<'), '<');
  t.throws(() => parseXML('<?'), '<?');
  t.throws(() => parseXML('<??'), '<??');
  t.throws(() => parseXML('<?>'), '<?>');
  t.throws(() => parseXML('<?#?>'), '<?#?>');
  t.throws(() => parseXML('<?name'), '<?name');
  t.throws(() => parseXML('<?name>'), '<?name>');
  t.throws(() => parseXML('<?name ?'), '<?name ?');
  t.throws(() => parseXML('<?name?'), '<?name?');
  t.throws(() => parseXML('<?name? '), '<?name? ');
  t.throws(() => parseXML('<?name?  '), '<?name?  ');
  t.throws(() => parseXML('<?name '), '<?name ');
  t.throws(() => parseXML('<?name  '), '<?name  ');
  t.throws(() => parseXML('<?name   '), '<?name   ');
  t.throws(() => parseXML('<?name value'), '<?name value');
  t.throws(() => parseXML('<?name value '), '<?name value ');
  t.throws(() => parseXML('<?name value  '), '<?name value  ');
  t.throws(() => parseXML('<?name value  ?'), '<?name value  ?');
  t.throws(() => parseXML('<?name value  ? '), '<?name value  ? ');
  t.throws(() => parseXML('<?name value  ? >'), '<?name value  ? >');
  t.throws(() => parseXML('<?name value  ? > '), '<?name value  ? > ');
  t.throws(() => parseXML('<?name&'), '<?name&');
  t.throws(() => parseXML('<?name&?'), '<?name&?');

  t.throws(() => parseXML('<?xx#?>'), '<?xx#?>');
  t.throws(() => parseXML('<?name&?>'), '<?name&?>');
  t.throws(() => parseXML('<?name& x?>'), '<?name& x?>');
  t.end();
});

test('comments', t => {
  t.deepEqual(parseXML('<!--comment--><a />').toJS(), [ 'a' ]);
  t.deepEqual(parseXML('<a /><!--comment-->').toJS(), [ 'a' ]);
  t.deepEqual(parseXML('<!----><!--value--><a />').toJS(), [ 'a' ]);
  t.deepEqual(parseXML('<!--\r\rval1\rval2\r\nval3\nval4\r\r--><a />').toJS(), [ 'a' ]);
  t.deepEqual(parseXML(' <!--comment--> <a /> <!--comment--> ').toJS(), [ 'a' ]);

  t.throws(() => parseXML('<!-', emptyOk), '<!-');
  t.throws(() => parseXML('<!--', emptyOk), '<!--');
  t.throws(() => parseXML('<!--v', emptyOk), '<!--v');
  t.throws(() => parseXML('<!-->', emptyOk), '<!-->');
  t.throws(() => parseXML('<!--->', emptyOk), '<!--->');
  t.throws(() => parseXML('<!-- <!-- --><!- -->', emptyOk), '<!-- <!-- --><!- -->');

  t.end();
});

test('cdata', t => {
  t.deepEqual(parseXML('<a><![CDATA[]]><![CDATA[value]]></a>').toJS(), [ 'a', 'value' ]);
  t.throws(() => parseXML('<![', emptyOk), '<![');
  t.throws(() => parseXML('<![C', emptyOk), '<![C');
  t.throws(() => parseXML('<![CD', emptyOk), '<![CD');
  t.throws(() => parseXML('<![CDA', emptyOk), '<![CDA');
  t.throws(() => parseXML('<![CDAT', emptyOk), '<![CDAT');
  t.throws(() => parseXML('<![CDATA', emptyOk), '<![CDATA');
  t.throws(() => parseXML('<![CDATA[', emptyOk), '<![CDATA[');
  t.throws(() => parseXML('<![CDATA[]', emptyOk), '<![CDATA[]');
  t.throws(() => parseXML('<![CDATA[data', emptyOk), '<![CDATA[data');
  t.throws(() => parseXML('<![CDATA[data]', emptyOk), '<![CDATA[data]');
  t.throws(() => parseXML('<![CDATA[data]]', emptyOk), '<![CDATA[data]]');
  t.throws(() => parseXML('<![CDATA[>', emptyOk), '<![CDATA[>');
  t.throws(() => parseXML('<![CDATA[ <![CDATA[]]><![CDATA ]]>', emptyOk), '<![CDATA[ <![CDATA[]]><![CDATA ]]>');
  t.end();
});
