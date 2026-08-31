/**
 * Base class for all errors thrown by this library. Catching `XMLError`
 * will catch any of the library's specific error subclasses.
 */
export class XMLError extends Error {
  constructor (message: string) {
    super(message);
    this.name = 'XMLError';
  }
}

/**
 * Thrown when XML input cannot be parsed: malformed attributes, missing
 * declarations, premature EOF, content outside the root element, etc.
 */
export class ParserError extends XMLError {
  constructor (message: string) {
    super(message);
    this.name = 'ParserError';
  }
}

/**
 * Thrown for namespace-related problems: an unknown prefix, a prefix
 * re-bound to a different URI, or a lookup for a URI that hasn't been
 * declared.
 */
export class NamespaceError extends XMLError {
  constructor (message: string) {
    super(message);
    this.name = 'NamespaceError';
  }
}

/**
 * Thrown when an operation would violate the structure of the document
 * tree: e.g. inserting an ancestor as a descendant, giving a Document
 * more than one root, or requiring a root that isn't present.
 */
export class HierarchyError extends XMLError {
  constructor (message: string) {
    super(message);
    this.name = 'HierarchyError';
  }
}

/**
 * Thrown when an item referenced by name or identity cannot be found
 * (e.g. removing a child that isn't a child, or a named attribute that
 * isn't in the map).
 */
export class NotFoundError extends XMLError {
  constructor (message: string) {
    super(message);
    this.name = 'NotFoundError';
  }
}
