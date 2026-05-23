import type { Attr } from './Attr.ts';

/**
 * Runtime class for {@link NamedNodeMap}. Kept un-exported so that the public
 * `NamedNodeMap` type can be widened with an `Attr` index signature without
 * the index signature having to be compatible with the class's typed members
 * (`length`, `getNamedItem(): Attr | null`, etc.).
 */
class NamedNodeMapImpl {
  #attr: Attr[];

  constructor () {
    this.#attr = [];
  }

  item (index: number) {
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

  removeNamedItem (attrName: string) {
    const existing = this.#attr.findIndex(d => d.nodeName === attrName);
    if (existing > -1) {
      const old = this.#attr.splice(existing, 1);
      return old[0];
    }
    // XXX: DOMException
    throw new Error(`NotFoundError: Failed to execute 'removeNamedItem' on 'NamedNodeMap': No item with name '${attrName}' was found.`);
  }

  get length () {
    return Object.keys(this.#attr).length;
  }

  *[Symbol.iterator] (): IterableIterator<Attr> {
    yield* this.#attr;
  }
}

const nameNodeMapProxy = {
  get (target: NamedNodeMap, prop: string) {
    if (prop in NamedNodeMapImpl.prototype) {
      const value = Reflect.get(target, prop, target);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      return typeof value === 'function' ? (value as any).bind(target) : value;
    }
    const attr = target.getNamedItem(prop);
    if (attr) {
      return attr;
    }
    return null;
  },

  has (target: NamedNodeMap, key: string) {
    if (key in target) {
      return true;
    }
    // integers
    const num = Number(key);
    if (Number.isFinite(num) && !(num % 1)) {
      return num < target.length;
    }
    // propnames
    if (target.getNamedItem(key)) {
      return true;
    }
    return false;
  }
};

export type NamedNodeMap = NamedNodeMapImpl & Readonly<Record<string, Attr>>;

export function createNamedNodeMap (): NamedNodeMap {
  return new Proxy(new NamedNodeMapImpl(), nameNodeMapProxy) as NamedNodeMap;
}
