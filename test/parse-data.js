/* eslint-disable quotes, quote-props, indent */
const test = require('tape');
const fs = require('fs');
const xml = require('../lib');

test('basic.xml', t => {
  const fileName = 'test/data/basic.xml';
  const expected = [ 'node', { attr: 'value' } ];
  const src = fs.readFileSync(fileName, 'utf8');
  const dom = xml.parse(src);
  t.deepEqual(dom.toJS(), expected, fileName);
  t.end();
});

test('large.xml', t => {
  const fileName = 'test/data/large.xml';
  const src = fs.readFileSync(fileName, 'utf8');
  const dom = xml.parse(src);
  t.is(dom.childNodes.length, 1);
  t.is(dom.childNodes[0].childNodes.length, 10000);
  t.end();
});

test('whitespace.xml', t => {
  const fileName = 'test/data/whitespace.xml';
  const expected = [
    "node",
    [ "a",
      { "xml:space": "preserve" },
      " ", [ "b", " ", [ "c", " c " ],  " b " ], " " ],
    [ "a",
      { "xml:space": "default" },
      [ "b", [ "c", " c " ], " b " ] ]
  ];
  const src = fs.readFileSync(fileName, 'utf8');
  const dom = xml.parse(src);
  t.deepEqual(dom.toJS(), expected);
  t.equal(dom.root.textContent, "   c  b   c  b ");
  t.end();
});

test('refs.xml', t => {
  const fileName = 'test/data/refs.xml';
  const expected = [
    'node',
    { enc: '< > & " \' \f «' },
    '\n\tpcdata < > & " \' \f «\n\t&unknown; %entity;\n'
  ];
  const src = fs.readFileSync(fileName, 'utf8');
  const dom = xml.parse(src);
  t.deepEqual(dom.toJS(), expected, fileName);
  t.end();
});

test('small.xml', t => {
  const fileName = 'test/data/small.xml';
  const expected = [ 'node' ];
  const src = fs.readFileSync(fileName, 'utf8');
  const dom = xml.parse(src);
  t.deepEqual(dom.toJS(), expected, fileName);
  t.end();
});

test('latintest.xml', t => {
  const fileName = 'test/data/latintest.xml';
  const expected = [
    'EXAMPLE',
    [ 'ORDER', { 'version': '1.0', 'xml:lang': 'de' },
      [ 'HEADER',
        [ 'X_ORDER_ID', '0000053535' ],
        [ 'CUSTOMER_ID', '1010' ],
        [ 'NAME_1', 'Müller' ],
        [ 'NAME_2', 'Jörg' ] ],
      [ 'ENTRIES',
        [ 'ENTRY',
          [ 'ARTICLE', '<Test>' ],
          [ 'ENTRY_NO', '10' ] ],
        [ 'ENTRY',
          [ 'ARTICLE', '<Test 2>' ],
          [ 'ENTRY_NO', '20' ] ] ],
      [ 'FOOTER',
        [ 'TEXT', 'This is a text.' ] ] ]
  ];
  const src = fs.readFileSync(fileName, 'utf8');
  const dom = xml.parse(src);
  t.deepEqual(dom.toJS(), expected, fileName);
  t.end();
});

test('truncation.xml', t => {
  const fileName = 'test/data/truncation.xml';
  const expected = [
    "mesh",
    { "name": "mesh_root" },
    "\n\tsome text\n\tsomeothertext\n\tsome more text\n\t",
    [ "node",
      { "attr1": "value1",
        "attr2": "value2" } ],
    [ "node",
      { "attr1": "value2" },
      [ "汉语",
        { "名字": "name",
          "价值": "value" },
        "世界有很多语言𤭢" ],
      [ "innernode" ] ],
    [ "氏名",
      [ "氏",
        "山田" ],
      [ "名",
        "太郎" ] ]
  ];
  const src = fs.readFileSync(fileName, 'utf8');
  const dom = xml.parse(src);
  t.deepEqual(dom.toJS(), expected, fileName);
  t.end();
});

test('types.xml', t => {
  const fileName = 'test/data/types.xml';
  const expected = [
    'node',
    { attr: 'value' },
    [ 'child' ],
    '\n\tpcdata\n\t test '
  ];
  const src = fs.readFileSync(fileName, 'utf8');
  const dom = xml.parse(src);
  t.deepEqual(dom.toJS(), expected, fileName);
  t.end();
});

