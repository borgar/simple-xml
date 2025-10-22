
<a name="readmemd"></a>

# @borgar/simple-xml

## Classes

- [CDataNode](#classescdatanodemd)
- [Document](#classesdocumentmd)
- [Element](#classeselementmd)
- [Node](#classesnodemd)
- [TextNode](#classestextnodemd)

## Type Aliases

- [JsonMLAttr](#type-aliasesjsonmlattrmd)
- [JsonMLElement](#type-aliasesjsonmlelementmd)

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

- [parseXML](#functionsparsexmlmd)


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
appendChild(node: Node): Node;
```

Appends a child node into the current one.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `node` | [`Node`](#classesnodemd) | The new child node |

#### Returns

[`Node`](#classesnodemd)

The same node that was passed in.

#### Inherited from

[`Node`](#classesnodemd).[`appendChild`](#appendchild)

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
appendChild(node: Element): Element;
```

Appends a child node into the current one.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `node` | [`Element`](#classeselementmd) | The new child node |

#### Returns

[`Element`](#classeselementmd)

The same node that was passed in.

#### Overrides

[`Node`](#classesnodemd).[`appendChild`](#appendchild)

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

### toJS()

```ts
toJS(): [] | JsonMLElement;
```

Returns a simple object representation of the node and its descendants.

#### Returns

\[\] \| [`JsonMLElement`](#type-aliasesjsonmlelementmd)

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
| `attr?` | `Record`\<`string`, `string`\> | `{}` | A collection of attributes to assign. |
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

### appendChild()

```ts
appendChild(node: Node): Node;
```

Appends a child node into the current one.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `node` | [`Node`](#classesnodemd) | The new child node |

#### Returns

[`Node`](#classesnodemd)

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

### setAttribute()

```ts
setAttribute(name: string, value: string): void;
```

Sets an attribute on the element.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `name` | `string` | The attribute name to read. |
| `value` | `string` | The value to set |

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
appendChild(node: Node): Node;
```

Appends a child node into the current one.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `node` | `Node` | The new child node |

#### Returns

`Node`

The same node that was passed in.

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
new TextNode(value?: string): TextNode;
```

Constructs a new TextNode instance.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value?` | `string` | The data for the node |

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
| <a id="parentnode"></a> `parentNode` | [`Node`](#classesnodemd) \| `null` | `null` | The node's parent node. | [`Node`](#classesnodemd).[`parentNode`](#parentnode) |
| <a id="value"></a> `value` | `string` | `undefined` | The node's data value. | - |

## Accessors

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
appendChild(node: Node): Node;
```

Appends a child node into the current one.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `node` | [`Node`](#classesnodemd) | The new child node |

#### Returns

[`Node`](#classesnodemd)

The same node that was passed in.

#### Inherited from

[`Node`](#classesnodemd).[`appendChild`](#appendchild)

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


<a name="functionsparsexmlmd"></a>

# parseXML()

```ts
function parseXML(source: string, options?: {
  emptyDoc?: boolean;
  laxAttr?: boolean;
}): Document;
```

Parse an XML source and return a Node tree.

## Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `source` | `string` | `undefined` | The XML source to parse. |
| `options?` | \{ `emptyDoc?`: `boolean`; `laxAttr?`: `boolean`; \} | `DEFAULTOPTIONS` | Parsing options. |
| `options.emptyDoc?` | `boolean` | `undefined` | Permit "rootless" documents. |
| `options.laxAttr?` | `boolean` | `undefined` | Permit unquoted attributes (`<node foo=bar />`). |

## Returns

[`Document`](#classesdocumentmd)

A DOM representing the XML node tree.


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
