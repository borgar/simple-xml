const test = require('tape');
const xml = require('../lib');

const emptyOk = { emptyDoc: true };
const laxAttr = { laxAttr: true };

test('simple tag', t => {
  t.deepEqual(xml.parse('<a />').toJS(), [ 'a' ], '<a />');
  t.deepEqual(xml.parse('<a/>').toJS(), [ 'a' ], '<a/>');
  t.deepEqual(xml.parse('<a></a>').toJS(), [ 'a' ], '<a></a>');
  t.deepEqual(xml.parse('<a ></a>').toJS(), [ 'a' ], '<a ></a>');
  t.deepEqual(xml.parse('<a ></a >').toJS(), [ 'a' ], '<a ></a >');
  t.deepEqual(xml.parse('<a ></a >').toJS(), [ 'a' ], '<a ></a >');

  t.throws(() => xml.parse('<'));
  t.throws(() => xml.parse('<!'));
  t.throws(() => xml.parse('<!D'));
  t.throws(() => xml.parse('<#'));
  t.throws(() => xml.parse('<node#'));
  t.throws(() => xml.parse('<node'));
  t.throws(() => xml.parse('<node/'));
  t.throws(() => xml.parse('<node /'));
  t.throws(() => xml.parse('<node / '));
  t.throws(() => xml.parse('<node / >'));
  t.throws(() => xml.parse('<node/ >'));
  t.throws(() => xml.parse('</ node>'));
  t.throws(() => xml.parse('</node'));
  t.throws(() => xml.parse('</node '));
  t.throws(() => xml.parse('<node></ node>'));
  t.throws(() => xml.parse('<node></node'));
  t.throws(() => xml.parse('<node></node '));
  t.throws(() => xml.parse('<node></nodes>'));
  t.throws(() => xml.parse('<node>'));
  t.throws(() => xml.parse('<node/><'));
  t.throws(() => xml.parse('<node attr=\'value\'>'));
  t.throws(() => xml.parse('</></node>'));
  t.throws(() => xml.parse('</node>'));
  t.throws(() => xml.parse('</>'));
  t.throws(() => xml.parse('<node></node v>'));
  t.throws(() => xml.parse('<node&/>'));
  t.throws(() => xml.parse('<node& v=\'1\'/>'));

  t.end();
});

test('nested tags', t => {
  t.deepEqual(xml.parse('<a><b /></a>').toJS(), [ 'a', [ 'b' ] ], '<a><b /></a>');
  t.deepEqual(xml.parse('<a><b/></a>').toJS(), [ 'a', [ 'b' ] ], '<a><b/></a>');
  t.deepEqual(xml.parse('<a><b></b></a>').toJS(), [ 'a', [ 'b' ] ], '<a><b></b></a>');
  t.deepEqual(xml.parse('<a><b> </b></a>').toJS(), [ 'a', [ 'b' ] ], '<a><b> </b></a>');
  t.deepEqual(xml.parse('<a> <b> </b> </a>').toJS(), [ 'a', [ 'b' ] ], '<a> <b> </b> </a>');
  t.end();
});

test('attributes', t => {
  t.deepEqual(xml.parse('<a k="1" />').toJS(),
    [ 'a', { k: '1' } ], '<a k="1" />');
  t.deepEqual(xml.parse("<a k='1' />").toJS(),
    [ 'a', { k: '1' } ], "<a k='1' />");
  t.deepEqual(xml.parse('<a k="1" w="2" />').toJS(),
    [ 'a', { k: '1', w: '2' } ], '<a k="1" w="2" />');

  t.throws(() => xml.parse('<node id'));
  t.throws(() => xml.parse('<node id '));
  t.throws(() => xml.parse('<node id  '));
  t.throws(() => xml.parse('<node id   '));
  t.throws(() => xml.parse('<node id/'));
  t.throws(() => xml.parse('<node id/>'));
  t.throws(() => xml.parse('<node id?/>'));
  t.throws(() => xml.parse('<node id=/>'));
  t.throws(() => xml.parse('<node id=\'/>'));
  t.throws(() => xml.parse('<node id="/>'));
  t.throws(() => xml.parse('<node id="\'/>'));
  t.throws(() => xml.parse('<node id=\'"/>'));
  t.throws(() => xml.parse('<node id=\'"/>'));
  t.throws(() => xml.parse('<node #/>'));
  t.throws(() => xml.parse('<node#/>'));
  t.throws(() => xml.parse('<node id1=\'1\'id2=\'2\'/>'));
  t.throws(() => xml.parse('<node id&=\'1\'/>'));
  t.throws(() => xml.parse('<node &=\'1\'/>'));

  t.end();
});

