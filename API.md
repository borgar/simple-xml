
<a name="readmemd"></a>

# @borgar/simple-xml

## Classes

- [CDataNode](#classescdatanodemd)
- [Document](#classesdocumentmd)
- [DocumentFragment](#classesdocumentfragmentmd)
- [Element](#classeselementmd)
- [Node](#classesnodemd)
- [TextNode](#classestextnodemd)

## Type Aliases

- [CreateChildArgument](#type-aliasescreatechildargumentmd)
- [JsonMLAttr](#type-aliasesjsonmlattrmd)
- [JsonMLElement](#type-aliasesjsonmlelementmd)
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

## Functions

- [escapeXML](#functionsescapexmlmd)
- [isElement](#functionsiselementmd)
- [parseXML](#functionsparsexmlmd)
- [prettyPrint](#functionsprettyprintmd)
- [simplePrint](#functionssimpleprintmd)


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
appendChild<T>(node: T): T;
```

Appends a child node into the current one.

#### Type Parameters

| Type Parameter |
| ------ |
| `T` *extends* [`Node`](#classesnodemd) \| [`DocumentFragment`](#classesdocumentfragmentmd) |

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `node` | `T` | The new child node |

#### Returns

`T`

The same node that was passed in.

#### Inherited from

[`Node`](#classesnodemd).[`appendChild`](#appendchild)

***

### insertBefore()

```ts
insertBefore<T>(newNode: T, referenceNode: Node | null): T;
```

Inserts a node before a _reference node_ as a child of a specified _parent node_.

#### Type Parameters

| Type Parameter |
| ------ |
| `T` *extends* [`Node`](#classesnodemd) \| [`DocumentFragment`](#classesdocumentfragmentmd) |

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `newNode` | `T` | The node to be inserted. |
| `referenceNode` | [`Node`](#classesnodemd) \| `null` | The node before which newNode is inserted. If this is null, then newNode is inserted at the end of node's child nodes. |

#### Returns

`T`

The added child (unless newNode is a DocumentFragment, in which case the empty DocumentFragment is returned).

#### Inherited from

[`Node`](#classesnodemd).[`insertBefore`](#insertbefore)

***

### removeChild()

```ts
removeChild(child: Node): Node | undefined;
```

Removes a child node from the DOM and returns the removed node.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `child` | [`Node`](#classesnodemd) |

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
| <a id="root"></a> `root` | [`Element`](#classeselementmd) \| `null` | `null` | - | - |

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
appendChild<T>(node: T): T;
```

Appends a child node into the current one.

#### Type Parameters

| Type Parameter |
| ------ |
| `T` *extends* [`Node`](#classesnodemd) \| [`DocumentFragment`](#classesdocumentfragmentmd) |

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

```ts
(
   name: string, 
   attr?: XMLAttr | null, ...
   children: (
  | CreateChildArgument
  | CreateChildArgument[])[]): Element;
```

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `name` | `string` |
| `attr?` | [`XMLAttr`](#type-aliasesxmlattrmd) \| `null` |
| ...`children?` | ( \| [`CreateChildArgument`](#type-aliasescreatechildargumentmd) \| [`CreateChildArgument`](#type-aliasescreatechildargumentmd)[])[] |

##### Returns

[`Element`](#classeselementmd)

***

### createElement()

```ts
createElement(
   qualifiedName: string, 
   attr: XMLAttr | null | undefined, ...
   children: (
  | CreateChildArgument
  | CreateChildArgument[])[]): Element;
```

Create a new element node.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `qualifiedName` | `string` | The local tagName of the element. |
| `attr` | [`XMLAttr`](#type-aliasesxmlattrmd) \| `null` \| `undefined` | A record of attributes to assign to the new element. If the value is null or undefined, the attribute will be omitted. |
| ...`children` | ( \| [`CreateChildArgument`](#type-aliasescreatechildargumentmd) \| [`CreateChildArgument`](#type-aliasescreatechildargumentmd)[])[] | Nodes to insert as children. Strings will be converted to TextNodes and arrays will be flattened. |

#### Returns

[`Element`](#classeselementmd)

A new Element instance.

***

### createElementNS()

```ts
createElementNS(
   namespaceURI: string, 
   qualifiedName: string, 
   attr: XMLAttr | null | undefined, ...
   children: (
  | CreateChildArgument
  | CreateChildArgument[])[]): Element;
```

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `namespaceURI` | `string` |
| `qualifiedName` | `string` |
| `attr` | [`XMLAttr`](#type-aliasesxmlattrmd) \| `null` \| `undefined` |
| ...`children` | ( \| [`CreateChildArgument`](#type-aliasescreatechildargumentmd) \| [`CreateChildArgument`](#type-aliasescreatechildargumentmd)[])[] |

#### Returns

[`Element`](#classeselementmd)

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
insertBefore<T>(newNode: T, referenceNode: Node | null): T;
```

Inserts a node before a _reference node_ as a child of a specified _parent node_.

#### Type Parameters

| Type Parameter |
| ------ |
| `T` *extends* [`Node`](#classesnodemd) \| [`DocumentFragment`](#classesdocumentfragmentmd) |

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `newNode` | `T` | The node to be inserted. |
| `referenceNode` | [`Node`](#classesnodemd) \| `null` | The node before which newNode is inserted. If this is null, then newNode is inserted at the end of node's child nodes. |

#### Returns

`T`

The added child (unless newNode is a DocumentFragment, in which case the empty DocumentFragment is returned).

#### Inherited from

[`Node`](#classesnodemd).[`insertBefore`](#insertbefore)

***

### print()

```ts
print(pretty?: boolean): string;
```

Print the document as a string.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `pretty` | `boolean` | `false` | Apply automatic linebreaks and indentation to the output. |

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

| Parameter | Type |
| ------ | ------ |
| `child` | [`Node`](#classesnodemd) |

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
appendChild<T>(node: T): T;
```

Appends a child node into the document fragment.

#### Type Parameters

| Type Parameter |
| ------ |
| `T` *extends* [`Node`](#classesnodemd) \| `DocumentFragment` |

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `node` | `T` | The new child node |

#### Returns

`T`

The same node that was passed in.

***

### print()

```ts
print(pretty?: boolean): string;
```

Print the document as a string.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `pretty` | `boolean` | `false` | Apply automatic linebreaks and indentation to the output. |

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
new Element(
   tagName: string, 
   attr?: Record<string, string>, 
   closed?: boolean): Element;
```

Constructs a new Element instance.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `tagName` | `string` | `undefined` | The tag name of the node. |
| `attr?` | `Record`\<`string`, `string`\> | `{}` | A collection of attributes to assign. Values of null or undefined will be ignored. |
| `closed?` | `boolean` | `false` | Was the element "self-closed" when read. |

#### Returns

`Element`

#### Overrides

[`Node`](#classesnodemd).[`constructor`](#constructor)

## Properties

| Property | Type | Default value | Description | Overrides | Inherited from |
| ------ | ------ | ------ | ------ | ------ | ------ |
| <a id="attr"></a> `attr` | `Record`\<`string`, `string`\> | `undefined` | An object of attributes assigned to this element. | - | - |
| <a id="childnodes"></a> `childNodes` | [`Node`](#classesnodemd)[] | `[]` | The node's immediate children. | - | [`Node`](#classesnodemd).[`childNodes`](#childnodes) |
| <a id="closed"></a> `closed` | `boolean` | `undefined` | A state representing if the element was "self-closed" when read. | - | - |
| <a id="fullname"></a> `fullName` | `string` | `undefined` | The full name of the tag for the given element, including a namespace prefix. | - | - |
| <a id="nodename"></a> `nodeName` | `string` | `'#node'` | A node type string identifier. | - | [`Node`](#classesnodemd).[`nodeName`](#nodename) |
| <a id="nodetype"></a> `nodeType` | `number` | `0` | A numerical node type identifier. | - | [`Node`](#classesnodemd).[`nodeType`](#nodetype) |
| <a id="ns"></a> `ns` | `string` | `undefined` | The namespace prefix of the element, or null if no prefix is specified. | - | - |
| <a id="parentnode"></a> `parentNode` | `Element` \| `null` | `null` | The node's parent node. | [`Node`](#classesnodemd).[`parentNode`](#parentnode) | - |
| <a id="tagname"></a> `tagName` | `string` | `undefined` | The name of the tag for the given element, excluding any namespace prefix. | - | - |

## Accessors

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

[`Node`](#classesnodemd).[`firstChild`](#firstchild)

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

#### Overrides

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
appendChild<T>(node: T): T;
```

Appends a child node into the current one.

#### Type Parameters

| Type Parameter |
| ------ |
| `T` *extends* [`Node`](#classesnodemd) \| [`DocumentFragment`](#classesdocumentfragmentmd) |

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `node` | `T` | The new child node |

#### Returns

`T`

The same node that was passed in.

#### Inherited from

[`Node`](#classesnodemd).[`appendChild`](#appendchild)

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

### insertBefore()

```ts
insertBefore<T>(newNode: T, referenceNode: Node | null): T;
```

Inserts a node before a _reference node_ as a child of a specified _parent node_.

#### Type Parameters

| Type Parameter |
| ------ |
| `T` *extends* [`Node`](#classesnodemd) \| [`DocumentFragment`](#classesdocumentfragmentmd) |

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `newNode` | `T` | The node to be inserted. |
| `referenceNode` | [`Node`](#classesnodemd) \| `null` | The node before which newNode is inserted. If this is null, then newNode is inserted at the end of node's child nodes. |

#### Returns

`T`

The added child (unless newNode is a DocumentFragment, in which case the empty DocumentFragment is returned).

#### Inherited from

[`Node`](#classesnodemd).[`insertBefore`](#insertbefore)

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
| `pretty` | `boolean` | `false` | Apply automatic linebreaks and indentation to the output. |

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

Remove an attribute off the element.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `name` | `string` | The attribute name to remove. |

#### Returns

`void`

***

### removeChild()

```ts
removeChild(child: Node): Node | undefined;
```

Removes a child node from the DOM and returns the removed node.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `child` | [`Node`](#classesnodemd) |

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


<a name="classesnodemd"></a>

# Node

A class describing a Node.

## Extended by

- [`Element`](#classeselementmd)
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
appendChild<T>(node: T): T;
```

Appends a child node into the current one.

#### Type Parameters

| Type Parameter |
| ------ |
| `T` *extends* `Node` \| [`DocumentFragment`](#classesdocumentfragmentmd) |

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `node` | `T` | The new child node |

#### Returns

`T`

The same node that was passed in.

***

### insertBefore()

```ts
insertBefore<T>(newNode: T, referenceNode: Node | null): T;
```

Inserts a node before a _reference node_ as a child of a specified _parent node_.

#### Type Parameters

| Type Parameter |
| ------ |
| `T` *extends* `Node` \| [`DocumentFragment`](#classesdocumentfragmentmd) |

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `newNode` | `T` | The node to be inserted. |
| `referenceNode` | `Node` \| `null` | The node before which newNode is inserted. If this is null, then newNode is inserted at the end of node's child nodes. |

#### Returns

`T`

The added child (unless newNode is a DocumentFragment, in which case the empty DocumentFragment is returned).

***

### removeChild()

```ts
removeChild(child: Node): Node | undefined;
```

Removes a child node from the DOM and returns the removed node.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `child` | `Node` |

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
| <a id="nodename"></a> `nodeName` | `string` | `'#node'` | A node type string identifier. | [`Node`](#classesnodemd).[`nodeName`](#nodename) |
| <a id="nodetype"></a> `nodeType` | `number` | `0` | A numerical node type identifier. | [`Node`](#classesnodemd).[`nodeType`](#nodetype) |
| <a id="parentnode"></a> `parentNode` | [`Node`](#classesnodemd) \| `null` | `null` | The node's parent node. | [`Document`](#classesdocumentmd).[`parentNode`](#parentnode) |
| <a id="value"></a> `value` | `string` | `undefined` | The node's data value. | - |

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
appendChild<T>(node: T): T;
```

Appends a child node into the current one.

#### Type Parameters

| Type Parameter |
| ------ |
| `T` *extends* [`Node`](#classesnodemd) \| [`DocumentFragment`](#classesdocumentfragmentmd) |

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `node` | `T` | The new child node |

#### Returns

`T`

The same node that was passed in.

#### Inherited from

[`Node`](#classesnodemd).[`appendChild`](#appendchild)

***

### insertBefore()

```ts
insertBefore<T>(newNode: T, referenceNode: Node | null): T;
```

Inserts a node before a _reference node_ as a child of a specified _parent node_.

#### Type Parameters

| Type Parameter |
| ------ |
| `T` *extends* [`Node`](#classesnodemd) \| [`DocumentFragment`](#classesdocumentfragmentmd) |

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `newNode` | `T` | The node to be inserted. |
| `referenceNode` | [`Node`](#classesnodemd) \| `null` | The node before which newNode is inserted. If this is null, then newNode is inserted at the end of node's child nodes. |

#### Returns

`T`

The added child (unless newNode is a DocumentFragment, in which case the empty DocumentFragment is returned).

#### Inherited from

[`Node`](#classesnodemd).[`insertBefore`](#insertbefore)

***

### removeChild()

```ts
removeChild(child: Node): Node | undefined;
```

Removes a child node from the DOM and returns the removed node.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `child` | [`Node`](#classesnodemd) |

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


<a name="functionsescapexmlmd"></a>

# escapeXML()

```ts
function escapeXML(s: string): string;
```

Escape XML entities in a string.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `s` | `string` | Unescaped string |

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

## Parameters

| Parameter | Type | Default value |
| ------ | ------ | ------ |
| `node` | \| [`Node`](#classesnodemd) \| [`DocumentFragment`](#classesdocumentfragmentmd) | `undefined` |
| `indent` | `string` | `''` |

## Returns

`string`


<a name="functionssimpleprintmd"></a>

# simplePrint()

```ts
function simplePrint(node: 
  | Node
  | DocumentFragment): string;
```

## Parameters

| Parameter | Type |
| ------ | ------ |
| `node` | \| [`Node`](#classesnodemd) \| [`DocumentFragment`](#classesdocumentfragmentmd) |

## Returns

`string`


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
