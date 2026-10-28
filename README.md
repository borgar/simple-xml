# Simple XML parser

This is a simple mostly non-validating XML parser with utilities. It will indiscriminately parse most semi-well-formed XML documents that don't try to do anything too clever.

The purpose of this library to allow easy parsing and consuming XML files. Does the world really need it? Probably not. But all the other available packages the author tested were either a *massive* overkill or failed to parse fairly simplistic XML correctly. So here we are.

There are some limitations:

- Comments are discarded.
- Processing instructions are discarded.
- Namespace prefixes are preserved on every node; full xmlns validation is opt-in via an option.
- Doctypes are discarded.
- Nested doctypes are not supported and will cause errors.
- Nodes have a subset of the browser DOM interface.

But on the upside:

- Built in selector engine.
- No dependencies.


## Installing

The usual:

```bash
$ npm i @borgar/simple-xml
```

## Parsing XML

```js
import { parseXML } from '@borgar/simple-xml';

const dom = parseXML('<root><node>Lorem ipsum</node></root>');
console.log(dom.querySelector('node').textContent);
```

The parse function accepts two arguments, the first is an XML source. The second is an options object. There are three options:

Allow normally forbidden unquoted attributes with `laxAttr`:

```js
parseXML('<root><node foo=bar /></root>', { laxAttr: true });
```

Allow normally forbidden "rootless" documents with `emptyDoc`:

```js
parseXML('', { emptyDoc: true });
```

Validate `xmlns` declarations and element/attribute prefixes against them with `ns`. Declarations apply to the element they're on and its descendants. With this flag, a prefix used outside the scope of its declaration, or a misused `xml` or `xmlns` prefix, throws a `NamespaceError`:

```js
parseXML('<root xmlns:x="urn:example"><x:node /></root>', { ns: true });
```

As well as a parse method, the package exports the node classes (`Node`, `Element`, `Document`, `DocumentFragment`, `TextNode`, `CDataNode`), serialization helpers (`prettyPrint`, `simplePrint`, `escapeXML`), the `isElement` type guard, and an error hierarchy rooted at `XMLError` (`ParserError`, `NamespaceError`, `HierarchyError`, `NotFoundError`, `InUseAttributeError`, `InvalidCharacterError`).

[See the API documentation.](API.md)