test('invalid syntax', t => {
  t.throws(() => xml.parse(''));
  // allow empty docs with option:
  t.deepEqual(xml.parse('', emptyOk).toJS(), []);

  t.throws(() => xml.parse('<a x/>'));
  t.throws(() => xml.parse('<a x=1/>'));
  t.throws(() => xml.parse('<a x=foo />'));
  // allow lax parsing of attr with option:
  t.deepEqual(xml.parse('<a x/>', laxAttr).toJS(), [ 'a', { x: '' }]);
  t.deepEqual(xml.parse('<a x=1/>', laxAttr).toJS(), [ 'a', { x: '1' }]);
  t.deepEqual(xml.parse('<a x=foo/>', laxAttr).toJS(), [ 'a', { x: 'foo' }]);

  t.throws(() => xml.parse('<a>'));
  t.throws(() => xml.parse('<a><b></a>'));
  t.throws(() => xml.parse('foo<a x=1/>'));
  t.throws(() => xml.parse('<a x=1/>foo'));
  t.end();
});

test('processing instructions', t => {
  t.deepEqual(xml.parse('<?foo?><a />').toJS(), [ 'a' ]);
  t.deepEqual(xml.parse('<?foo value?><a />').toJS(), [ 'a' ]);
  t.deepEqual(xml.parse('<?foo?><?foo value?><a />').toJS(), [ 'a' ]);
  t.deepEqual(xml.parse('<?foo  \r\n\t  bar ?><a />').toJS(), [ 'a' ]);

  t.throws(() => xml.parse('<'));
  t.throws(() => xml.parse('<?'));
  t.throws(() => xml.parse('<??'));
  t.throws(() => xml.parse('<?>'));
  t.throws(() => xml.parse('<?#?>'));
  t.throws(() => xml.parse('<?name'));
  t.throws(() => xml.parse('<?name>'));
  t.throws(() => xml.parse('<?name ?'));
  t.throws(() => xml.parse('<?name?'));
  t.throws(() => xml.parse('<?name? '));
  t.throws(() => xml.parse('<?name?  '));
  t.throws(() => xml.parse('<?name '));
  t.throws(() => xml.parse('<?name  '));
  t.throws(() => xml.parse('<?name   '));
  t.throws(() => xml.parse('<?name value'));
  t.throws(() => xml.parse('<?name value '));
  t.throws(() => xml.parse('<?name value  '));
  t.throws(() => xml.parse('<?name value  ?'));
  t.throws(() => xml.parse('<?name value  ? '));
  t.throws(() => xml.parse('<?name value  ? >'));
  t.throws(() => xml.parse('<?name value  ? > '));
  t.throws(() => xml.parse('<?name&'));
  t.throws(() => xml.parse('<?name&?'));

  t.throws(() => xml.parse('<?xx#?>'));
  t.throws(() => xml.parse('<?name&?>'));
  t.throws(() => xml.parse('<?name& x?>'));
  t.end();
});


test('comments', t => {
  t.deepEqual(xml.parse('<!--comment--><a />').toJS(), [ 'a' ]);
  t.deepEqual(xml.parse('<a /><!--comment-->').toJS(), [ 'a' ]);
  t.deepEqual(xml.parse('<!----><!--value--><a />').toJS(), [ 'a' ]);
  t.deepEqual(xml.parse('<!--\r\rval1\rval2\r\nval3\nval4\r\r--><a />').toJS(), [ 'a' ]);
  t.deepEqual(xml.parse(' <!--comment--> <a /> <!--comment--> ').toJS(), [ 'a' ]);

  t.throws(() => xml.parse('<!-', emptyOk));
  t.throws(() => xml.parse('<!--', emptyOk));
  t.throws(() => xml.parse('<!--v', emptyOk));
  t.throws(() => xml.parse('<!-->', emptyOk));
  t.throws(() => xml.parse('<!--->', emptyOk));
  t.throws(() => xml.parse('<!-- <!-- --><!- -->', emptyOk));

  t.end();
});

test('cdata', t => {
  t.deepEqual(xml.parse('<a><![CDATA[]]><![CDATA[value]]></a>').toJS(), [ 'a', 'value' ]);
  t.throws(() => xml.parse('<![', emptyOk));
  t.throws(() => xml.parse('<![C', emptyOk));
  t.throws(() => xml.parse('<![CD', emptyOk));
  t.throws(() => xml.parse('<![CDA', emptyOk));
  t.throws(() => xml.parse('<![CDAT', emptyOk));
  t.throws(() => xml.parse('<![CDATA', emptyOk));
  t.throws(() => xml.parse('<![CDATA[', emptyOk));
  t.throws(() => xml.parse('<![CDATA[]', emptyOk));
  t.throws(() => xml.parse('<![CDATA[data', emptyOk));
  t.throws(() => xml.parse('<![CDATA[data]', emptyOk));
  t.throws(() => xml.parse('<![CDATA[data]]', emptyOk));
  t.throws(() => xml.parse('<![CDATA[>', emptyOk));
  t.throws(() => xml.parse('<![CDATA[ <![CDATA[]]><![CDATA ]]>', emptyOk));
  t.end();
});
