# Overly simplistic XML parser

This is an overly simplistic non-validating XML parser with utilities. It will indiscriminately parse most well-formed XML documents that don't try to do anything clever.

The purpose of this library to allow easy parsing and consuming XML files. Does the world really need it? No, probably not. But all the other available packages the author tested were either a *massive* overkill or failed to parse fairly simplistic XML correctly. So here we are.

There are some limitations:

- Comments are discarded.
- Processing instructions are discarded.
- Namespace prefixes are preserved but otherwise ignored.
- Doctypes are discarded.
- Nested doctypes are not supported and will cause errors.
- Nodes have a limited interface.
- Made for a node.js environment with no browser build provided.

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
console.log(dom.getElementsByTagName('node').textContent);
```

The parse function accepts two arguments, the first is an XML source. The second is an options object. There are two options:

Allow normally forbidden unquoted attributes with `laxAttr`:

```js
parseXML('<root><node foo=bar /></root>', { laxAttr: true });
```

Allow normally forbidden "rootless" documents with `emptyDoc`:

```js
parseXML('', { emptyDoc: true });
```

As well as a parse method, the package exports Node classes: Node, Element, Document, TextNode, and CDataNode. They are pretty much what you expect but with an incomplete or altered set of DOM API functions.

[See the API documentation.](API.md)

### Nodes have the following methods and properties

**Name & identity**

* `.nodeName`
  An __uppercase__ tag name. (`BAR` in the case of `<foo:bar>`)

* `.tagName`
  A case preserved tag (`bar` in the case of `<foo:bar>`)

* `.nodeType`
  A node type number (e.g. `Element.ELEMENT_NODE === 1`)

* `.ns`
  A namespace identifier (`foo` in the case of `<foo:bar>`)

* `.fullName`
  A full tag name with identifier (`foo:bar` in the case of `<foo:bar>`)

**Attributes**

* `.getAttribute( attrName )`
* `.setAttribute( attrName, attrValue )`
* `.hasAttribute( attrName )`
* `.removeAttribute( attrName )`

Attributes are not stored as attribute nodes in a list, but rather they are a simple `{ name: value }` style object on the node.

**Tree & traversal**

* `.appendChild( Node )`
  Inserts a new node as the last child of a parent. If a node already has a parent, it is removed from that parent when inserted in the target.

* `.children`
  Emits an array of direct child nodes that are of type Element.

* `.parentNode`
  A direct reference to the node's container.

* `.childNodes`
  An array of all direct child nodes.

* `.textContent`
  Emits the text content of the target's subtree.

  Text is preserved as-is in the tree but whitespace is cleaned (unless `xml:space` dictates otherwise) when using `.textContent`.

* `.getElementsByTagName( tagName )`
  Lists all Elements in the target's subtree, traversal order, that have `.tagName` equal to the argument. Function is case-sensitive.

* `.querySelectorAll( cssSelector )`
  Lists all Elements in the target's subtree, traversal order, that match the supplied CSS selector. Function should be case-sensitive but may be case insensitive for some.

* `.toJS()`
  Returns the target node's subtree in a [JsonML](https://en.wikipedia.org/wiki/JsonML)-like structure.

Roughly, if you supply this:

```xml
<x:tag foo="bar">Text content</x:tag>
```

It will parse to a document which has a `.root` node looking roughly like this:

```js
{
  nodeType: 1,
  nodeName: 'TAG',
  ns: 'x',
  tagName: 'tag',
  fullName: 'x:tag',
  attr: { 'foo': 'bar' }
  parentNode: null,
  childNodes = [
    {
      nodeName: '#text',
      nodeType: 3,
      value: 'Text content',
      parentNode: {...},
    }
  ]
}
```