test('utftest_utf8.xml', t => {
  const fileName = 'test/data/utftest_utf8.xml';
  const expected = [ "週報",
  [ "English",
    { "name": "name",
      "value": "value" },
    "The world has many languages" ],
  [ "Russian",
    { "name": "название(имя)",
      "value": "ценность" },
    "Мир имеет много языков" ],
  [ "Spanish",
    { "name": "el nombre",
      "value": "el valor" },
    "el mundo tiene muchos idiomas" ],
  [ "SimplifiedChinese",
    { "name": "名字",
      "value": "价值" },
    "世界有很多语言" ],
  [ "Русский",
    { "название": "name",
      "ценность": "value" },
    "<имеет>" ],
  [ "汉语",
    { "名字": "name",
      "价值": "value" },
    "世界有很多语言𤭢" ],
  [ "Heavy",
    "\"Mëtæl!\"" ],
  [ "ä",
    "Umlaut Element" ],
  [ "年月週",
    [ "年度",
      "1997" ],
    [ "月度",
      "1" ],
    [ "週",
      "1" ] ],
  [ "氏名",
    [ "氏",
      "山田" ],
    [ "名",
      "太郎" ] ],
  [ "業務報告リスト",
    [ "業務報告",
      [ "業務名",
        "XMLエディターの作成" ],
      [ "業務コード",
        "X3355-23" ],
      [ "工数管理",
        [ "見積もり工数",
          "1600" ],
        [ "実績工数",
          "320" ],
        [ "当月見積もり工数",
          "160" ],
        [ "当月実績工数",
          "24" ] ],
      [ "予定項目リスト",
        [ "予定項目",
          [ "P",
            "XMLエディターの基本仕様の作成" ] ] ],
      [ "実施事項リスト",
        [ "実施事項",
          [ "P",
            "XMLエディターの基本仕様の作成" ] ],
        [ "実施事項",
          [ "P",
            "競合他社製品の機能調査" ] ] ],
      [ "上長への要請事項リスト",
        [ "上長への要請事項",
          [ "P",
            "特になし" ] ] ],
      [ "問題点対策",
        [ "P",
          "XMLとは何かわからない。" ] ] ],
    [ "業務報告",
      [ "業務名",
        "検索エンジンの開発" ],
      [ "業務コード",
        "S8821-76" ],
      [ "工数管理",
        [ "見積もり工数",
          "120" ],
        [ "実績工数",
          "6" ],
        [ "当月見積もり工数",
          "32" ],
        [ "当月実績工数",
          "2" ] ],
      [ "予定項目リスト",
        [ "予定項目",
          [ "P",
            [ "A",
              { "href": "http://www.goo.ne.jp" },
              "goo" ],
            "の機能を調べてみる" ] ] ],
      [ "実施事項リスト",
        [ "実施事項",
          [ "P",
            "更に、どういう検索エンジンがあるか調査する" ] ] ],
      [ "上長への要請事項リスト",
        [ "上長への要請事項",
          [ "P",
            "開発をするのはめんどうなので、Yahoo!を買収して下さい。" ] ] ],
      [ "問題点対策",
        [ "P",
          "検索エンジンで車を走らせることができない。（要調査）" ] ] ] ] ];

  const src = fs.readFileSync(fileName, 'utf8');
  const dom = xml.parse(src);
  t.deepEqual(dom.toJS(), expected, fileName);
  t.end();
});

