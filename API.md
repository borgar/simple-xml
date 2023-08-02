# _Simple-xml_ API

**Classes**

- [CDataNode( _\[value\]_ )](#CDataNode)
  - [.constructor( _\[value\]_ )](#CDataNode.constructor)
  - [.appendChild( node )](#CDataNode.appendChild)
  - [.childNodes](#CDataNode.childNodes)
  - [.nodeName](#CDataNode.nodeName)
  - [.nodeType](#CDataNode.nodeType)
  - [.parentNode](#CDataNode.parentNode)
  - [.preserveSpace](#CDataNode.preserveSpace)
  - [.textContent](#CDataNode.textContent)
  - [.value](#CDataNode.value)
- [Document()](#Document)
  - [.appendChild( node )](#Document.appendChild)
  - [.childNodes](#Document.childNodes)
  - [.children()](#Document.children)
  - [.getElementsByTagName( tagName )](#Document.getElementsByTagName)
  - [.nodeName](#Document.nodeName)
  - [.nodeType](#Document.nodeType)
  - [.parentNode](#Document.parentNode)
  - [.preserveSpace](#Document.preserveSpace)
  - [.querySelectorAll( selector )](#Document.querySelectorAll)
  - [.textContent](#Document.textContent)
  - [.toJS()](#Document.toJS)
- [Element( tagName, _\[attr, closed\]_ )](#Element)
  - [.constructor( tagName, _\[attr, closed\]_ )](#Element.constructor)
  - [.appendChild( node )](#Element.appendChild)
  - [.attr](#Element.attr)
  - [.childNodes](#Element.childNodes)
  - [.children()](#Element.children)
  - [.closed](#Element.closed)
  - [.fullName](#Element.fullName)
  - [.getAttribute( name )](#Element.getAttribute)
  - [.getElementsByTagName( tagName )](#Element.getElementsByTagName)
  - [.hasAttribute( name )](#Element.hasAttribute)
  - [.nodeName](#Element.nodeName)
  - [.nodeType](#Element.nodeType)
  - [.ns](#Element.ns)
  - [.parentNode](#Element.parentNode)
  - [.preserveSpace](#Element.preserveSpace)
  - [.querySelectorAll( selector )](#Element.querySelectorAll)
  - [.removeAttribute( name )](#Element.removeAttribute)
  - [.setAttribute( name, value )](#Element.setAttribute)
  - [.tagName](#Element.tagName)
  - [.textContent](#Element.textContent)
  - [.toJS()](#Element.toJS)
- [Node()](#Node)
  - [.constructor()](#Node.constructor)
  - [.appendChild( node )](#Node.appendChild)
  - [.childNodes](#Node.childNodes)
  - [.nodeName](#Node.nodeName)
  - [.nodeType](#Node.nodeType)
  - [.parentNode](#Node.parentNode)
  - [.preserveSpace()](#Node.preserveSpace)
  - [.textContent()](#Node.textContent)
- [TextNode( _\[value\]_ )](#TextNode)
  - [.constructor( _\[value\]_ )](#TextNode.constructor)
  - [.appendChild( node )](#TextNode.appendChild)
  - [.childNodes](#TextNode.childNodes)
  - [.nodeName](#TextNode.nodeName)
  - [.nodeType](#TextNode.nodeType)
  - [.parentNode](#TextNode.parentNode)
  - [.preserveSpace](#TextNode.preserveSpace)
  - [.textContent](#TextNode.textContent)
  - [.value](#TextNode.value)

**Function**

- [parseXML( source, _\[options\]_ )](#parseXML)

**Constants**

- [ATTRIBUTE_NODE](#ATTRIBUTE_NODE)
- [CDATA_SECTION_NODE](#CDATA_SECTION_NODE)
- [COMMENT_NODE](#COMMENT_NODE)
- [DOCUMENT_FRAGMENT_NODE](#DOCUMENT_FRAGMENT_NODE)
- [DOCUMENT_NODE](#DOCUMENT_NODE)
- [DOCUMENT_TYPE_NODE](#DOCUMENT_TYPE_NODE)
- [ELEMENT_NODE](#ELEMENT_NODE)
- [ENTITY_NODE](#ENTITY_NODE)
- [ENTITY_REFERENCE_NODE](#ENTITY_REFERENCE_NODE)
- [NOTATION_NODE](#NOTATION_NODE)
- [PROCESSING_INSTRUCTION_NODE](#PROCESSING_INSTRUCTION_NODE)
- [TEXT_NODE](#TEXT_NODE)

## Classes

### <a id="CDataNode" href="#CDataNode">#</a> CDataNode( _[value = `""`]_ ) extends [`Node`](#Node)

A class describing an CDataNode.

---

#### <a id="CDataNode.constructor" href="#CDataNode.constructor">#</a> .constructor( _[value = `""`]_ )

Constructs a new CDataNode instance.

##### Parameters

| Name    | Type     | Default | Description           |
| ------- | -------- | ------- | --------------------- |
| [value] | `string` | `""`    | The data for the node |

---

#### <a id="CDataNode.appendChild" href="#CDataNode.appendChild">#</a> .appendChild( node ) ⇒ [`Node`](#Node)

Appends a child node into the current one.

##### Parameters

| Name | Type            | Description        |
| ---- | --------------- | ------------------ |
| node | [`Node`](#Node) | The new child node |

##### Returns

[`Node`](#Node) – The same node that was passed in.

---

#### <a id="CDataNode.childNodes" href="#CDataNode.childNodes">#</a> .childNodes

The node's children.

---

#### <a id="CDataNode.nodeName" href="#CDataNode.nodeName">#</a> .nodeName

A node type string identifier.

---

#### <a id="CDataNode.nodeType" href="#CDataNode.nodeType">#</a> .nodeType

A numerical node type identifier.

---

#### <a id="CDataNode.parentNode" href="#CDataNode.parentNode">#</a> .parentNode

The node's parent node.

---

#### <a id="CDataNode.preserveSpace" href="#CDataNode.preserveSpace">#</a> .preserveSpace

True if xml:space has been set to true for this node or any of its ancestors.

---

#### <a id="CDataNode.textContent" href="#CDataNode.textContent">#</a> .textContent

The text content of this node (and its children).

---

#### <a id="CDataNode.value" href="#CDataNode.value">#</a> .value

The nodes data value.

---

### <a id="Document" href="#Document">#</a> Document() extends [`Node`](#Node)

This class describes an XML document.

---

#### <a id="Document.appendChild" href="#Document.appendChild">#</a> .appendChild( node ) ⇒ [`Node`](#Node)

Appends a child node into the current one.

##### Parameters

| Name | Type            | Description        |
| ---- | --------------- | ------------------ |
| node | [`Node`](#Node) | The new child node |

##### Returns

[`Node`](#Node) – The same node that was passed in.

---

#### <a id="Document.childNodes" href="#Document.childNodes">#</a> .childNodes

The node's children.

---

#### <a id="Document.children" href="#Document.children">#</a> .children() ⇒ `void`

A list containing all child Elements of the current Element.

---

#### <a id="Document.getElementsByTagName" href="#Document.getElementsByTagName">#</a> .getElementsByTagName( tagName ) ⇒ `Array<Node>`

Return all child elements that have the specified tag name.

##### Parameters

| Name    | Type     | Description                |
| ------- | -------- | -------------------------- |
| tagName | `string` | The tag name to filter by. |

##### Returns

`Array<Node>` – The elements by tag name.

---

#### <a id="Document.nodeName" href="#Document.nodeName">#</a> .nodeName

A node type string identifier.

---

#### <a id="Document.nodeType" href="#Document.nodeType">#</a> .nodeType

A numerical node type identifier.

---

#### <a id="Document.parentNode" href="#Document.parentNode">#</a> .parentNode

The node's parent node.

---

#### <a id="Document.preserveSpace" href="#Document.preserveSpace">#</a> .preserveSpace

True if xml:space has been set to true for this node or any of its ancestors.

---

#### <a id="Document.querySelectorAll" href="#Document.querySelectorAll">#</a> .querySelectorAll( selector ) ⇒ `Array<Node>`

Return all child elements that match a specified CSS selector.

##### Parameters

| Name     | Type     | Description                    |
| -------- | -------- | ------------------------------ |
| selector | `string` | The CSS selector to filter by. |

##### Returns

`Array<Node>` – The elements by tag name.

---

#### <a id="Document.textContent" href="#Document.textContent">#</a> .textContent

The text content of this node (and its children).

---

#### <a id="Document.toJS" href="#Document.toJS">#</a> .toJS() ⇒ `Array<any>` | `null`

Returns a simple object representation of the node and its descendants.

##### Returns

`Array<any>` | `null` – JsonML representation of the nodes and its subtree.

---

### <a id="Element" href="#Element">#</a> Element( tagName, _[attr = `{}`, closed]_ ) extends [`Node`](#Node)

A class describing an Element.

---

#### <a id="Element.constructor" href="#Element.constructor">#</a> .constructor( tagName, _[attr = `{}`, closed]_ )

Constructs a new Element instance.

##### Parameters

| Name     | Type      | Default | Description                              |
| -------- | --------- | ------- | ---------------------------------------- |
| tagName  | `string`  |         | The tag name of the node.                |
| [attr]   | `object`  | `{}`    | A collection of attributes to assign.    |
| [closed] | `boolean` | `false` | Was the element "self-closed" when read. |

---

#### <a id="Element.appendChild" href="#Element.appendChild">#</a> .appendChild( node ) ⇒ [`Node`](#Node)

Appends a child node into the current one.

##### Parameters

| Name | Type            | Description        |
| ---- | --------------- | ------------------ |
| node | [`Node`](#Node) | The new child node |

##### Returns

[`Node`](#Node) – The same node that was passed in.

---

#### <a id="Element.attr" href="#Element.attr">#</a> .attr

An object of attributes assigned to this element.

---

#### <a id="Element.childNodes" href="#Element.childNodes">#</a> .childNodes

The node's children.

---

#### <a id="Element.children" href="#Element.children">#</a> .children() ⇒ `void`

A list containing all child Elements of the current Element.

---

#### <a id="Element.closed" href="#Element.closed">#</a> .closed

A state representing if the element was "self-closed" when read.

---

#### <a id="Element.fullName" href="#Element.fullName">#</a> .fullName

The full name of the tag for the given element, including a namespace prefix.

---

#### <a id="Element.getAttribute" href="#Element.getAttribute">#</a> .getAttribute( name ) ⇒ `string` | `null`

Read an attribute from the element.

##### Parameters

| Name | Type     | Description                 |
| ---- | -------- | --------------------------- |
| name | `string` | The attribute name to read. |

##### Returns

`string` | `null` – The attribute.

---

#### <a id="Element.getElementsByTagName" href="#Element.getElementsByTagName">#</a> .getElementsByTagName( tagName ) ⇒ `Array<Node>`

Return all child elements that have the specified tag name.

##### Parameters

| Name    | Type     | Description                |
| ------- | -------- | -------------------------- |
| tagName | `string` | The tag name to filter by. |

##### Returns

`Array<Node>` – The elements by tag name.

---

#### <a id="Element.hasAttribute" href="#Element.hasAttribute">#</a> .hasAttribute( name ) ⇒ `boolean`

Test if an attribute exists on the element.

##### Parameters

| Name | Type     | Description                     |
| ---- | -------- | ------------------------------- |
| name | `string` | The attribute name to test for. |

##### Returns

`boolean` – True if the attribute is present.

---

#### <a id="Element.nodeName" href="#Element.nodeName">#</a> .nodeName

A node type string identifier.

---

#### <a id="Element.nodeType" href="#Element.nodeType">#</a> .nodeType

A numerical node type identifier.

---

#### <a id="Element.ns" href="#Element.ns">#</a> .ns

The namespace prefix of the element, or null if no prefix is specified.

---

#### <a id="Element.parentNode" href="#Element.parentNode">#</a> .parentNode

The node's parent node.

---

#### <a id="Element.preserveSpace" href="#Element.preserveSpace">#</a> .preserveSpace

True if xml:space has been set to true for this node or any of its ancestors.

---

#### <a id="Element.querySelectorAll" href="#Element.querySelectorAll">#</a> .querySelectorAll( selector ) ⇒ `Array<Node>`

Return all child elements that match a specified CSS selector.

##### Parameters

| Name     | Type     | Description                    |
| -------- | -------- | ------------------------------ |
| selector | `string` | The CSS selector to filter by. |

##### Returns

`Array<Node>` – The elements by tag name.

---

#### <a id="Element.removeAttribute" href="#Element.removeAttribute">#</a> .removeAttribute( name ) ⇒ `void`

Remove an attribute off the element.

##### Parameters

| Name | Type     | Description                   |
| ---- | -------- | ----------------------------- |
| name | `string` | The attribute name to remove. |

---

#### <a id="Element.setAttribute" href="#Element.setAttribute">#</a> .setAttribute( name, value ) ⇒ `void`

Sets an attribute on the element.

##### Parameters

| Name  | Type     | Description                 |
| ----- | -------- | --------------------------- |
| name  | `string` | The attribute name to read. |
| value | `string` | The value to set            |

---

#### <a id="Element.tagName" href="#Element.tagName">#</a> .tagName

The name of the tag for the given element, excluding any namespace prefix.

---

#### <a id="Element.textContent" href="#Element.textContent">#</a> .textContent

The text content of this node (and its children).

---

#### <a id="Element.toJS" href="#Element.toJS">#</a> .toJS() ⇒ `Array<any>` | `string`

Returns a simple object representation of the node and its descendants.

##### Returns

`Array<any>` | `string` – JsonML representation of the nodes and its subtree.

---

### <a id="Node" href="#Node">#</a> Node()

A class describing a Node.

---

#### <a id="Node.constructor" href="#Node.constructor">#</a> .constructor()

Constructs a new Node instance.

---

#### <a id="Node.appendChild" href="#Node.appendChild">#</a> .appendChild( node ) ⇒ [`Node`](#Node)

Appends a child node into the current one.

##### Parameters

| Name | Type            | Description        |
| ---- | --------------- | ------------------ |
| node | [`Node`](#Node) | The new child node |

##### Returns

[`Node`](#Node) – The same node that was passed in.

---

#### <a id="Node.childNodes" href="#Node.childNodes">#</a> .childNodes

The node's children.

---

#### <a id="Node.nodeName" href="#Node.nodeName">#</a> .nodeName

A node type string identifier.

---

#### <a id="Node.nodeType" href="#Node.nodeType">#</a> .nodeType

A numerical node type identifier.

---

#### <a id="Node.parentNode" href="#Node.parentNode">#</a> .parentNode

The node's parent node.

---

#### <a id="Node.preserveSpace" href="#Node.preserveSpace">#</a> .preserveSpace() ⇒ `void`

True if xml:space has been set to true for this node or any of its ancestors.

---

#### <a id="Node.textContent" href="#Node.textContent">#</a> .textContent() ⇒ `void`

The text content of this node (and its children).

---

### <a id="TextNode" href="#TextNode">#</a> TextNode( _[value = `""`]_ ) extends [`Node`](#Node)

A class describing a TextNode.

---

#### <a id="TextNode.constructor" href="#TextNode.constructor">#</a> .constructor( _[value = `""`]_ )

Constructs a new TextNode instance.

##### Parameters

| Name    | Type     | Default | Description           |
| ------- | -------- | ------- | --------------------- |
| [value] | `string` | `""`    | The data for the node |

---

#### <a id="TextNode.appendChild" href="#TextNode.appendChild">#</a> .appendChild( node ) ⇒ [`Node`](#Node)

Appends a child node into the current one.

##### Parameters

| Name | Type            | Description        |
| ---- | --------------- | ------------------ |
| node | [`Node`](#Node) | The new child node |

##### Returns

[`Node`](#Node) – The same node that was passed in.

---

#### <a id="TextNode.childNodes" href="#TextNode.childNodes">#</a> .childNodes

The node's children.

---

#### <a id="TextNode.nodeName" href="#TextNode.nodeName">#</a> .nodeName

A node type string identifier.

---

#### <a id="TextNode.nodeType" href="#TextNode.nodeType">#</a> .nodeType

A numerical node type identifier.

---

#### <a id="TextNode.parentNode" href="#TextNode.parentNode">#</a> .parentNode

The node's parent node.

---

#### <a id="TextNode.preserveSpace" href="#TextNode.preserveSpace">#</a> .preserveSpace

True if xml:space has been set to true for this node or any of its ancestors.

---

#### <a id="TextNode.textContent" href="#TextNode.textContent">#</a> .textContent

The text content of this node (and its children).

---

#### <a id="TextNode.value" href="#TextNode.value">#</a> .value

The node's data value.

---

## Function

### <a id="parseXML" href="#parseXML">#</a> parseXML( source, _[options = `{}`]_ ) ⇒ [`Document`](#Document)

Parse an XML source and return a Node tree.

##### Parameters

| Name               | Type      | Default | Description                                      |
| ------------------ | --------- | ------- | ------------------------------------------------ |
| source             | `string`  |         | The XML source to parse.                         |
| [options]          | `object`  | `{}`    | Parsing options.                                 |
| [options].emptyDoc | `boolean` | `false` | Permit "rootless" documents.                     |
| [options].laxAttr  | `boolean` | `false` | Permit unquoted attributes (`<node foo=bar />`). |

##### Returns

[`Document`](#Document) – A DOM representing the XML node tree.

---

## Constants

### <a id="ATTRIBUTE_NODE" href="#ATTRIBUTE_NODE">#</a> ATTRIBUTE_NODE = `number`

An attribute node identifier

---

### <a id="CDATA_SECTION_NODE" href="#CDATA_SECTION_NODE">#</a> CDATA_SECTION_NODE = `number`

A CData Section node identifier

---

### <a id="COMMENT_NODE" href="#COMMENT_NODE">#</a> COMMENT_NODE = `number`

A comment node identifier

---

### <a id="DOCUMENT_FRAGMENT_NODE" href="#DOCUMENT_FRAGMENT_NODE">#</a> DOCUMENT_FRAGMENT_NODE = `number`

A document fragment node identifier

---

### <a id="DOCUMENT_NODE" href="#DOCUMENT_NODE">#</a> DOCUMENT_NODE = `number`

A document node identifier

---

### <a id="DOCUMENT_TYPE_NODE" href="#DOCUMENT_TYPE_NODE">#</a> DOCUMENT_TYPE_NODE = `number`

A document type node identifier

---

### <a id="ELEMENT_NODE" href="#ELEMENT_NODE">#</a> ELEMENT_NODE = `number`

An element node identifier

---

### <a id="ENTITY_NODE" href="#ENTITY_NODE">#</a> ENTITY_NODE = `number`

An entity node identifier

---

### <a id="ENTITY_REFERENCE_NODE" href="#ENTITY_REFERENCE_NODE">#</a> ENTITY_REFERENCE_NODE = `number`

An entity reference node identifier

---

### <a id="NOTATION_NODE" href="#NOTATION_NODE">#</a> NOTATION_NODE = `number`

A documentation node identifier

---

### <a id="PROCESSING_INSTRUCTION_NODE" href="#PROCESSING_INSTRUCTION_NODE">#</a> PROCESSING_INSTRUCTION_NODE = `number`

A processing instruction node identifier

---

### <a id="TEXT_NODE" href="#TEXT_NODE">#</a> TEXT_NODE = `number`

A text node identifier

---


