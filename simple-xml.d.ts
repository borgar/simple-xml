/** A class describing an CDataNode. */
export declare class CDataNode extends Node {
    /**
     * Constructs a new CDataNode instance.
     *
     * @param [value=''] The data for the node
     */
    constructor(value?: string);
    /**
     * Appends a child node into the current one.
     *
     * @param node The new child node
     * @returns The same node that was passed in.
     */
    appendChild(node: Node): Node;
    /** The node's children. */
    childNodes: Array<Node>;
    /** A node type string identifier. */
    nodeName: string;
    /** A numerical node type identifier. */
    nodeType: (number | null);
    /** The node's parent node. */
    parentNode: (Node | null);
    /** True if xml:space has been set to true for this node or any of its ancestors. */
    preserveSpace: boolean;
    /** The text content of this node (and its children). */
    textContent: string;
    /**
     * Returns a string representation of the node.
     *
     * @returns A formatted XML source.
     */
    toString(): string;
    /** The nodes data value. */
    value: string;
}

/** This class describes an XML document. */
export declare class Document extends Node {
    /**
     * Appends a child node into the current one.
     *
     * @param node The new child node
     * @returns The same node that was passed in.
     */
    appendChild(node: Node): Node;
    /** The node's children. */
    childNodes: Array<Node>;
    /** A list containing all child Elements of the current Element. */
    children: Array<Node>;
    /**
     * Return all descendant elements that have the specified tag name.
     *
     * @param tagName The tag name to filter by.
     * @returns The elements by tag name.
     */
    getElementsByTagName(tagName: string): Array<Element>;
    /** A node type string identifier. */
    nodeName: string;
    /** A numerical node type identifier. */
    nodeType: (number | null);
    /** The node's parent node. */
    parentNode: (Node | null);
    /** True if xml:space has been set to true for this node or any of its ancestors. */
    preserveSpace: boolean;
    /**
     * Return the first descendant element that match a specified CSS selector.
     *
     * @param selector The CSS selector to filter by.
     * @returns The elements by tag name.
     */
    querySelector(selector: string): (Element | null);
    /**
     * Return all descendant elements that match a specified CSS selector.
     *
     * @param selector The CSS selector to filter by.
     * @returns The elements by tag name.
     */
    querySelectorAll(selector: string): Array<Element>;
    /** The text content of this node (and its children). */
    textContent: string;
    /**
     * Returns a simple object representation of the node and its descendants.
     *
     * @returns JsonML representation of the nodes and its subtree.
     */
    toJS(): (Array<any> | null);
    /**
     * Returns a string representation of the node.
     *
     * @returns A formatted XML source.
     */
    toString(): string;
}

/** A class describing an Element. */
export declare class Element extends Node {
    /**
     * Constructs a new Element instance.
     *
     * @param tagName The tag name of the node.
     * @param [attr={}] A collection of attributes to assign.
     * @param [closed=false] Was the element "self-closed" when read.
     */
    constructor(tagName: string, attr?: object, closed?: boolean);
    /**
     * Appends a child node into the current one.
     *
     * @param node The new child node
     * @returns The same node that was passed in.
     */
    appendChild(node: Node): Node;
    /** An object of attributes assigned to this element. */
    attr: Record<string, string>;
    /** The node's children. */
    childNodes: Array<Node>;
    /** A list containing all child Elements of the current Element. */
    children: Array<Element>;
    /** A state representing if the element was "self-closed" when read. */
    closed: boolean;
    /** The full name of the tag for the given element, including a namespace prefix. */
    fullName: string;
    /**
     * Read an attribute from the element.
     *
     * @param name The attribute name to read.
     * @returns The attribute.
     */
    getAttribute(name: string): (string | null);
    /**
     * Return all descendant elements that have the specified tag name.
     *
     * @param tagName The tag name to filter by.
     * @returns The elements by tag name.
     */
    getElementsByTagName(tagName: string): Array<Element>;
    /**
     * Test if an attribute exists on the element.
     *
     * @param name The attribute name to test for.
     * @returns True if the attribute is present.
     */
    hasAttribute(name: string): boolean;
    /** A node type string identifier. */
    nodeName: string;
    /** A numerical node type identifier. */
    nodeType: (number | null);
    /** The namespace prefix of the element, or null if no prefix is specified. */
    ns: string;
    /** The node's parent node. */
    parentNode: (Node | null);
    /** True if xml:space has been set to true for this node or any of its ancestors. */
    preserveSpace: boolean;
    /**
     * Return the first descendant element that match a specified CSS selector.
     *
     * @param selector The CSS selector to filter by.
     * @returns The elements by tag name.
     */
    querySelector(selector: string): (Element | null);
    /**
     * Return all descendant elements that match a specified CSS selector.
     *
     * @param selector The CSS selector to filter by.
     * @returns The elements by tag name.
     */
    querySelectorAll(selector: string): Array<Element>;
    /**
     * Remove an attribute off the element.
     *
     * @param name The attribute name to remove.
     */
    removeAttribute(name: string): void;
    /**
     * Sets an attribute on the element.
     *
     * @param name The attribute name to read.
     * @param value The value to set
     */
    setAttribute(name: string, value: string): void;
    /** The name of the tag for the given element, excluding any namespace prefix. */
    tagName: string;
    /** The text content of this node (and its children). */
    textContent: string;
    /**
     * Returns a simple object representation of the node and its descendants.
     *
     * @returns JsonML representation of the nodes and its subtree.
     */
    toJS(): (Array<any> | string);
    /**
     * Returns a string representation of the node.
     *
     * @returns A formatted XML source.
     */
    toString(): string;
}

