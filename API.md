
<a name="readmemd"></a>

# @borgar/simple-xml

## Classes

- [Attr](#classesattrmd)
- [CDataNode](#classescdatanodemd)
- [Document](#classesdocumentmd)
- [DocumentFragment](#classesdocumentfragmentmd)
- [Element](#classeselementmd)
- [HierarchyError](#classeshierarchyerrormd)
- [InUseAttributeError](#classesinuseattributeerrormd)
- [InvalidCharacterError](#classesinvalidcharactererrormd)
- [NamespaceError](#classesnamespaceerrormd)
- [Node](#classesnodemd)
- [NotFoundError](#classesnotfounderrormd)
- [ParserError](#classesparsererrormd)
- [TextNode](#classestextnodemd)
- [XMLError](#classesxmlerrormd)

## Type Aliases

- [CreateChildArgument](#type-aliasescreatechildargumentmd)
- [JsonMLAttr](#type-aliasesjsonmlattrmd)
- [JsonMLElement](#type-aliasesjsonmlelementmd)
- [NamedNodeMap](#type-aliasesnamednodemapmd)
- [XMLAttr](#type-aliasesxmlattrmd)

## Variables

- [ATTRIBUTE\_NODE](#variablesattribute_nodemd)
- [CDATA\_SECTION\_NODE](#variablescdata_section_nodemd)
- [COMMENT\_NODE](#variablescomment_nodemd)
- [DOCUMENT\_FRAGMENT\_NODE](#variablesdocument_fragment_nodemd)
- [DOCUMENT\_NODE](#variablesdocument_nodemd)
- [DOCUMENT\_TYPE\_NODE](#variablesdocument_type_nodemd)
- [ELEMENT\_NODE](#variableselement_nodemd)
- [ENTITY\_NODE](#variablesentity_nodemd)
- [ENTITY\_REFERENCE\_NODE](#variablesentity_reference_nodemd)
- [NOTATION\_NODE](#variablesnotation_nodemd)
- [PROCESSING\_INSTRUCTION\_NODE](#variablesprocessing_instruction_nodemd)
- [TEXT\_NODE](#variablestext_nodemd)
- [XML\_DECLARATION](#variablesxml_declarationmd)

## Functions

- [escapeXML](#functionsescapexmlmd)
- [isElement](#functionsiselementmd)
- [parseXML](#functionsparsexmlmd)
- [prettyPrint](#functionsprettyprintmd)
- [simplePrint](#functionssimpleprintmd)


<a name="classesattrmd"></a>

# Attr

A class describing an attribute.

## Extends

- [`Node`](#classesnodemd)

## Constructors

### Constructor

```ts
new Attr(name: string, value: any): Attr;
```

Constructs a new Attr instance.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `name` | `string` | The name of the attribute. |
| `value` | `any` | The data of the attribute. |

#### Returns

`Attr`

#### Overrides

[`Node`](#classesnodemd).[`constructor`](#constructor)

## Properties

| Property | Type | Default value | Description | Inherited from |
| ------ | ------ | ------ | ------ | ------ |
| <a id="childnodes"></a> `childNodes` | [`Node`](#classesnodemd)[] | `[]` | The node's immediate children. | [`Node`](#classesnodemd).[`childNodes`](#childnodes) |
| <a id="localname"></a> `localName` | `string` | `undefined` | The name of the tag for the given attribute, excluding any namespace prefix. | - |
| <a id="name"></a> `name` | `string` | `undefined` | The qualified name of the attribute, including any namespace prefix. | - |
| <a id="nodename"></a> `nodeName` | `string` | `'#node'` | A node type string identifier. | [`Node`](#classesnodemd).[`nodeName`](#nodename) |
| <a id="nodetype"></a> `nodeType` | `number` | `0` | A numerical node type identifier. | [`Node`](#classesnodemd).[`nodeType`](#nodetype) |
| <a id="parentnode"></a> `parentNode` | [`Node`](#classesnodemd) \| `null` | `null` | The node's parent node. | [`Document`](#classesdocumentmd).[`parentNode`](#parentnode) |
| <a id="prefix"></a> `prefix` | `string` \| `null` | `undefined` | The namespace prefix of the attribute, or null if no prefix is specified. | - |
| <a id="value"></a> `value` | `string` | `undefined` | The attribute's data value. | - |

## Accessors

### firstChild

#### Get Signature

```ts
get firstChild(): Node | null;
```

Returns the node's first child in the tree, or null if the node has no children.

##### Returns

[`Node`](#classesnodemd) \| `null`

#### Inherited from

[`CDataNode`](#classescdatanodemd).[`firstChild`](#firstchild)

***

### fullName

#### Get Signature

```ts
get fullName(): string;
```

The full name of the given attribute, including a namespace prefix.

##### Returns

`string`

***

### lastChild

#### Get Signature

```ts
get lastChild(): Node | null;
```

Returns the node's last child in the tree, or null if the node has no children.

##### Returns

[`Node`](#classesnodemd) \| `null`

#### Inherited from

[`CDataNode`](#classescdatanodemd).[`lastChild`](#lastchild)

***

### namespaceURI

#### Get Signature

```ts
get namespaceURI(): string | null;
```

The namespace URI of the attribute, or null if it has none. Unprefixed
attributes have no namespace, even when the element has a default
namespace. Other prefixes are resolved from the `xmlns` declarations on
the owner element and its ancestors.

##### Returns

`string` \| `null`

***

### ownerElement

#### Get Signature

```ts
get ownerElement(): Element | null;
```

The element the attribute belongs to, or null if it isn't on an element.

##### Returns

[`Element`](#classeselementmd) \| `null`

***

### preserveSpace

#### Get Signature

```ts
get preserveSpace(): boolean;
```

True if xml:space has been set to true for this node or any of its ancestors.

##### Returns

`boolean`

#### Inherited from

[`Node`](#classesnodemd).[`preserveSpace`](#preservespace)

***

### textContent

#### Get Signature

```ts
get textContent(): string;
```

The text content of this node (and its children).

##### Returns

`string`

#### Inherited from

[`Node`](#classesnodemd).[`textContent`](#textcontent)

## Methods

### appendChild()

```ts
appendChild<T extends Node | DocumentFragment>(this: Node, node: T): T;
```

Appends a child node into the current one.

#### Type Parameters

| Type Parameter |
| ------ |
| <a id="type-parameter-t"></a> `T` *extends* [`Node`](#classesnodemd) \| [`DocumentFragment`](#classesdocumentfragmentmd) |

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `this` | [`Node`](#classesnodemd) | - |
| `node` | `T` | The new child node |

#### Returns

`T`

The same node that was passed in.

#### Inherited from

[`Node`](#classesnodemd).[`appendChild`](#appendchild)

***

### insertBefore()

```ts
insertBefore<T extends Node | DocumentFragment>(newNode: T, referenceNode: Node | null): T;
```

Inserts a node before a _reference node_ as a child of a specified _parent node_.

#### Type Parameters

| Type Parameter |
| ------ |
| <a id="type-parameter-t-1"></a> `T` *extends* [`Node`](#classesnodemd) \| [`DocumentFragment`](#classesdocumentfragmentmd) |

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `newNode` | `T` | The node to be inserted. |
| `referenceNode` | [`Node`](#classesnodemd) \| `null` | The node before which newNode is inserted. If this is null, then newNode is inserted at the end of node's child nodes. |

#### Returns

`T`

The node or DocumentFragment that was passed in.

#### Throws

If newNode is this node or one of its ancestors.

#### Throws

If referenceNode is not a child of this node.

#### Inherited from

[`Node`](#classesnodemd).[`insertBefore`](#insertbefore)

***

### isDefaultNamespace()

```ts
isDefaultNamespace(namespaceURI: string | null): boolean;
```

Test if a namespace URI is the default namespace at this node.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `namespaceURI` | `string` \| `null` | The namespace URI to test, or null for no namespace. |

#### Returns

`boolean`

True if unprefixed elements here belong to the namespace.

#### Inherited from

[`Node`](#classesnodemd).[`isDefaultNamespace`](#isdefaultnamespace)

***

### isEqualNode()

```ts
isEqualNode(otherNode: Node | DocumentFragment | null): boolean;
```

Test if a node is equal to this one, as in the DOM. Nodes are equal if
they are of the same type, have the same names, namespaces, and data,
have the same attributes in any order, and have equal children in the
same order. Parents and owner elements are not compared, so equal
subtrees in different places, or different documents, are equal.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `otherNode` | [`Node`](#classesnodemd) \| [`DocumentFragment`](#classesdocumentfragmentmd) \| `null` | The node to compare with. |

#### Returns

`boolean`

True if the nodes are equal.

#### Inherited from

[`Node`](#classesnodemd).[`isEqualNode`](#isequalnode)

***

### lookupNamespaceURI()

```ts
lookupNamespaceURI(prefix: string | null): string | null;
```

Find the namespace URI that a prefix is bound to. As in the DOM, elements
resolve it from their own `xmlns` declarations and their ancestors', and
other nodes ask an element: a document its root, an attribute its owner
element, and anything else its parent element.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `prefix` | `string` \| `null` | The prefix to look up, or null for the default namespace. |

#### Returns

`string` \| `null`

The namespace URI, or null if the prefix is not bound.

#### Inherited from

[`Node`](#classesnodemd).[`lookupNamespaceURI`](#lookupnamespaceuri)

***

### lookupPrefix()

```ts
lookupPrefix(namespaceURI: string | null): string | null;
```

Find a prefix that is bound to a namespace URI. Nodes other than elements
ask an element, as `lookupNamespaceURI` does.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `namespaceURI` | `string` \| `null` | The namespace URI to look up. |

#### Returns

`string` \| `null`

The prefix, or null if no prefix is bound to the namespace.

#### Inherited from

[`Node`](#classesnodemd).[`lookupPrefix`](#lookupprefix)

***

### removeChild()

```ts
removeChild(child: Node): Node | undefined;
```

Removes a child node from the DOM and returns the removed node.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `child` | [`Node`](#classesnodemd) | The child node to be removed. |

#### Returns

[`Node`](#classesnodemd) \| `undefined`

The removed child node.

#### Inherited from

[`Node`](#classesnodemd).[`removeChild`](#removechild)

***

### toString()

```ts
toString(): string;
```

Returns a string representation of the node.

#### Returns

`string`

A formatted XML source.

#### Inherited from

[`Node`](#classesnodemd).[`toString`](#tostring)


<a name="classescdatanodemd"></a>

# CDataNode

A class describing an CDataNode.

## Extends

- [`Node`](#classesnodemd)

## Constructors

### Constructor

```ts
new CDataNode(value?: string): CDataNode;
```

Constructs a new CDataNode instance.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `value?` | `string` | `''` | The data for the node |

#### Returns

`CDataNode`

#### Overrides

[`Node`](#classesnodemd).[`constructor`](#constructor)

## Properties

| Property | Type | Default value | Description | Inherited from |
| ------ | ------ | ------ | ------ | ------ |
| <a id="childnodes"></a> `childNodes` | [`Node`](#classesnodemd)[] | `[]` | The node's immediate children. | [`Node`](#classesnodemd).[`childNodes`](#childnodes) |
| <a id="nodename"></a> `nodeName` | `string` | `'#node'` | A node type string identifier. | [`Node`](#classesnodemd).[`nodeName`](#nodename) |
| <a id="nodetype"></a> `nodeType` | `number` | `0` | A numerical node type identifier. | [`Node`](#classesnodemd).[`nodeType`](#nodetype) |
| <a id="parentnode"></a> `parentNode` | [`Node`](#classesnodemd) \| `null` | `null` | The node's parent node. | [`Node`](#classesnodemd).[`parentNode`](#parentnode) |
| <a id="value"></a> `value` | `string` | `undefined` | The nodes data value. | - |

## Accessors

### firstChild

#### Get Signature

```ts
get firstChild(): Node | null;
```

Returns the node's first child in the tree, or null if the node has no children.

##### Returns

[`Node`](#classesnodemd) \| `null`

#### Inherited from

[`Node`](#classesnodemd).[`firstChild`](#firstchild)

***

### lastChild

#### Get Signature

```ts
get lastChild(): Node | null;
```

Returns the node's last child in the tree, or null if the node has no children.

##### Returns

[`Node`](#classesnodemd) \| `null`

#### Inherited from

[`Node`](#classesnodemd).[`lastChild`](#lastchild)

***

### preserveSpace

#### Get Signature

```ts
get preserveSpace(): boolean;
```

True if xml:space has been set to true for this node or any of its ancestors.

##### Returns

`boolean`

#### Inherited from

[`Node`](#classesnodemd).[`preserveSpace`](#preservespace)

***

### textContent

#### Get Signature

```ts
get textContent(): string;
```

The text content of this node (and its children).

##### Returns

`string`

#### Overrides

[`Node`](#classesnodemd).[`textContent`](#textcontent)

## Methods

### appendChild()

```ts
appendChild<T extends Node | DocumentFragment>(this: Node, node: T): T;
```

Appends a child node into the current one.

#### Type Parameters

| Type Parameter |
| ------ |
| <a id="type-parameter-t"></a> `T` *extends* [`Node`](#classesnodemd) \| [`DocumentFragment`](#classesdocumentfragmentmd) |

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `this` | [`Node`](#classesnodemd) | - |
| `node` | `T` | The new child node |

#### Returns

`T`

The same node that was passed in.

#### Inherited from

[`Node`](#classesnodemd).[`appendChild`](#appendchild)

***

### insertBefore()

```ts
insertBefore<T extends Node | DocumentFragment>(newNode: T, referenceNode: Node | null): T;
```

Inserts a node before a _reference node_ as a child of a specified _parent node_.

#### Type Parameters

| Type Parameter |
| ------ |
| <a id="type-parameter-t-1"></a> `T` *extends* [`Node`](#classesnodemd) \| [`DocumentFragment`](#classesdocumentfragmentmd) |

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `newNode` | `T` | The node to be inserted. |
| `referenceNode` | [`Node`](#classesnodemd) \| `null` | The node before which newNode is inserted. If this is null, then newNode is inserted at the end of node's child nodes. |

#### Returns

`T`

The node or DocumentFragment that was passed in.

#### Throws

If newNode is this node or one of its ancestors.

#### Throws

If referenceNode is not a child of this node.

#### Inherited from

[`Node`](#classesnodemd).[`insertBefore`](#insertbefore)

***

### isDefaultNamespace()

```ts
isDefaultNamespace(namespaceURI: string | null): boolean;
```

Test if a namespace URI is the default namespace at this node.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `namespaceURI` | `string` \| `null` | The namespace URI to test, or null for no namespace. |

#### Returns

`boolean`

True if unprefixed elements here belong to the namespace.

#### Inherited from

[`Node`](#classesnodemd).[`isDefaultNamespace`](#isdefaultnamespace)

***

### isEqualNode()

```ts
isEqualNode(otherNode: Node | DocumentFragment | null): boolean;
```

Test if a node is equal to this one, as in the DOM. Nodes are equal if
they are of the same type, have the same names, namespaces, and data,
have the same attributes in any order, and have equal children in the
same order. Parents and owner elements are not compared, so equal
subtrees in different places, or different documents, are equal.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `otherNode` | [`Node`](#classesnodemd) \| [`DocumentFragment`](#classesdocumentfragmentmd) \| `null` | The node to compare with. |

#### Returns

`boolean`

True if the nodes are equal.

#### Inherited from

[`Node`](#classesnodemd).[`isEqualNode`](#isequalnode)

***

### lookupNamespaceURI()

```ts
lookupNamespaceURI(prefix: string | null): string | null;
```

Find the namespace URI that a prefix is bound to. As in the DOM, elements
resolve it from their own `xmlns` declarations and their ancestors', and
other nodes ask an element: a document its root, an attribute its owner
element, and anything else its parent element.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `prefix` | `string` \| `null` | The prefix to look up, or null for the default namespace. |

#### Returns

`string` \| `null`

The namespace URI, or null if the prefix is not bound.

#### Inherited from

[`Node`](#classesnodemd).[`lookupNamespaceURI`](#lookupnamespaceuri)

***

### lookupPrefix()

```ts
lookupPrefix(namespaceURI: string | null): string | null;
```

Find a prefix that is bound to a namespace URI. Nodes other than elements
ask an element, as `lookupNamespaceURI` does.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `namespaceURI` | `string` \| `null` | The namespace URI to look up. |

#### Returns

`string` \| `null`

The prefix, or null if no prefix is bound to the namespace.

#### Inherited from

[`Node`](#classesnodemd).[`lookupPrefix`](#lookupprefix)

***

### removeChild()

```ts
removeChild(child: Node): Node | undefined;
```

Removes a child node from the DOM and returns the removed node.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `child` | [`Node`](#classesnodemd) | The child node to be removed. |

#### Returns

[`Node`](#classesnodemd) \| `undefined`

The removed child node.

#### Inherited from

[`Node`](#classesnodemd).[`removeChild`](#removechild)

***

### toString()

```ts
toString(): string;
```

Returns a string representation of the node.

#### Returns

`string`

A formatted XML source.

#### Inherited from

[`Node`](#classesnodemd).[`toString`](#tostring)


<a name="classesdocumentmd"></a>

# Document

This class describes an XML document.

## Extends

- [`Node`](#classesnodemd)

## Constructors

### Constructor

```ts
new Document(): Document;
```

Constructs a new Document instance.

#### Returns

`Document`

#### Overrides

[`Node`](#classesnodemd).[`constructor`](#constructor)

## Properties

| Property | Type | Default value | Description | Inherited from |
| ------ | ------ | ------ | ------ | ------ |
| <a id="childnodes"></a> `childNodes` | [`Node`](#classesnodemd)[] | `[]` | The node's immediate children. | [`Node`](#classesnodemd).[`childNodes`](#childnodes) |
| <a id="nodename"></a> `nodeName` | `string` | `'#node'` | A node type string identifier. | [`Node`](#classesnodemd).[`nodeName`](#nodename) |
| <a id="nodetype"></a> `nodeType` | `number` | `0` | A numerical node type identifier. | [`Node`](#classesnodemd).[`nodeType`](#nodetype) |
| <a id="parentnode"></a> `parentNode` | [`Node`](#classesnodemd) \| `null` | `null` | The node's parent node. | [`Node`](#classesnodemd).[`parentNode`](#parentnode) |

## Accessors

### children

#### Get Signature

```ts
get children(): Element[];
```

A list containing all child Elements of the current Element.

##### Returns

[`Element`](#classeselementmd)[]

***

### firstChild

#### Get Signature

```ts
get firstChild(): Node | null;
```

Returns the node's first child in the tree, or null if the node has no children.

##### Returns

[`Node`](#classesnodemd) \| `null`

#### Inherited from

[`Node`](#classesnodemd).[`firstChild`](#firstchild)

***

### lastChild

#### Get Signature

```ts
get lastChild(): Node | null;
```

Returns the node's last child in the tree, or null if the node has no children.

##### Returns

[`Node`](#classesnodemd) \| `null`

#### Inherited from

[`Node`](#classesnodemd).[`lastChild`](#lastchild)

***

### preserveSpace

#### Get Signature

```ts
get preserveSpace(): boolean;
```

True if xml:space has been set to true for this node or any of its ancestors.

##### Returns

`boolean`

#### Inherited from

[`Node`](#classesnodemd).[`preserveSpace`](#preservespace)

***

### root

#### Get Signature

```ts
get root(): Element | null;
```

The root element of the document, or null if it has none.
Assigning an element replaces the current root and declares the
document's namespaces on it. Assigning null removes the root.

##### Returns

[`Element`](#classeselementmd) \| `null`

#### Set Signature

```ts
set root(element: Element | null): void;
```

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `element` | [`Element`](#classeselementmd) \| `null` |

##### Returns

`void`

***

### textContent

#### Get Signature

```ts
get textContent(): string;
```

The text content of this node (and its children).

##### Returns

`string`

#### Overrides

[`Node`](#classesnodemd).[`textContent`](#textcontent)

## Methods

### appendChild()

```ts
appendChild<T extends Node | DocumentFragment>(node: T): T;
```

Appends a child node into the current one.

#### Type Parameters

| Type Parameter |
| ------ |
| <a id="type-parameter-t"></a> `T` *extends* [`Node`](#classesnodemd) \| [`DocumentFragment`](#classesdocumentfragmentmd) |

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `node` | `T` | The new child node |

#### Returns

`T`

The same node that was passed in.

#### Overrides

[`Node`](#classesnodemd).[`appendChild`](#appendchild)

***

### attachNS()

```ts
attachNS(namespaceURI: string, prefix?: string): (name: string, attr?: XMLAttr | null, ...children: (
  | CreateChildArgument
  | CreateChildArgument[])[]) => Element;
```

Attach a namespace to the document.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `namespaceURI` | `string` | `undefined` | The namespace URI to attach. |
| `prefix?` | `string` | `''` | Prefix to use on elements belonging to the namespace. |

#### Returns

(`name`: `string`, `attr?`: [`XMLAttr`](#type-aliasesxmlattrmd) \| `null`, ...`children`: (
  \| [`CreateChildArgument`](#type-aliasescreatechildargumentmd)
  \| [`CreateChildArgument`](#type-aliasescreatechildargumentmd)[])[]) => [`Element`](#classeselementmd)

***

### createElement()

```ts
createElement(
   qualifiedName: string, 
   attr?: XMLAttr | null, 
   ...children: (
  | CreateChildArgument
  | CreateChildArgument[])[]
): Element;
```

Create a new element node.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `qualifiedName` | `string` | The local tagName of the element. |
| `attr?` | [`XMLAttr`](#type-aliasesxmlattrmd) \| `null` | A record of attributes to assign to the new element. If the value is null or undefined, the attribute will be omitted. |
| ...`children?` | ( \| [`CreateChildArgument`](#type-aliasescreatechildargumentmd) \| [`CreateChildArgument`](#type-aliasescreatechildargumentmd)[])[] | Nodes to insert as children. Strings will be converted to TextNodes and arrays will be flattened. |

#### Returns

[`Element`](#classeselementmd)

A new Element instance.

#### Throws

If attr is not an object, or looks like a child (an array or a node).

***

### createElementNS()

```ts
createElementNS(
   namespaceURI: string | null, 
   qualifiedName: string, 
   attr?: XMLAttr | null, 
   ...children: (
  | CreateChildArgument
  | CreateChildArgument[])[]
): Element;
```

Create a new element node associated with a given namespace.

If the name has a prefix, it is used as given, and the caller is
responsible for declaring it. Otherwise, the prefix comes from a namespace
attached with `attachNS`, or from the declarations on the root element.
With no namespace, the element has no prefix. To create an element in
place, with any missing declarations added, use `Element.createChildNS`.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `namespaceURI` | `string` \| `null` | The namespaceURI to associate with the element, or null or an empty string for no namespace. |
| `qualifiedName` | `string` | The tagName of the element, with or without a prefix. |
| `attr?` | [`XMLAttr`](#type-aliasesxmlattrmd) \| `null` | A record of attributes to assign to the new element. If the value is null or undefined, the attribute will be omitted. |
| ...`children?` | ( \| [`CreateChildArgument`](#type-aliasescreatechildargumentmd) \| [`CreateChildArgument`](#type-aliasescreatechildargumentmd)[])[] | Nodes to insert as children. Strings will be converted to TextNodes and arrays will be flattened. |

#### Returns

[`Element`](#classeselementmd)

A new Element instance.

#### Throws

If no prefix is known for the namespace, or the
                         name breaks the rules for the xml and xmlns prefixes.

#### Throws

If attr is not an object, or looks like a child (an array or a node).

***

### getElementsByTagName()

```ts
getElementsByTagName(tagName: string): Element[];
```

Return all descendant elements that have the specified tag name.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `tagName` | `string` | The tag name to filter by. |

#### Returns

[`Element`](#classeselementmd)[]

The elements by tag name.

***

### insertBefore()

```ts
insertBefore<T extends Node | DocumentFragment>(newNode: T, referenceNode: Node | null): T;
```

Inserts a node before a _reference node_ as a child of a specified _parent node_.

#### Type Parameters

| Type Parameter |
| ------ |
| <a id="type-parameter-t-1"></a> `T` *extends* [`Node`](#classesnodemd) \| [`DocumentFragment`](#classesdocumentfragmentmd) |

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `newNode` | `T` | The node to be inserted. |
| `referenceNode` | [`Node`](#classesnodemd) \| `null` | The node before which newNode is inserted. If this is null, then newNode is inserted at the end of node's child nodes. |

#### Returns

`T`

The node or DocumentFragment that was passed in.

#### Throws

If newNode is this node or one of its ancestors.

#### Throws

If referenceNode is not a child of this node.

#### Overrides

[`Node`](#classesnodemd).[`insertBefore`](#insertbefore)

***

### isDefaultNamespace()

```ts
isDefaultNamespace(namespaceURI: string | null): boolean;
```

Test if a namespace URI is the default namespace at this node.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `namespaceURI` | `string` \| `null` | The namespace URI to test, or null for no namespace. |

#### Returns

`boolean`

True if unprefixed elements here belong to the namespace.

#### Inherited from

[`Node`](#classesnodemd).[`isDefaultNamespace`](#isdefaultnamespace)

***

### isEqualNode()

```ts
isEqualNode(otherNode: Node | DocumentFragment | null): boolean;
```

Test if a node is equal to this one, as in the DOM. Nodes are equal if
they are of the same type, have the same names, namespaces, and data,
have the same attributes in any order, and have equal children in the
same order. Parents and owner elements are not compared, so equal
subtrees in different places, or different documents, are equal.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `otherNode` | [`Node`](#classesnodemd) \| [`DocumentFragment`](#classesdocumentfragmentmd) \| `null` | The node to compare with. |

#### Returns

`boolean`

True if the nodes are equal.

#### Inherited from

[`Node`](#classesnodemd).[`isEqualNode`](#isequalnode)

***

### lookupNamespaceURI()

```ts
lookupNamespaceURI(prefix: string | null): string | null;
```

Find the namespace URI that a prefix is bound to. As in the DOM, elements
resolve it from their own `xmlns` declarations and their ancestors', and
other nodes ask an element: a document its root, an attribute its owner
element, and anything else its parent element.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `prefix` | `string` \| `null` | The prefix to look up, or null for the default namespace. |

#### Returns

`string` \| `null`

The namespace URI, or null if the prefix is not bound.

#### Inherited from

[`Node`](#classesnodemd).[`lookupNamespaceURI`](#lookupnamespaceuri)

***

### lookupPrefix()

```ts
lookupPrefix(namespaceURI: string | null): string | null;
```

Find a prefix that is bound to a namespace URI. Nodes other than elements
ask an element, as `lookupNamespaceURI` does.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `namespaceURI` | `string` \| `null` | The namespace URI to look up. |

#### Returns

`string` \| `null`

The prefix, or null if no prefix is bound to the namespace.

#### Inherited from

[`Node`](#classesnodemd).[`lookupPrefix`](#lookupprefix)

***

### print()

```ts
print(pretty?: boolean): string;
```

Print the document as a string.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `pretty?` | `boolean` | `false` | Apply automatic linebreaks and indentation to the output. |

#### Returns

`string`

The document as an XML string.

***

### querySelector()

```ts
querySelector(selector: string): Element | null;
```

Return the first descendant element that match a specified CSS selector.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `selector` | `string` | The CSS selector to filter by. |

#### Returns

[`Element`](#classeselementmd) \| `null`

The elements by tag name.

***

### querySelectorAll()

```ts
querySelectorAll(selector: string): Element[];
```

Return all descendant elements that match a specified CSS selector.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `selector` | `string` | The CSS selector to filter by. |

#### Returns

[`Element`](#classeselementmd)[]

The elements by tag name.

***

### removeChild()

```ts
removeChild(child: Node): Node | undefined;
```

Removes a child node from the DOM and returns the removed node.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `child` | [`Node`](#classesnodemd) | The child node to be removed. |

#### Returns

[`Node`](#classesnodemd) \| `undefined`

The removed child node.

#### Inherited from

[`Node`](#classesnodemd).[`removeChild`](#removechild)

***

### toJS()

```ts
toJS(): JsonMLElement | [];
```

Returns a simple object representation of the node and its descendants.

#### Returns

[`JsonMLElement`](#type-aliasesjsonmlelementmd) \| \[\]

JsonML representation of the nodes and its subtree.

***

### toString()

```ts
toString(): string;
```

Returns a string representation of the node.

#### Returns

`string`

A formatted XML source.

#### Inherited from

[`Node`](#classesnodemd).[`toString`](#tostring)


<a name="classesdocumentfragmentmd"></a>

# DocumentFragment

A class describing a DocumentFragment.

## Constructors

### Constructor

```ts
new DocumentFragment(): DocumentFragment;
```

#### Returns

`DocumentFragment`

## Properties

| Property | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| <a id="childnodes"></a> `childNodes` | [`Node`](#classesnodemd)[] | `[]` | The immediate children contained in the fragment. |
| <a id="nodetype"></a> `nodeType` | `number` | `DOCUMENT_FRAGMENT_NODE` | A numerical node type identifier. |

## Methods

### appendChild()

```ts
appendChild<T extends Node | DocumentFragment>(node: T): T;
```

Appends a child node into the document fragment.

#### Type Parameters

| Type Parameter |
| ------ |
| <a id="type-parameter-t"></a> `T` *extends* [`Node`](#classesnodemd) \| `DocumentFragment` |

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `node` | `T` | The new child node |

#### Returns

`T`

The same node that was passed in.

***

### isEqualNode()

```ts
isEqualNode(otherNode: Node | DocumentFragment | null): boolean;
```

Test if a node is equal to this one, as in the DOM. Nodes are equal if
they are of the same type, have the same names, namespaces, and data,
have the same attributes in any order, and have equal children in the
same order. Parents and owner elements are not compared, so equal
subtrees in different places, or different documents, are equal.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `otherNode` | [`Node`](#classesnodemd) \| `DocumentFragment` \| `null` | The node to compare with. |

#### Returns

`boolean`

True if the nodes are equal.

***

### print()

```ts
print(pretty?: boolean): string;
```

Print the document as a string.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `pretty?` | `boolean` | `false` | Apply automatic linebreaks and indentation to the output. |

#### Returns

`string`

The document as an XML string.


<a name="classeselementmd"></a>

# Element

A class describing an Element.

## Extends

- [`Node`](#classesnodemd)

## Constructors

### Constructor

```ts
new Element(tagName: string, attr?: XMLAttr | null): Element;
```

Constructs a new Element instance.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `tagName` | `string` | The tag name of the node. |
| `attr?` | [`XMLAttr`](#type-aliasesxmlattrmd) \| `null` | A collection of attributes to assign. Values of null or undefined will be ignored. |

#### Returns

`Element`

#### Throws

If attr is not an object, or looks like a child (an array or a node).

#### Overrides

[`Node`](#classesnodemd).[`constructor`](#constructor)

## Properties

| Property | Type | Default value | Description | Overrides | Inherited from |
| ------ | ------ | ------ | ------ | ------ | ------ |
| <a id="childnodes"></a> `childNodes` | [`Node`](#classesnodemd)[] | `[]` | The node's immediate children. | - | [`Node`](#classesnodemd).[`childNodes`](#childnodes) |
| <a id="localname"></a> `localName` | `string` | `undefined` | The name of the tag for the given element, excluding any namespace prefix. | - | - |
| <a id="nodename"></a> `nodeName` | `string` | `'#node'` | A node type string identifier. | - | [`Node`](#classesnodemd).[`nodeName`](#nodename) |
| <a id="nodetype"></a> `nodeType` | `number` | `0` | A numerical node type identifier. | - | [`Node`](#classesnodemd).[`nodeType`](#nodetype) |
| <a id="parentnode"></a> `parentNode` | `Element` \| `null` | `null` | The node's parent node. | [`Document`](#classesdocumentmd).[`parentNode`](#parentnode) | - |
| <a id="prefix"></a> `prefix` | `string` \| `null` | `undefined` | The namespace prefix of the element, or null' if no prefix is specified. | - | - |

## Accessors

### attributes

#### Get Signature

```ts
get attributes(): NamedNodeMap;
```

A list of attributes assigned to this element.

##### Returns

[`NamedNodeMap`](#type-aliasesnamednodemapmd)

***

### children

#### Get Signature

```ts
get children(): Element[];
```

A list containing all child Elements of the current Element.

##### Returns

`Element`[]

***

### className

#### Get Signature

```ts
get className(): string;
```

##### Returns

`string`

#### Set Signature

```ts
set className(val: unknown): void;
```

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `val` | `unknown` |

##### Returns

`void`

***

### firstChild

#### Get Signature

```ts
get firstChild(): Node | null;
```

Returns the node's first child in the tree, or null if the node has no children.

##### Returns

[`Node`](#classesnodemd) \| `null`

#### Inherited from

[`CDataNode`](#classescdatanodemd).[`firstChild`](#firstchild)

***

### firstElementChild

#### Get Signature

```ts
get firstElementChild(): Element | null;
```

Returns an element's first child Element, or null if there are no child elements

##### Returns

`Element` \| `null`

***

### fullName

#### Get Signature

```ts
get fullName(): string;
```

The full name of the tag for the given element, including a namespace prefix.

##### Returns

`string`

***

### lastChild

#### Get Signature

```ts
get lastChild(): Node | null;
```

Returns the node's last child in the tree, or null if the node has no children.

##### Returns

[`Node`](#classesnodemd) \| `null`

#### Inherited from

[`CDataNode`](#classescdatanodemd).[`lastChild`](#lastchild)

***

### namespaceURI

#### Get Signature

```ts
get namespaceURI(): string | null;
```

The namespace URI of the element, or null if it has none. It is resolved
from the element's prefix and the `xmlns` declarations on the element and
its ancestors, so it changes if the element is moved.

##### Returns

`string` \| `null`

***

### preserveSpace

#### Get Signature

```ts
get preserveSpace(): boolean;
```

True if xml:space has been set to true for this node or any of its ancestors.

##### Returns

`boolean`

#### Overrides

[`Node`](#classesnodemd).[`preserveSpace`](#preservespace)

***

### tagName

#### Get Signature

```ts
get tagName(): string;
```

##### Returns

`string`

***

### textContent

#### Get Signature

```ts
get textContent(): string;
```

The text content of this node (and its children).

##### Returns

`string`

#### Inherited from

[`Node`](#classesnodemd).[`textContent`](#textcontent)

## Methods

### append()

```ts
append(...nodes: (
  | CreateChildArgument
  | CreateChildArgument[])[]): void;
```

Inserts a set of Node objects or strings after the last child of the Element.
Strings are inserted as equivalent Text nodes.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| ...`nodes` | ( \| [`CreateChildArgument`](#type-aliasescreatechildargumentmd) \| [`CreateChildArgument`](#type-aliasescreatechildargumentmd)[])[] |

#### Returns

`void`

***

### appendChild()

```ts
appendChild<T extends Node | DocumentFragment>(this: Node, node: T): T;
```

Appends a child node into the current one.

#### Type Parameters

| Type Parameter |
| ------ |
| <a id="type-parameter-t"></a> `T` *extends* [`Node`](#classesnodemd) \| [`DocumentFragment`](#classesdocumentfragmentmd) |

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `this` | [`Node`](#classesnodemd) | - |
| `node` | `T` | The new child node |

#### Returns

`T`

The same node that was passed in.

#### Inherited from

[`Node`](#classesnodemd).[`appendChild`](#appendchild)

***

### createChild()

```ts
createChild(
   qualifiedName: string, 
   attr?: XMLAttr | null, 
   ...children: (
  | CreateChildArgument
  | CreateChildArgument[])[]
): Element;
```

This method creates an element and immediately inserts it as a child of the element on which the
method was called.

The method implicitly creates the new element in the same namespace as the parent element.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `qualifiedName` | `string` | The local tagName of the element. |
| `attr?` | [`XMLAttr`](#type-aliasesxmlattrmd) \| `null` | A record of attributes to assign to the new element. If the value is null or undefined, the attribute will be omitted. |
| ...`children?` | ( \| [`CreateChildArgument`](#type-aliasescreatechildargumentmd) \| [`CreateChildArgument`](#type-aliasescreatechildargumentmd)[])[] | Nodes to insert as children. Strings will be converted to TextNodes and arrays will be flattened. |

#### Returns

`Element`

A new Element instance.

#### Throws

If attr is not an object, or looks like a child (an array or a node).

***

### createChildNS()

```ts
createChildNS(
   namespaceURI: string | null, 
   qualifiedName: string, 
   attr?: XMLAttr | null, 
   ...children: (
  | CreateChildArgument
  | CreateChildArgument[])[]
): Element;
```

Create an element in a namespace and insert it as the last child of this
element. Unlike `createChild`, the new element doesn't take this element's
prefix, and missing namespace declarations are added to it.

- With no namespace, the new element is unprefixed. If a default
  namespace is in scope, `xmlns=""` is added to it.
- With a namespace and an unprefixed name, the default namespace or a
  prefix in scope is used. If the namespace isn't declared, this throws.
- With a namespace and a prefixed name, the name is used as given. If the
  prefix isn't declared, `xmlns:prefix` is added to the new element. If
  it's bound to another namespace, this throws.

Namespace declarations in `attr` count as being in scope, but this throws
if they contradict the namespace.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `namespaceURI` | `string` \| `null` | The namespace of the new element, or null or an empty string for no namespace. |
| `qualifiedName` | `string` | The tagName of the element, with or without a prefix. |
| `attr?` | [`XMLAttr`](#type-aliasesxmlattrmd) \| `null` | A record of attributes to assign to the new element. If the value is null or undefined, the attribute will be omitted. |
| ...`children?` | ( \| [`CreateChildArgument`](#type-aliasescreatechildargumentmd) \| [`CreateChildArgument`](#type-aliasescreatechildargumentmd)[])[] | Nodes to insert as children. Strings will be converted to TextNodes and arrays will be flattened. |

#### Returns

`Element`

A new Element instance.

#### Throws

If the namespace can't be used with the name here.

#### Throws

If the name is not a valid XML name.

#### Throws

If attr is not an object, or looks like a child (an array or a node).

***

### getAttribute()

```ts
getAttribute(name: string): string | null;
```

Read an attribute from the element.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `name` | `string` | The attribute name to read. |

#### Returns

`string` \| `null`

The attribute.

***

### getElementsByTagName()

```ts
getElementsByTagName(tagName: string): Element[];
```

Return all descendant elements that have the specified tag name.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `tagName` | `string` | The tag name to filter by. |

#### Returns

`Element`[]

The elements by tag name.

***

### hasAttribute()

```ts
hasAttribute(name: string): boolean;
```

Test if an attribute exists on the element.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `name` | `string` | The attribute name to test for. |

#### Returns

`boolean`

True if the attribute is present.

***

### hasAttributes()

```ts
hasAttributes(): boolean;
```

#### Returns

`boolean`

***

### insertBefore()

```ts
insertBefore<T extends Node | DocumentFragment>(newNode: T, referenceNode: Node | null): T;
```

Inserts a node before a _reference node_ as a child of a specified _parent node_.

#### Type Parameters

| Type Parameter |
| ------ |
| <a id="type-parameter-t-1"></a> `T` *extends* [`Node`](#classesnodemd) \| [`DocumentFragment`](#classesdocumentfragmentmd) |

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `newNode` | `T` | The node to be inserted. |
| `referenceNode` | [`Node`](#classesnodemd) \| `null` | The node before which newNode is inserted. If this is null, then newNode is inserted at the end of node's child nodes. |

#### Returns

`T`

The node or DocumentFragment that was passed in.

#### Throws

If newNode is this node or one of its ancestors.

#### Throws

If referenceNode is not a child of this node.

#### Inherited from

[`Node`](#classesnodemd).[`insertBefore`](#insertbefore)

***

### isDefaultNamespace()

```ts
isDefaultNamespace(namespaceURI: string | null): boolean;
```

Test if a namespace URI is the default namespace at this node.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `namespaceURI` | `string` \| `null` | The namespace URI to test, or null for no namespace. |

#### Returns

`boolean`

True if unprefixed elements here belong to the namespace.

#### Inherited from

[`Node`](#classesnodemd).[`isDefaultNamespace`](#isdefaultnamespace)

***

### isEqualNode()

```ts
isEqualNode(otherNode: Node | DocumentFragment | null): boolean;
```

Test if a node is equal to this one, as in the DOM. Nodes are equal if
they are of the same type, have the same names, namespaces, and data,
have the same attributes in any order, and have equal children in the
same order. Parents and owner elements are not compared, so equal
subtrees in different places, or different documents, are equal.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `otherNode` | [`Node`](#classesnodemd) \| [`DocumentFragment`](#classesdocumentfragmentmd) \| `null` | The node to compare with. |

#### Returns

`boolean`

True if the nodes are equal.

#### Inherited from

[`Node`](#classesnodemd).[`isEqualNode`](#isequalnode)

***

### lookupNamespaceURI()

```ts
lookupNamespaceURI(prefix: string | null): string | null;
```

Find the namespace URI that a prefix is bound to, using the `xmlns`
declarations on the element and its ancestors.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `prefix` | `string` \| `null` | The prefix to look up, or null for the default namespace. |

#### Returns

`string` \| `null`

The namespace URI, or null if the prefix is not bound.

#### Overrides

[`Node`](#classesnodemd).[`lookupNamespaceURI`](#lookupnamespaceuri)

***

### lookupPrefix()

```ts
lookupPrefix(namespaceURI: string | null): string | null;
```

Find a prefix that is bound to a namespace URI, using the `xmlns`
declarations on the element and its ancestors. A prefix that a nearer
element binds to a different URI is skipped.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `namespaceURI` | `string` \| `null` | The namespace URI to look up. |

#### Returns

`string` \| `null`

The prefix, or null if no prefix is bound to the namespace.

#### Overrides

[`Node`](#classesnodemd).[`lookupPrefix`](#lookupprefix)

***

### prepend()

```ts
prepend(...nodes: (
  | CreateChildArgument
  | CreateChildArgument[])[]): void;
```

Insert a set of Node objects or strings before the first child of the Element.
Strings are inserted as equivalent Text nodes.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| ...`nodes` | ( \| [`CreateChildArgument`](#type-aliasescreatechildargumentmd) \| [`CreateChildArgument`](#type-aliasescreatechildargumentmd)[])[] |

#### Returns

`void`

***

### print()

```ts
print(pretty?: boolean): string;
```

Print the document as a string.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `pretty?` | `boolean` | `false` | Apply automatic linebreaks and indentation to the output. |

#### Returns

`string`

The document as an XML string.

***

### querySelector()

```ts
querySelector(selector: string): Element | null;
```

Return the first descendant element that match a specified CSS selector.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `selector` | `string` | The CSS selector to filter by. |

#### Returns

`Element` \| `null`

The elements by tag name.

***

### querySelectorAll()

```ts
querySelectorAll(selector: string): Element[];
```

Return all descendant elements that match a specified CSS selector.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `selector` | `string` | The CSS selector to filter by. |

#### Returns

`Element`[]

The elements by tag name.

***

### removeAttribute()

```ts
removeAttribute(name: string): void;
```

Remove an attribute off the element. Does nothing if the attribute is not present.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `name` | `string` | The qualified name of the attribute to remove. |

#### Returns

`void`

***

### removeChild()

```ts
removeChild(child: Node): Node | undefined;
```

Removes a child node from the DOM and returns the removed node.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `child` | [`Node`](#classesnodemd) | The child node to be removed. |

#### Returns

[`Node`](#classesnodemd) \| `undefined`

The removed child node.

#### Inherited from

[`Node`](#classesnodemd).[`removeChild`](#removechild)

***

### setAttribute()

```ts
setAttribute(name: string, value: string | number | boolean): void;
```

Sets an attribute on the element.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `name` | `string` | The attribute name to read. |
| `value` | `string` \| `number` \| `boolean` | The value to set |

#### Returns

`void`

***

### setAttrValues()

```ts
setAttrValues(attr?: XMLAttr | null): void;
```

Assign multiple attributes at once to the current elemeent.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `attr?` | [`XMLAttr`](#type-aliasesxmlattrmd) \| `null` | A record of attributes to assign to the element. If the value is null or undefined, the attribute will be omitted. |

#### Returns

`void`

#### Throws

If attr is not an object, or looks like a child (an array or a node).

***

### toJS()

```ts
toJS(): JsonMLElement;
```

Returns a simple object representation of the node and its descendants.

#### Returns

[`JsonMLElement`](#type-aliasesjsonmlelementmd)

JsonML representation of the nodes and its subtree.

***

### toString()

```ts
toString(): string;
```

Returns a string representation of the node.

#### Returns

`string`

A formatted XML source.

#### Inherited from

[`Node`](#classesnodemd).[`toString`](#tostring)


<a name="classeshierarchyerrormd"></a>

# HierarchyError

Thrown when an operation would violate the structure of the document
tree: e.g. inserting an ancestor as a descendant, giving a Document
more than one root, or requiring a root that isn't present.

## Extends

- [`XMLError`](#classesxmlerrormd)

## Constructors

### Constructor

```ts
new HierarchyError(message: string): HierarchyError;
```

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `message` | `string` |

#### Returns

`HierarchyError`

#### Overrides

[`XMLError`](#classesxmlerrormd).[`constructor`](#constructor)

## Properties

| Property | Modifier | Type | Description | Inherited from |
| ------ | ------ | ------ | ------ | ------ |
| <a id="cause"></a> `cause?` | `public` | `unknown` | - | [`XMLError`](#classesxmlerrormd).[`cause`](#cause) |
| <a id="message"></a> `message` | `public` | `string` | - | [`XMLError`](#classesxmlerrormd).[`message`](#message) |
| <a id="name"></a> `name` | `public` | `string` | - | [`XMLError`](#classesxmlerrormd).[`name`](#name) |
| <a id="stack"></a> `stack?` | `public` | `string` | - | [`XMLError`](#classesxmlerrormd).[`stack`](#stack) |
| <a id="stacktracelimit"></a> `stackTraceLimit` | `static` | `number` | The `Error.stackTraceLimit` property specifies the number of stack frames collected by a stack trace (whether generated by `new Error().stack` or `Error.captureStackTrace(obj)`). The default value is `10` but may be set to any valid JavaScript number. Changes will affect any stack trace captured _after_ the value has been changed. If set to a non-number value, or set to a negative number, stack traces will not capture any frames. | [`XMLError`](#classesxmlerrormd).[`stackTraceLimit`](#stacktracelimit) |

## Methods

### captureStackTrace()

```ts
static captureStackTrace(targetObject: object, constructorOpt?: Function): void;
```

Creates a `.stack` property on `targetObject`, which when accessed returns
a string representing the location in the code at which
`Error.captureStackTrace()` was called.

```js
const myObject = {};
Error.captureStackTrace(myObject);
myObject.stack;  // Similar to `new Error().stack`
```

The first line of the trace will be prefixed with
`${myObject.name}: ${myObject.message}`.

The optional `constructorOpt` argument accepts a function. If given, all frames
above `constructorOpt`, including `constructorOpt`, will be omitted from the
generated stack trace.

The `constructorOpt` argument is useful for hiding implementation
details of error generation from the user. For instance:

```js
function a() {
  b();
}

function b() {
  c();
}

function c() {
  // Create an error without stack trace to avoid calculating the stack trace twice.
  const { stackTraceLimit } = Error;
  Error.stackTraceLimit = 0;
  const error = new Error();
  Error.stackTraceLimit = stackTraceLimit;

  // Capture the stack trace above function b
  Error.captureStackTrace(error, b); // Neither function c, nor b is included in the stack trace
  throw error;
}

a();
```

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `targetObject` | `object` |
| `constructorOpt?` | `Function` |

#### Returns

`void`

#### Inherited from

[`XMLError`](#classesxmlerrormd).[`captureStackTrace`](#capturestacktrace)

***

### prepareStackTrace()

```ts
static prepareStackTrace(err: Error, stackTraces: CallSite[]): any;
```

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `err` | `Error` |
| `stackTraces` | `CallSite`[] |

#### Returns

`any`

#### See

https://v8.dev/docs/stack-trace-api#customizing-stack-traces

#### Inherited from

[`XMLError`](#classesxmlerrormd).[`prepareStackTrace`](#preparestacktrace)


<a name="classesinuseattributeerrormd"></a>

# InUseAttributeError

Thrown when an attribute that belongs to one element is added to another.
Remove it from its element first, or create a new attribute.

## Extends

- [`XMLError`](#classesxmlerrormd)

## Constructors

### Constructor

```ts
new InUseAttributeError(message: string): InUseAttributeError;
```

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `message` | `string` |

#### Returns

`InUseAttributeError`

#### Overrides

[`XMLError`](#classesxmlerrormd).[`constructor`](#constructor)

## Properties

| Property | Modifier | Type | Description | Inherited from |
| ------ | ------ | ------ | ------ | ------ |
| <a id="cause"></a> `cause?` | `public` | `unknown` | - | [`XMLError`](#classesxmlerrormd).[`cause`](#cause) |
| <a id="message"></a> `message` | `public` | `string` | - | [`XMLError`](#classesxmlerrormd).[`message`](#message) |
| <a id="name"></a> `name` | `public` | `string` | - | [`XMLError`](#classesxmlerrormd).[`name`](#name) |
| <a id="stack"></a> `stack?` | `public` | `string` | - | [`XMLError`](#classesxmlerrormd).[`stack`](#stack) |
| <a id="stacktracelimit"></a> `stackTraceLimit` | `static` | `number` | The `Error.stackTraceLimit` property specifies the number of stack frames collected by a stack trace (whether generated by `new Error().stack` or `Error.captureStackTrace(obj)`). The default value is `10` but may be set to any valid JavaScript number. Changes will affect any stack trace captured _after_ the value has been changed. If set to a non-number value, or set to a negative number, stack traces will not capture any frames. | [`XMLError`](#classesxmlerrormd).[`stackTraceLimit`](#stacktracelimit) |

## Methods

### captureStackTrace()

```ts
static captureStackTrace(targetObject: object, constructorOpt?: Function): void;
```

Creates a `.stack` property on `targetObject`, which when accessed returns
a string representing the location in the code at which
`Error.captureStackTrace()` was called.

```js
const myObject = {};
Error.captureStackTrace(myObject);
myObject.stack;  // Similar to `new Error().stack`
```

The first line of the trace will be prefixed with
`${myObject.name}: ${myObject.message}`.

The optional `constructorOpt` argument accepts a function. If given, all frames
above `constructorOpt`, including `constructorOpt`, will be omitted from the
generated stack trace.

The `constructorOpt` argument is useful for hiding implementation
details of error generation from the user. For instance:

```js
function a() {
  b();
}

function b() {
  c();
}

function c() {
  // Create an error without stack trace to avoid calculating the stack trace twice.
  const { stackTraceLimit } = Error;
  Error.stackTraceLimit = 0;
  const error = new Error();
  Error.stackTraceLimit = stackTraceLimit;

  // Capture the stack trace above function b
  Error.captureStackTrace(error, b); // Neither function c, nor b is included in the stack trace
  throw error;
}

a();
```

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `targetObject` | `object` |
| `constructorOpt?` | `Function` |

#### Returns

`void`

#### Inherited from

[`XMLError`](#classesxmlerrormd).[`captureStackTrace`](#capturestacktrace)

***

### prepareStackTrace()

```ts
static prepareStackTrace(err: Error, stackTraces: CallSite[]): any;
```

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `err` | `Error` |
| `stackTraces` | `CallSite`[] |

#### Returns

`any`

#### See

https://v8.dev/docs/stack-trace-api#customizing-stack-traces

#### Inherited from

[`XMLError`](#classesxmlerrormd).[`prepareStackTrace`](#preparestacktrace)


<a name="classesinvalidcharactererrormd"></a>

# InvalidCharacterError

Thrown when an element or attribute name is not a valid XML name.

## Extends

- [`XMLError`](#classesxmlerrormd)

## Constructors

### Constructor

```ts
new InvalidCharacterError(message: string): InvalidCharacterError;
```

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `message` | `string` |

#### Returns

`InvalidCharacterError`

#### Overrides

[`XMLError`](#classesxmlerrormd).[`constructor`](#constructor)

## Properties

| Property | Modifier | Type | Description | Inherited from |
| ------ | ------ | ------ | ------ | ------ |
| <a id="cause"></a> `cause?` | `public` | `unknown` | - | [`XMLError`](#classesxmlerrormd).[`cause`](#cause) |
| <a id="message"></a> `message` | `public` | `string` | - | [`XMLError`](#classesxmlerrormd).[`message`](#message) |
| <a id="name"></a> `name` | `public` | `string` | - | [`XMLError`](#classesxmlerrormd).[`name`](#name) |
| <a id="stack"></a> `stack?` | `public` | `string` | - | [`XMLError`](#classesxmlerrormd).[`stack`](#stack) |
| <a id="stacktracelimit"></a> `stackTraceLimit` | `static` | `number` | The `Error.stackTraceLimit` property specifies the number of stack frames collected by a stack trace (whether generated by `new Error().stack` or `Error.captureStackTrace(obj)`). The default value is `10` but may be set to any valid JavaScript number. Changes will affect any stack trace captured _after_ the value has been changed. If set to a non-number value, or set to a negative number, stack traces will not capture any frames. | [`XMLError`](#classesxmlerrormd).[`stackTraceLimit`](#stacktracelimit) |

## Methods

### captureStackTrace()

```ts
static captureStackTrace(targetObject: object, constructorOpt?: Function): void;
```

Creates a `.stack` property on `targetObject`, which when accessed returns
a string representing the location in the code at which
`Error.captureStackTrace()` was called.

```js
const myObject = {};
Error.captureStackTrace(myObject);
myObject.stack;  // Similar to `new Error().stack`
```

The first line of the trace will be prefixed with
`${myObject.name}: ${myObject.message}`.

The optional `constructorOpt` argument accepts a function. If given, all frames
above `constructorOpt`, including `constructorOpt`, will be omitted from the
generated stack trace.

The `constructorOpt` argument is useful for hiding implementation
details of error generation from the user. For instance:

```js
function a() {
  b();
}

function b() {
  c();
}

function c() {
  // Create an error without stack trace to avoid calculating the stack trace twice.
  const { stackTraceLimit } = Error;
  Error.stackTraceLimit = 0;
  const error = new Error();
  Error.stackTraceLimit = stackTraceLimit;

  // Capture the stack trace above function b
  Error.captureStackTrace(error, b); // Neither function c, nor b is included in the stack trace
  throw error;
}

a();
```

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `targetObject` | `object` |
| `constructorOpt?` | `Function` |

#### Returns

`void`

#### Inherited from

[`XMLError`](#classesxmlerrormd).[`captureStackTrace`](#capturestacktrace)

***

### prepareStackTrace()

```ts
static prepareStackTrace(err: Error, stackTraces: CallSite[]): any;
```

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `err` | `Error` |
| `stackTraces` | `CallSite`[] |

#### Returns

`any`

#### See

https://v8.dev/docs/stack-trace-api#customizing-stack-traces

#### Inherited from

[`XMLError`](#classesxmlerrormd).[`prepareStackTrace`](#preparestacktrace)


<a name="classesnamespaceerrormd"></a>

# NamespaceError

Thrown for namespace-related problems: an unknown prefix, a prefix
re-bound to a different URI, or a lookup for a URI that hasn't been
declared.

## Extends

- [`XMLError`](#classesxmlerrormd)

## Constructors

### Constructor

```ts
new NamespaceError(message: string): NamespaceError;
```

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `message` | `string` |

#### Returns

`NamespaceError`

#### Overrides

[`XMLError`](#classesxmlerrormd).[`constructor`](#constructor)

## Properties

| Property | Modifier | Type | Description | Inherited from |
| ------ | ------ | ------ | ------ | ------ |
| <a id="cause"></a> `cause?` | `public` | `unknown` | - | [`XMLError`](#classesxmlerrormd).[`cause`](#cause) |
| <a id="message"></a> `message` | `public` | `string` | - | [`XMLError`](#classesxmlerrormd).[`message`](#message) |
| <a id="name"></a> `name` | `public` | `string` | - | [`XMLError`](#classesxmlerrormd).[`name`](#name) |
| <a id="stack"></a> `stack?` | `public` | `string` | - | [`XMLError`](#classesxmlerrormd).[`stack`](#stack) |
| <a id="stacktracelimit"></a> `stackTraceLimit` | `static` | `number` | The `Error.stackTraceLimit` property specifies the number of stack frames collected by a stack trace (whether generated by `new Error().stack` or `Error.captureStackTrace(obj)`). The default value is `10` but may be set to any valid JavaScript number. Changes will affect any stack trace captured _after_ the value has been changed. If set to a non-number value, or set to a negative number, stack traces will not capture any frames. | [`XMLError`](#classesxmlerrormd).[`stackTraceLimit`](#stacktracelimit) |

## Methods

### captureStackTrace()

```ts
static captureStackTrace(targetObject: object, constructorOpt?: Function): void;
```

Creates a `.stack` property on `targetObject`, which when accessed returns
a string representing the location in the code at which
`Error.captureStackTrace()` was called.

```js
const myObject = {};
Error.captureStackTrace(myObject);
myObject.stack;  // Similar to `new Error().stack`
```

The first line of the trace will be prefixed with
`${myObject.name}: ${myObject.message}`.

The optional `constructorOpt` argument accepts a function. If given, all frames
above `constructorOpt`, including `constructorOpt`, will be omitted from the
generated stack trace.

The `constructorOpt` argument is useful for hiding implementation
details of error generation from the user. For instance:

```js
function a() {
  b();
}

function b() {
  c();
}

function c() {
  // Create an error without stack trace to avoid calculating the stack trace twice.
  const { stackTraceLimit } = Error;
  Error.stackTraceLimit = 0;
  const error = new Error();
  Error.stackTraceLimit = stackTraceLimit;

  // Capture the stack trace above function b
  Error.captureStackTrace(error, b); // Neither function c, nor b is included in the stack trace
  throw error;
}

a();
```

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `targetObject` | `object` |
| `constructorOpt?` | `Function` |

#### Returns

`void`

#### Inherited from

[`XMLError`](#classesxmlerrormd).[`captureStackTrace`](#capturestacktrace)

***

### prepareStackTrace()

```ts
static prepareStackTrace(err: Error, stackTraces: CallSite[]): any;
```

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `err` | `Error` |
| `stackTraces` | `CallSite`[] |

#### Returns

`any`

#### See

https://v8.dev/docs/stack-trace-api#customizing-stack-traces

#### Inherited from

[`XMLError`](#classesxmlerrormd).[`prepareStackTrace`](#preparestacktrace)


<a name="classesnodemd"></a>

# Node

A class describing a Node.

## Extended by

- [`Element`](#classeselementmd)
- [`Attr`](#classesattrmd)
- [`Document`](#classesdocumentmd)
- [`TextNode`](#classestextnodemd)
- [`CDataNode`](#classescdatanodemd)

## Constructors

### Constructor

```ts
new Node(): Node;
```

#### Returns

`Node`

## Properties

| Property | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| <a id="childnodes"></a> `childNodes` | `Node`[] | `[]` | The node's immediate children. |
| <a id="nodename"></a> `nodeName` | `string` | `'#node'` | A node type string identifier. |
| <a id="nodetype"></a> `nodeType` | `number` | `0` | A numerical node type identifier. |
| <a id="parentnode"></a> `parentNode` | `Node` \| `null` | `null` | The node's parent node. |

## Accessors

### firstChild

#### Get Signature

```ts
get firstChild(): Node | null;
```

Returns the node's first child in the tree, or null if the node has no children.

##### Returns

`Node` \| `null`

***

### lastChild

#### Get Signature

```ts
get lastChild(): Node | null;
```

Returns the node's last child in the tree, or null if the node has no children.

##### Returns

`Node` \| `null`

***

### preserveSpace

#### Get Signature

```ts
get preserveSpace(): boolean;
```

True if xml:space has been set to true for this node or any of its ancestors.

##### Returns

`boolean`

***

### textContent

#### Get Signature

```ts
get textContent(): string;
```

The text content of this node (and its children).

##### Returns

`string`

## Methods

### appendChild()

```ts
appendChild<T extends Node | DocumentFragment>(this: Node, node: T): T;
```

Appends a child node into the current one.

#### Type Parameters

| Type Parameter |
| ------ |
| <a id="type-parameter-t"></a> `T` *extends* `Node` \| [`DocumentFragment`](#classesdocumentfragmentmd) |

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `this` | `Node` | - |
| `node` | `T` | The new child node |

#### Returns

`T`

The same node that was passed in.

***

### insertBefore()

```ts
insertBefore<T extends Node | DocumentFragment>(newNode: T, referenceNode: Node | null): T;
```

Inserts a node before a _reference node_ as a child of a specified _parent node_.

#### Type Parameters

| Type Parameter |
| ------ |
| <a id="type-parameter-t-1"></a> `T` *extends* `Node` \| [`DocumentFragment`](#classesdocumentfragmentmd) |

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `newNode` | `T` | The node to be inserted. |
| `referenceNode` | `Node` \| `null` | The node before which newNode is inserted. If this is null, then newNode is inserted at the end of node's child nodes. |

#### Returns

`T`

The node or DocumentFragment that was passed in.

#### Throws

If newNode is this node or one of its ancestors.

#### Throws

If referenceNode is not a child of this node.

***

### isDefaultNamespace()

```ts
isDefaultNamespace(namespaceURI: string | null): boolean;
```

Test if a namespace URI is the default namespace at this node.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `namespaceURI` | `string` \| `null` | The namespace URI to test, or null for no namespace. |

#### Returns

`boolean`

True if unprefixed elements here belong to the namespace.

***

### isEqualNode()

```ts
isEqualNode(otherNode: Node | DocumentFragment | null): boolean;
```

Test if a node is equal to this one, as in the DOM. Nodes are equal if
they are of the same type, have the same names, namespaces, and data,
have the same attributes in any order, and have equal children in the
same order. Parents and owner elements are not compared, so equal
subtrees in different places, or different documents, are equal.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `otherNode` | `Node` \| [`DocumentFragment`](#classesdocumentfragmentmd) \| `null` | The node to compare with. |

#### Returns

`boolean`

True if the nodes are equal.

***

### lookupNamespaceURI()

```ts
lookupNamespaceURI(prefix: string | null): string | null;
```

Find the namespace URI that a prefix is bound to. As in the DOM, elements
resolve it from their own `xmlns` declarations and their ancestors', and
other nodes ask an element: a document its root, an attribute its owner
element, and anything else its parent element.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `prefix` | `string` \| `null` | The prefix to look up, or null for the default namespace. |

#### Returns

`string` \| `null`

The namespace URI, or null if the prefix is not bound.

***

### lookupPrefix()

```ts
lookupPrefix(namespaceURI: string | null): string | null;
```

Find a prefix that is bound to a namespace URI. Nodes other than elements
ask an element, as `lookupNamespaceURI` does.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `namespaceURI` | `string` \| `null` | The namespace URI to look up. |

#### Returns

`string` \| `null`

The prefix, or null if no prefix is bound to the namespace.

***

### removeChild()

```ts
removeChild(child: Node): Node | undefined;
```

Removes a child node from the DOM and returns the removed node.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `child` | `Node` | The child node to be removed. |

#### Returns

`Node` \| `undefined`

The removed child node.

***

### toString()

```ts
toString(): string;
```

Returns a string representation of the node.

#### Returns

`string`

A formatted XML source.


<a name="classesnotfounderrormd"></a>

# NotFoundError

Thrown when an item referenced by name or identity cannot be found
(e.g. removing a child that isn't a child, or a named attribute that
isn't in the map).

## Extends

- [`XMLError`](#classesxmlerrormd)

## Constructors

### Constructor

```ts
new NotFoundError(message: string): NotFoundError;
```

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `message` | `string` |

#### Returns

`NotFoundError`

#### Overrides

[`XMLError`](#classesxmlerrormd).[`constructor`](#constructor)

## Properties

| Property | Modifier | Type | Description | Inherited from |
| ------ | ------ | ------ | ------ | ------ |
| <a id="cause"></a> `cause?` | `public` | `unknown` | - | [`XMLError`](#classesxmlerrormd).[`cause`](#cause) |
| <a id="message"></a> `message` | `public` | `string` | - | [`XMLError`](#classesxmlerrormd).[`message`](#message) |
| <a id="name"></a> `name` | `public` | `string` | - | [`XMLError`](#classesxmlerrormd).[`name`](#name) |
| <a id="stack"></a> `stack?` | `public` | `string` | - | [`XMLError`](#classesxmlerrormd).[`stack`](#stack) |
| <a id="stacktracelimit"></a> `stackTraceLimit` | `static` | `number` | The `Error.stackTraceLimit` property specifies the number of stack frames collected by a stack trace (whether generated by `new Error().stack` or `Error.captureStackTrace(obj)`). The default value is `10` but may be set to any valid JavaScript number. Changes will affect any stack trace captured _after_ the value has been changed. If set to a non-number value, or set to a negative number, stack traces will not capture any frames. | [`XMLError`](#classesxmlerrormd).[`stackTraceLimit`](#stacktracelimit) |

## Methods

### captureStackTrace()

```ts
static captureStackTrace(targetObject: object, constructorOpt?: Function): void;
```

Creates a `.stack` property on `targetObject`, which when accessed returns
a string representing the location in the code at which
`Error.captureStackTrace()` was called.

```js
const myObject = {};
Error.captureStackTrace(myObject);
myObject.stack;  // Similar to `new Error().stack`
```

The first line of the trace will be prefixed with
`${myObject.name}: ${myObject.message}`.

The optional `constructorOpt` argument accepts a function. If given, all frames
above `constructorOpt`, including `constructorOpt`, will be omitted from the
generated stack trace.

The `constructorOpt` argument is useful for hiding implementation
details of error generation from the user. For instance:

```js
function a() {
  b();
}

function b() {
  c();
}

function c() {
  // Create an error without stack trace to avoid calculating the stack trace twice.
  const { stackTraceLimit } = Error;
  Error.stackTraceLimit = 0;
  const error = new Error();
  Error.stackTraceLimit = stackTraceLimit;

  // Capture the stack trace above function b
  Error.captureStackTrace(error, b); // Neither function c, nor b is included in the stack trace
  throw error;
}

a();
```

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `targetObject` | `object` |
| `constructorOpt?` | `Function` |

#### Returns

`void`

#### Inherited from

[`XMLError`](#classesxmlerrormd).[`captureStackTrace`](#capturestacktrace)

***

### prepareStackTrace()

```ts
static prepareStackTrace(err: Error, stackTraces: CallSite[]): any;
```

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `err` | `Error` |
| `stackTraces` | `CallSite`[] |

#### Returns

`any`

#### See

https://v8.dev/docs/stack-trace-api#customizing-stack-traces

#### Inherited from

[`XMLError`](#classesxmlerrormd).[`prepareStackTrace`](#preparestacktrace)


<a name="classesparsererrormd"></a>

# ParserError

Thrown when XML input cannot be parsed: malformed attributes, missing
declarations, premature EOF, content outside the root element, etc.

## Extends

- [`XMLError`](#classesxmlerrormd)

## Constructors

### Constructor

```ts
new ParserError(message: string): ParserError;
```

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `message` | `string` |

#### Returns

`ParserError`

#### Overrides

[`XMLError`](#classesxmlerrormd).[`constructor`](#constructor)

## Properties

| Property | Modifier | Type | Description | Inherited from |
| ------ | ------ | ------ | ------ | ------ |
| <a id="cause"></a> `cause?` | `public` | `unknown` | - | [`XMLError`](#classesxmlerrormd).[`cause`](#cause) |
| <a id="message"></a> `message` | `public` | `string` | - | [`XMLError`](#classesxmlerrormd).[`message`](#message) |
| <a id="name"></a> `name` | `public` | `string` | - | [`XMLError`](#classesxmlerrormd).[`name`](#name) |
| <a id="stack"></a> `stack?` | `public` | `string` | - | [`XMLError`](#classesxmlerrormd).[`stack`](#stack) |
| <a id="stacktracelimit"></a> `stackTraceLimit` | `static` | `number` | The `Error.stackTraceLimit` property specifies the number of stack frames collected by a stack trace (whether generated by `new Error().stack` or `Error.captureStackTrace(obj)`). The default value is `10` but may be set to any valid JavaScript number. Changes will affect any stack trace captured _after_ the value has been changed. If set to a non-number value, or set to a negative number, stack traces will not capture any frames. | [`XMLError`](#classesxmlerrormd).[`stackTraceLimit`](#stacktracelimit) |

## Methods

### captureStackTrace()

```ts
static captureStackTrace(targetObject: object, constructorOpt?: Function): void;
```

Creates a `.stack` property on `targetObject`, which when accessed returns
a string representing the location in the code at which
`Error.captureStackTrace()` was called.

```js
const myObject = {};
Error.captureStackTrace(myObject);
myObject.stack;  // Similar to `new Error().stack`
```

The first line of the trace will be prefixed with
`${myObject.name}: ${myObject.message}`.

The optional `constructorOpt` argument accepts a function. If given, all frames
above `constructorOpt`, including `constructorOpt`, will be omitted from the
generated stack trace.

The `constructorOpt` argument is useful for hiding implementation
details of error generation from the user. For instance:

```js
function a() {
  b();
}

function b() {
  c();
}

function c() {
  // Create an error without stack trace to avoid calculating the stack trace twice.
  const { stackTraceLimit } = Error;
  Error.stackTraceLimit = 0;
  const error = new Error();
  Error.stackTraceLimit = stackTraceLimit;

  // Capture the stack trace above function b
  Error.captureStackTrace(error, b); // Neither function c, nor b is included in the stack trace
  throw error;
}

a();
```

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `targetObject` | `object` |
| `constructorOpt?` | `Function` |

#### Returns

`void`

#### Inherited from

[`XMLError`](#classesxmlerrormd).[`captureStackTrace`](#capturestacktrace)

***

### prepareStackTrace()

```ts
static prepareStackTrace(err: Error, stackTraces: CallSite[]): any;
```

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `err` | `Error` |
| `stackTraces` | `CallSite`[] |

#### Returns

`any`

#### See

https://v8.dev/docs/stack-trace-api#customizing-stack-traces

#### Inherited from

[`XMLError`](#classesxmlerrormd).[`prepareStackTrace`](#preparestacktrace)


<a name="classestextnodemd"></a>

# TextNode

A class describing a TextNode.

## Extends

- [`Node`](#classesnodemd)

## Constructors

### Constructor

```ts
new TextNode(value?: any): TextNode;
```

Constructs a new TextNode instance.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value?` | `any` | The data for the node. |

#### Returns

`TextNode`

#### Overrides

[`Node`](#classesnodemd).[`constructor`](#constructor)

## Properties

| Property | Type | Default value | Description | Inherited from |
| ------ | ------ | ------ | ------ | ------ |
| <a id="childnodes"></a> `childNodes` | [`Node`](#classesnodemd)[] | `[]` | The node's immediate children. | [`Node`](#classesnodemd).[`childNodes`](#childnodes) |
| <a id="data"></a> `data` | `string` | `undefined` | The node's data value. | - |
| <a id="nodename"></a> `nodeName` | `string` | `'#node'` | A node type string identifier. | [`Node`](#classesnodemd).[`nodeName`](#nodename) |
| <a id="nodetype"></a> `nodeType` | `number` | `0` | A numerical node type identifier. | [`Node`](#classesnodemd).[`nodeType`](#nodetype) |
| <a id="parentnode"></a> `parentNode` | [`Node`](#classesnodemd) \| `null` | `null` | The node's parent node. | [`Document`](#classesdocumentmd).[`parentNode`](#parentnode) |

## Accessors

### firstChild

#### Get Signature

```ts
get firstChild(): Node | null;
```

Returns the node's first child in the tree, or null if the node has no children.

##### Returns

[`Node`](#classesnodemd) \| `null`

#### Inherited from

[`Node`](#classesnodemd).[`firstChild`](#firstchild)

***

### lastChild

#### Get Signature

```ts
get lastChild(): Node | null;
```

Returns the node's last child in the tree, or null if the node has no children.

##### Returns

[`Node`](#classesnodemd) \| `null`

#### Inherited from

[`Node`](#classesnodemd).[`lastChild`](#lastchild)

***

### nodeValue

#### Get Signature

```ts
get nodeValue(): string;
```

##### Returns

`string`

#### Set Signature

```ts
set nodeValue(value: string): void;
```

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `string` |

##### Returns

`void`

***

### preserveSpace

#### Get Signature

```ts
get preserveSpace(): boolean;
```

True if xml:space has been set to true for this node or any of its ancestors.

##### Returns

`boolean`

#### Inherited from

[`Node`](#classesnodemd).[`preserveSpace`](#preservespace)

***

### textContent

#### Get Signature

```ts
get textContent(): string;
```

The text content of this node (and its children).

##### Returns

`string`

#### Overrides

[`Node`](#classesnodemd).[`textContent`](#textcontent)

## Methods

### appendChild()

```ts
appendChild<T extends Node | DocumentFragment>(this: Node, node: T): T;
```

Appends a child node into the current one.

#### Type Parameters

| Type Parameter |
| ------ |
| <a id="type-parameter-t"></a> `T` *extends* [`Node`](#classesnodemd) \| [`DocumentFragment`](#classesdocumentfragmentmd) |

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `this` | [`Node`](#classesnodemd) | - |
| `node` | `T` | The new child node |

#### Returns

`T`

The same node that was passed in.

#### Inherited from

[`Node`](#classesnodemd).[`appendChild`](#appendchild)

***

### insertBefore()

```ts
insertBefore<T extends Node | DocumentFragment>(newNode: T, referenceNode: Node | null): T;
```

Inserts a node before a _reference node_ as a child of a specified _parent node_.

#### Type Parameters

| Type Parameter |
| ------ |
| <a id="type-parameter-t-1"></a> `T` *extends* [`Node`](#classesnodemd) \| [`DocumentFragment`](#classesdocumentfragmentmd) |

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `newNode` | `T` | The node to be inserted. |
| `referenceNode` | [`Node`](#classesnodemd) \| `null` | The node before which newNode is inserted. If this is null, then newNode is inserted at the end of node's child nodes. |

#### Returns

`T`

The node or DocumentFragment that was passed in.

#### Throws

If newNode is this node or one of its ancestors.

#### Throws

If referenceNode is not a child of this node.

#### Inherited from

[`Node`](#classesnodemd).[`insertBefore`](#insertbefore)

***

### isDefaultNamespace()

```ts
isDefaultNamespace(namespaceURI: string | null): boolean;
```

Test if a namespace URI is the default namespace at this node.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `namespaceURI` | `string` \| `null` | The namespace URI to test, or null for no namespace. |

#### Returns

`boolean`

True if unprefixed elements here belong to the namespace.

#### Inherited from

[`Node`](#classesnodemd).[`isDefaultNamespace`](#isdefaultnamespace)

***

### isEqualNode()

```ts
isEqualNode(otherNode: Node | DocumentFragment | null): boolean;
```

Test if a node is equal to this one, as in the DOM. Nodes are equal if
they are of the same type, have the same names, namespaces, and data,
have the same attributes in any order, and have equal children in the
same order. Parents and owner elements are not compared, so equal
subtrees in different places, or different documents, are equal.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `otherNode` | [`Node`](#classesnodemd) \| [`DocumentFragment`](#classesdocumentfragmentmd) \| `null` | The node to compare with. |

#### Returns

`boolean`

True if the nodes are equal.

#### Inherited from

[`Node`](#classesnodemd).[`isEqualNode`](#isequalnode)

***

### lookupNamespaceURI()

```ts
lookupNamespaceURI(prefix: string | null): string | null;
```

Find the namespace URI that a prefix is bound to. As in the DOM, elements
resolve it from their own `xmlns` declarations and their ancestors', and
other nodes ask an element: a document its root, an attribute its owner
element, and anything else its parent element.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `prefix` | `string` \| `null` | The prefix to look up, or null for the default namespace. |

#### Returns

`string` \| `null`

The namespace URI, or null if the prefix is not bound.

#### Inherited from

[`Node`](#classesnodemd).[`lookupNamespaceURI`](#lookupnamespaceuri)

***

### lookupPrefix()

```ts
lookupPrefix(namespaceURI: string | null): string | null;
```

Find a prefix that is bound to a namespace URI. Nodes other than elements
ask an element, as `lookupNamespaceURI` does.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `namespaceURI` | `string` \| `null` | The namespace URI to look up. |

#### Returns

`string` \| `null`

The prefix, or null if no prefix is bound to the namespace.

#### Inherited from

[`Node`](#classesnodemd).[`lookupPrefix`](#lookupprefix)

***

### removeChild()

```ts
removeChild(child: Node): Node | undefined;
```

Removes a child node from the DOM and returns the removed node.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `child` | [`Node`](#classesnodemd) | The child node to be removed. |

#### Returns

[`Node`](#classesnodemd) \| `undefined`

The removed child node.

#### Inherited from

[`Node`](#classesnodemd).[`removeChild`](#removechild)

***

### toString()

```ts
toString(): string;
```

Returns a string representation of the node.

#### Returns

`string`

A formatted XML source.

#### Inherited from

[`Node`](#classesnodemd).[`toString`](#tostring)


<a name="classesxmlerrormd"></a>

# XMLError

Base class for all errors thrown by this library. Catching `XMLError`
will catch any of the library's specific error subclasses.

## Extends

- `Error`

## Extended by

- [`ParserError`](#classesparsererrormd)
- [`NamespaceError`](#classesnamespaceerrormd)
- [`HierarchyError`](#classeshierarchyerrormd)
- [`NotFoundError`](#classesnotfounderrormd)
- [`InUseAttributeError`](#classesinuseattributeerrormd)
- [`InvalidCharacterError`](#classesinvalidcharactererrormd)

## Constructors

### Constructor

```ts
new XMLError(message: string): XMLError;
```

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `message` | `string` |

#### Returns

`XMLError`

#### Overrides

`Error.constructor`

## Properties

| Property | Modifier | Type | Description | Inherited from |
| ------ | ------ | ------ | ------ | ------ |
| <a id="cause"></a> `cause?` | `public` | `unknown` | - | `Error.cause` |
| <a id="message"></a> `message` | `public` | `string` | - | `Error.message` |
| <a id="name"></a> `name` | `public` | `string` | - | `Error.name` |
| <a id="stack"></a> `stack?` | `public` | `string` | - | `Error.stack` |
| <a id="stacktracelimit"></a> `stackTraceLimit` | `static` | `number` | The `Error.stackTraceLimit` property specifies the number of stack frames collected by a stack trace (whether generated by `new Error().stack` or `Error.captureStackTrace(obj)`). The default value is `10` but may be set to any valid JavaScript number. Changes will affect any stack trace captured _after_ the value has been changed. If set to a non-number value, or set to a negative number, stack traces will not capture any frames. | `Error.stackTraceLimit` |

## Methods

### captureStackTrace()

```ts
static captureStackTrace(targetObject: object, constructorOpt?: Function): void;
```

Creates a `.stack` property on `targetObject`, which when accessed returns
a string representing the location in the code at which
`Error.captureStackTrace()` was called.

```js
const myObject = {};
Error.captureStackTrace(myObject);
myObject.stack;  // Similar to `new Error().stack`
```

The first line of the trace will be prefixed with
`${myObject.name}: ${myObject.message}`.

The optional `constructorOpt` argument accepts a function. If given, all frames
above `constructorOpt`, including `constructorOpt`, will be omitted from the
generated stack trace.

The `constructorOpt` argument is useful for hiding implementation
details of error generation from the user. For instance:

```js
function a() {
  b();
}

function b() {
  c();
}

function c() {
  // Create an error without stack trace to avoid calculating the stack trace twice.
  const { stackTraceLimit } = Error;
  Error.stackTraceLimit = 0;
  const error = new Error();
  Error.stackTraceLimit = stackTraceLimit;

  // Capture the stack trace above function b
  Error.captureStackTrace(error, b); // Neither function c, nor b is included in the stack trace
  throw error;
}

a();
```

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `targetObject` | `object` |
| `constructorOpt?` | `Function` |

#### Returns

`void`

#### Inherited from

`Error.captureStackTrace`

***

### prepareStackTrace()

```ts
static prepareStackTrace(err: Error, stackTraces: CallSite[]): any;
```

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `err` | `Error` |
| `stackTraces` | `CallSite`[] |

#### Returns

`any`

#### See

https://v8.dev/docs/stack-trace-api#customizing-stack-traces

#### Inherited from

`Error.prepareStackTrace`


<a name="functionsescapexmlmd"></a>

# escapeXML()

```ts
function escapeXML(s: string, attribute?: boolean): string;
```

Escape XML entities in a string. Characters that XML 1.0 doesn't allow
are written as `&#xFFFD;`, a reference to the replacement character.

In attribute values, LF and CR are written as `&#10;` and `&#13;`, because
parsers turn raw line breaks in attribute values into spaces.

## Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `s` | `string` | `undefined` | Unescaped string |
| `attribute?` | `boolean` | `false` | Escape the string for use as an attribute value |

## Returns

`string`

Escaped string


<a name="functionsiselementmd"></a>

# isElement()

```ts
function isElement(d: unknown): d is Element;
```

## Parameters

| Parameter | Type |
| ------ | ------ |
| `d` | `unknown` |

## Returns

`d is Element`


<a name="functionsparsexmlmd"></a>

# parseXML()

```ts
function parseXML(source: string, options?: {
  emptyDoc?: boolean;
  laxAttr?: boolean;
  ns?: boolean;
}): Document;
```

Parse an XML source and return a Node tree.

## Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `source` | `string` | `undefined` | The XML source to parse. |
| `options?` | \{ `emptyDoc?`: `boolean`; `laxAttr?`: `boolean`; `ns?`: `boolean`; \} | `DEFAULTOPTIONS` | Parsing options. |
| `options.emptyDoc?` | `boolean` | `undefined` | Permit "rootless" documents. |
| `options.laxAttr?` | `boolean` | `undefined` | Permit unquoted attributes (`<node foo=bar />`). |
| `options.ns?` | `boolean` | `undefined` | Validate xmlns and element namespaces as they are parsed. |

## Returns

[`Document`](#classesdocumentmd)

A DOM representing the XML node tree.


<a name="functionsprettyprintmd"></a>

# prettyPrint()

```ts
function prettyPrint(node: 
  | Node
  | DocumentFragment, indent?: string): string;
```

Serialize a node tree to an XML string with indentation and whitespace
formatting for readability.

Element children are placed on separate indented lines, except when the
element preserves whitespace (`xml:space="preserve"`), contains only text
nodes, or contains a single CDATA section.

## Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `node` | \| [`Node`](#classesnodemd) \| [`DocumentFragment`](#classesdocumentfragmentmd) | `undefined` | The node to serialize. |
| `indent?` | `string` | `''` | The indentation applied to the current depth. |

## Returns

`string`

The formatted XML string.


<a name="functionssimpleprintmd"></a>

# simplePrint()

```ts
function simplePrint(node: 
  | Node
  | DocumentFragment): string;
```

Serialize a node tree to a compact XML string without added whitespace,
preserving the original child order and content verbatim.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `node` | \| [`Node`](#classesnodemd) \| [`DocumentFragment`](#classesdocumentfragmentmd) | The node to serialize. |

## Returns

`string`

The serialized XML string.


<a name="type-aliasescreatechildargumentmd"></a>

# CreateChildArgument

```ts
type CreateChildArgument = 
  | Node
  | DocumentFragment
  | string
  | boolean
  | number
  | null
  | undefined;
```


<a name="type-aliasesjsonmlattrmd"></a>

# JsonMLAttr

```ts
type JsonMLAttr = Record<string, string | number | boolean | null>;
```


<a name="type-aliasesjsonmlelementmd"></a>

# JsonMLElement

```ts
type JsonMLElement = 
  | [string, JsonMLAttr, ...JsonMLElement[]]
  | [string, JsonMLAttr]
  | [string, ...JsonMLElement[]]
  | [string]
  | string;
```


<a name="type-aliasesnamednodemapmd"></a>

# NamedNodeMap

```ts
type NamedNodeMap = NamedNodeMapImpl & Readonly<Record<string, Attr | null>>;
```


<a name="type-aliasesxmlattrmd"></a>

# XMLAttr

```ts
type XMLAttr = Record<string, string | number | boolean | null | undefined>;
```


<a name="variablesattribute_nodemd"></a>

# ATTRIBUTE\_NODE

```ts
const ATTRIBUTE_NODE: number = 2;
```

An attribute node identifier


<a name="variablescdata_section_nodemd"></a>

# CDATA\_SECTION\_NODE

```ts
const CDATA_SECTION_NODE: number = 4;
```

A CData Section node identifier


<a name="variablescomment_nodemd"></a>

# COMMENT\_NODE

```ts
const COMMENT_NODE: number = 8;
```

A comment node identifier


<a name="variablesdocument_fragment_nodemd"></a>

# DOCUMENT\_FRAGMENT\_NODE

```ts
const DOCUMENT_FRAGMENT_NODE: number = 11;
```

A document fragment node identifier


<a name="variablesdocument_nodemd"></a>

# DOCUMENT\_NODE

```ts
const DOCUMENT_NODE: number = 9;
```

A document node identifier


<a name="variablesdocument_type_nodemd"></a>

# DOCUMENT\_TYPE\_NODE

```ts
const DOCUMENT_TYPE_NODE: number = 10;
```

A document type node identifier


<a name="variableselement_nodemd"></a>

# ELEMENT\_NODE

```ts
const ELEMENT_NODE: number = 1;
```

An element node identifier


<a name="variablesentity_nodemd"></a>

# ENTITY\_NODE

```ts
const ENTITY_NODE: number = 6;
```

An entity node identifier


<a name="variablesentity_reference_nodemd"></a>

# ENTITY\_REFERENCE\_NODE

```ts
const ENTITY_REFERENCE_NODE: number = 5;
```

An entity reference node identifier


<a name="variablesnotation_nodemd"></a>

# NOTATION\_NODE

```ts
const NOTATION_NODE: number = 12;
```

A documentation node identifier


<a name="variablesprocessing_instruction_nodemd"></a>

# PROCESSING\_INSTRUCTION\_NODE

```ts
const PROCESSING_INSTRUCTION_NODE: number = 7;
```

A processing instruction node identifier


<a name="variablestext_nodemd"></a>

# TEXT\_NODE

```ts
const TEXT_NODE: number = 3;
```

A text node identifier


<a name="variablesxml_declarationmd"></a>

# XML\_DECLARATION

```ts
const XML_DECLARATION: "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?>" = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>';
```

XML declaration string
