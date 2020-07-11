const test = require('tape');
const xml = require('../lib');

test('getElementByTagName', t => {
  let dom = xml.parse('<a><b /></a>');
  t.is(dom.getElementsByTagName('a').length, 1);
  t.is(dom.getElementsByTagName('b').length, 1);

  dom = xml.parse('<a><b /><b /><b /><b /><b /><b /></a>');
  t.is(dom.getElementsByTagName('a').length, 1);
  t.is(dom.getElementsByTagName('b').length, 6);

  dom = xml.parse('<a><b><c><d><e><f /></e></d></c></b></a>');
  t.is(dom.getElementsByTagName('f').length, 1);
  t.is(dom.getElementsByTagName('d')[0].getElementsByTagName('f').length, 1);

  t.end();
});

test('getElementByTagName source order', t => {
  const dom = xml.parse(`
<a>
  <d o="1" />
  <b>
    <d o="2" />
    <c>
      <d o="3" />
    </c>
    <d o="4" />
  </b>
  <d o="5" />
  <b>
    <d o="6" />
    <d o="7" />
  </b>
  <d o="8" />
</a>
`);
  const m1 = dom.getElementsByTagName('d').map(d => +d.attr.o);
  t.deepEqual(m1, [ 1, 2, 3, 4, 5, 6, 7, 8 ]);

  t.end();
});