/** A class describing a Node. */
export declare class Node {
    /** Constructs a new Node instance. */
    constructor();
    /**
     * Appends a child node into the current one.
     *
     * @param node The new child node
     * @returns The same node that was passed in.
     */
    appendChild(node: Node): Node;
    /** The node's children. */
    childNodes: Array<Node>;
    /** A node type string identifier. */
    nodeName: string;
    /** A numerical node type identifier. */
    nodeType: (number | null);
    /** The node's parent node. */
    parentNode: (Node | null);
    /** True if xml:space has been set to true for this node or any of its ancestors. */
    preserveSpace: boolean;
    /** The text content of this node (and its children). */
    textContent: string;
    /**
     * Returns a string representation of the node.
     *
     * @returns A formatted XML source.
     */
    toString(): string;
}

/** A class describing a TextNode. */
export declare class TextNode extends Node {
    /**
     * Constructs a new TextNode instance.
     *
     * @param [value=''] The data for the node
     */
    constructor(value?: string);
    /**
     * Appends a child node into the current one.
     *
     * @param node The new child node
     * @returns The same node that was passed in.
     */
    appendChild(node: Node): Node;
    /** The node's children. */
    childNodes: Array<Node>;
    /** A node type string identifier. */
    nodeName: string;
    /** A numerical node type identifier. */
    nodeType: (number | null);
    /** The node's parent node. */
    parentNode: (Node | null);
    /** True if xml:space has been set to true for this node or any of its ancestors. */
    preserveSpace: boolean;
    /** The text content of this node (and its children). */
    textContent: string;
    /**
     * Returns a string representation of the node.
     *
     * @returns A formatted XML source.
     */
    toString(): string;
    /** The node's data value. */
    value: string;
}

/**
 * Parse an XML source and return a Node tree.
 *
 * @param source The XML source to parse.
 * @param [options={}] Parsing options.
 * @param [options.emptyDoc=false] Permit "rootless" documents.
 * @param [options.laxAttr=false] Permit unquoted attributes (`<node foo=bar />`).
 * @returns A DOM representing the XML node tree.
 */
export declare function parseXML(source: string, options?: {
    /** Permit "rootless" documents. */
    emptyDoc?: boolean;
    /** Permit unquoted attributes (`<node foo=bar />`). */
    laxAttr?: boolean;
}): Document;

/** An attribute node identifier */
export declare const ATTRIBUTE_NODE: number;

/** A CData Section node identifier */
export declare const CDATA_SECTION_NODE: number;

/** A comment node identifier */
export declare const COMMENT_NODE: number;

/** A document fragment node identifier */
export declare const DOCUMENT_FRAGMENT_NODE: number;

/** A document node identifier */
export declare const DOCUMENT_NODE: number;

/** A document type node identifier */
export declare const DOCUMENT_TYPE_NODE: number;

/** An element node identifier */
export declare const ELEMENT_NODE: number;

/** An entity node identifier */
export declare const ENTITY_NODE: number;

/** An entity reference node identifier */
export declare const ENTITY_REFERENCE_NODE: number;

/** A documentation node identifier */
export declare const NOTATION_NODE: number;

/** A processing instruction node identifier */
export declare const PROCESSING_INSTRUCTION_NODE: number;

/** A text node identifier */
export declare const TEXT_NODE: number;