test('utftest_utf8_bom.xml', t => {
  const fileName = 'test/data/utftest_utf8_bom.xml';
  const expected = [ "週報",
  [ "English",
    { "name": "name",
      "value": "value" },
    "The world has many languages" ],
  [ "Russian",
    { "name": "название(имя)",
      "value": "ценность" },
    "Мир имеет много языков" ],
  [ "Spanish",
    { "name": "el nombre",
      "value": "el valor" },
    "el mundo tiene muchos idiomas" ],
  [ "SimplifiedChinese",
    { "name": "名字",
      "value": "价值" },
    "世界有很多语言" ],
  [ "Русский",
    { "название": "name",
      "ценность": "value" },
    "<имеет>" ],
  [ "汉语",
    { "名字": "name",
      "价值": "value" },
    "世界有很多语言𤭢" ],
  [ "Heavy",
    "\"Mëtæl!\"" ],
  [ "ä",
    "Umlaut Element" ],
  [ "年月週",
    [ "年度",
      "1997" ],
    [ "月度",
      "1" ],
    [ "週",
      "1" ] ],
  [ "氏名",
    [ "氏",
      "山田" ],
    [ "名",
      "太郎" ] ],
  [ "業務報告リスト",
    [ "業務報告",
      [ "業務名",
        "XMLエディターの作成" ],
      [ "業務コード",
        "X3355-23" ],
      [ "工数管理",
        [ "見積もり工数",
          "1600" ],
        [ "実績工数",
          "320" ],
        [ "当月見積もり工数",
          "160" ],
        [ "当月実績工数",
          "24" ] ],
      [ "予定項目リスト",
        [ "予定項目",
          [ "P",
            "XMLエディターの基本仕様の作成" ] ] ],
      [ "実施事項リスト",
        [ "実施事項",
          [ "P",
            "XMLエディターの基本仕様の作成" ] ],
        [ "実施事項",
          [ "P",
            "競合他社製品の機能調査" ] ] ],
      [ "上長への要請事項リスト",
        [ "上長への要請事項",
          [ "P",
            "特になし" ] ] ],
      [ "問題点対策",
        [ "P",
          "XMLとは何かわからない。" ] ] ],
    [ "業務報告",
      [ "業務名",
        "検索エンジンの開発" ],
      [ "業務コード",
        "S8821-76" ],
      [ "工数管理",
        [ "見積もり工数",
          "120" ],
        [ "実績工数",
          "6" ],
        [ "当月見積もり工数",
          "32" ],
        [ "当月実績工数",
          "2" ] ],
      [ "予定項目リスト",
        [ "予定項目",
          [ "P",
            [ "A",
              { "href": "http://www.goo.ne.jp" },
              "goo" ],
            "の機能を調べてみる" ] ] ],
      [ "実施事項リスト",
        [ "実施事項",
          [ "P",
            "更に、どういう検索エンジンがあるか調査する" ] ] ],
      [ "上長への要請事項リスト",
        [ "上長への要請事項",
          [ "P",
            "開発をするのはめんどうなので、Yahoo!を買収して下さい。" ] ] ],
      [ "問題点対策",
        [ "P",
          "検索エンジンで車を走らせることができない。（要調査）" ] ] ] ] ];
  const src = fs.readFileSync(fileName, 'utf8');
  const dom = xml.parse(src);
  t.deepEqual(dom.toJS(), expected, fileName);
  t.end();
});

test('utftest_utf8_clean.xml', t => {
  const fileName = 'test/data/utftest_utf8_clean.xml';
  const expected = [ "週報",
  [ "English",
    { "name": "name",
      "value": "value" },
    "The world has many languages" ],
  [ "Russian",
    { "name": "название(имя)",
      "value": "ценность" },
    "Мир имеет много языков" ],
  [ "Spanish",
    { "name": "el nombre",
      "value": "el valor" },
    "el mundo tiene muchos idiomas" ],
  [ "SimplifiedChinese",
    { "name": "名字",
      "value": "价值" },
    "世界有很多语言" ],
  [ "Русский",
    { "название": "name",
      "ценность": "value" },
    "<имеет>" ],
  [ "汉语",
    { "名字": "name",
      "价值": "value" },
    "世界有很多语言𤭢" ],
  [ "Heavy",
    "quot;Mëtæl!quot;" ],
  [ "ä",
    "Umlaut Element" ],
  [ "年月週",
    [ "年度",
      "1997" ],
    [ "月度",
      "1" ],
    [ "週",
      "1" ] ],
  [ "氏名",
    [ "氏",
      "山田" ],
    [ "名",
      "太郎" ] ],
  [ "業務報告リスト",
    [ "業務報告",
      [ "業務名",
        "XMLエディターの作成" ],
      [ "業務コード",
        "X3355-23" ],
      [ "工数管理",
        [ "見積もり工数",
          "1600" ],
        [ "実績工数",
          "320" ],
        [ "当月見積もり工数",
          "160" ],
        [ "当月実績工数",
          "24" ] ],
      [ "予定項目リスト",
        [ "予定項目",
          [ "P",
            "XMLエディターの基本仕様の作成" ] ] ],
      [ "実施事項リスト",
        [ "実施事項",
          [ "P",
            "XMLエディターの基本仕様の作成" ] ],
        [ "実施事項",
          [ "P",
            "競合他社製品の機能調査" ] ] ],
      [ "上長への要請事項リスト",
        [ "上長への要請事項",
          [ "P",
            "特になし" ] ] ],
      [ "問題点対策",
        [ "P",
          "XMLとは何かわからない。" ] ] ],
    [ "業務報告",
      [ "業務名",
        "検索エンジンの開発" ],
      [ "業務コード",
        "S8821-76" ],
      [ "工数管理",
        [ "見積もり工数",
          "120" ],
        [ "実績工数",
          "6" ],
        [ "当月見積もり工数",
          "32" ],
        [ "当月実績工数",
          "2" ] ],
      [ "予定項目リスト",
        [ "予定項目",
          [ "P",
            [ "A",
              { "href": "http://www.goo.ne.jp" },
              "goo" ],
            "の機能を調べてみる" ] ] ],
      [ "実施事項リスト",
        [ "実施事項",
          [ "P",
            "更に、どういう検索エンジンがあるか調査する" ] ] ],
      [ "上長への要請事項リスト",
        [ "上長への要請事項",
          [ "P",
            "開発をするのはめんどうなので、Yahoo!を買収して下さい。" ] ] ],
      [ "問題点対策",
        [ "P",
          "検索エンジンで車を走らせることができない。（要調査）" ] ] ] ] ];
  const src = fs.readFileSync(fileName, 'utf8');
  const dom = xml.parse(src);
  t.deepEqual(dom.toJS(), expected, fileName);
  t.end();
});

