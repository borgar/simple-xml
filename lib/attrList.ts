/**
 * Key of the own property that holds an element's attributes as a plain array.
 * The `NamedNodeMap` that `Element.attributes` returns wraps the same array.
 * Being an own enumerable property, the array is compared by deep equality
 * checks and kept by test tools that copy objects, and the printers can read
 * it without going through the proxy.
 *
 * @internal
 */
export const ATTRS: unique symbol = Symbol('attributes');
