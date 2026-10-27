import type { Attr } from './Attr.ts';
import { NotFoundError } from './errors.js';

/**
 * Runtime class for {@link NamedNodeMap}. Kept un-exported so that the public
 * `NamedNodeMap` type can be widened with an `Attr | null` index signature without
 * the index signature having to be compatible with the class's typed members
 * (`length`, `getNamedItem(): Attr | null`, etc.).
 */
class NamedNodeMapImpl {
  #attr: Attr[];

  constructor () {
    this.#attr = [];
  }

  item (index: number): Attr | null {
    return this.#attr[index] ?? null;
  }

  getNamedItem (qualifiedName: string) {
    return this.#attr.find(d => d.fullName === qualifiedName) ?? null;
  }

  // Returns the old attribute if replaced, or null if the attribute is new.
  setNamedItem (attr: Attr) {
    const fn = attr.fullName;
    const existing = this.#attr.findIndex(d => d.fullName === fn);
    if (existing > -1) {
      const old = this.#attr[existing];
      this.#attr[existing] = attr;
      return old;
    }
    else {
      this.#attr.push(attr);
    }
    return null;
  }

  removeNamedItem (qualifiedName: string) {
    const existing = this.#attr.findIndex(d => d.fullName === qualifiedName);
    if (existing > -1) {
      const old = this.#attr.splice(existing, 1);
      return old[0];
    }
    throw new NotFoundError(`No attribute with name '${qualifiedName}' was found.`);
  }

  get length () {
    return Object.keys(this.#attr).length;
  }

  *[Symbol.iterator] (): IterableIterator<Attr> {
    yield* this.#attr;
  }
}

const isIndex = (prop: string) => /^(0|[1-9]\d*)$/.test(prop);

// Resolves a property key to the Attr it exposes: an index, or a qualified name
// that isn't shadowed by a member of the class. Returns undefined otherwise.
function ownAttr (target: NamedNodeMapImpl, prop: string | symbol): Attr | undefined {
  if (typeof prop !== 'string' || prop in NamedNodeMapImpl.prototype) {
    return undefined;
  }
  const attr = isIndex(prop) ? target.item(Number(prop)) : target.getNamedItem(prop);
  return attr ?? undefined;
}

// Mirrors the DOM: indices are enumerable own properties, and qualified names
// are own properties that aren't enumerable.
const nameNodeMapProxy: ProxyHandler<NamedNodeMapImpl> = {
  get (target, prop) {
    if (prop in NamedNodeMapImpl.prototype) {
      const value: unknown = Reflect.get(target, prop, target);
      return typeof value === 'function' ? value.bind(target) as unknown : value;
    }
    return ownAttr(target, prop) ?? null;
  },

  has (target, prop) {
    return prop in target || ownAttr(target, prop) != null;
  },

  ownKeys (target) {
    const keys: (string | symbol)[] = [];
    const names: string[] = [];
    let i = 0;
    for (const attr of target) {
      keys.push(String(i++));
      if (!(attr.fullName in NamedNodeMapImpl.prototype)) {
        names.push(attr.fullName);
      }
    }
    return keys.concat(names, Reflect.ownKeys(target));
  },

  getOwnPropertyDescriptor (target, prop) {
    const attr = ownAttr(target, prop);
    if (attr) {
      return { value: attr, writable: false, enumerable: isIndex(prop as string), configurable: true };
    }
    return Reflect.getOwnPropertyDescriptor(target, prop);
  }
};

// Index and name lookups return null when the attribute is missing.
export type NamedNodeMap = NamedNodeMapImpl & Readonly<Record<string, Attr | null>>;

export function createNamedNodeMap (): NamedNodeMap {
  return new Proxy(new NamedNodeMapImpl(), nameNodeMapProxy) as NamedNodeMap;
}