test('utftest_utf8_nodecl.xml', t => {
  const fileName = 'test/data/utftest_utf8_nodecl.xml';
  const expected = [ "週報",
  [ "English",
    { "name": "name",
      "value": "value" },
    "The world has many languages" ],
  [ "Russian",
    { "name": "название(имя)",
      "value": "ценность" },
    "Мир имеет много языков" ],
  [ "Spanish",
    { "name": "el nombre",
      "value": "el valor" },
    "el mundo tiene muchos idiomas" ],
  [ "SimplifiedChinese",
    { "name": "名字",
      "value": "价值" },
    "世界有很多语言" ],
  [ "Русский",
    { "название": "name",
      "ценность": "value" },
    "<имеет>" ],
  [ "汉语",
    { "名字": "name",
      "价值": "value" },
    "世界有很多语言𤭢" ],
  [ "Heavy",
    "\"Mëtæl!\"" ],
  [ "ä",
    "Umlaut Element" ],
  [ "年月週",
    [ "年度",
      "1997" ],
    [ "月度",
      "1" ],
    [ "週",
      "1" ] ],
  [ "氏名",
    [ "氏",
      "山田" ],
    [ "名",
      "太郎" ] ],
  [ "業務報告リスト",
    [ "業務報告",
      [ "業務名",
        "XMLエディターの作成" ],
      [ "業務コード",
        "X3355-23" ],
      [ "工数管理",
        [ "見積もり工数",
          "1600" ],
        [ "実績工数",
          "320" ],
        [ "当月見積もり工数",
          "160" ],
        [ "当月実績工数",
          "24" ] ],
      [ "予定項目リスト",
        [ "予定項目",
          [ "P",
            "XMLエディターの基本仕様の作成" ] ] ],
      [ "実施事項リスト",
        [ "実施事項",
          [ "P",
            "XMLエディターの基本仕様の作成" ] ],
        [ "実施事項",
          [ "P",
            "競合他社製品の機能調査" ] ] ],
      [ "上長への要請事項リスト",
        [ "上長への要請事項",
          [ "P",
            "特になし" ] ] ],
      [ "問題点対策",
        [ "P",
          "XMLとは何かわからない。" ] ] ],
    [ "業務報告",
      [ "業務名",
        "検索エンジンの開発" ],
      [ "業務コード",
        "S8821-76" ],
      [ "工数管理",
        [ "見積もり工数",
          "120" ],
        [ "実績工数",
          "6" ],
        [ "当月見積もり工数",
          "32" ],
        [ "当月実績工数",
          "2" ] ],
      [ "予定項目リスト",
        [ "予定項目",
          [ "P",
            [ "A",
              { "href": "http://www.goo.ne.jp" },
              "goo" ],
            "の機能を調べてみる" ] ] ],
      [ "実施事項リスト",
        [ "実施事項",
          [ "P",
            "更に、どういう検索エンジンがあるか調査する" ] ] ],
      [ "上長への要請事項リスト",
        [ "上長への要請事項",
          [ "P",
            "開発をするのはめんどうなので、Yahoo!を買収して下さい。" ] ] ],
      [ "問題点対策",
        [ "P",
          "検索エンジンで車を走らせることができない。（要調査）" ] ] ] ] ];
  const src = fs.readFileSync(fileName, 'utf8');
  const dom = xml.parse(src);
  t.deepEqual(dom.toJS(), expected, fileName);
  t.end();
});


