import { setOwnerElement, type Attr } from './Attr.ts';
import type { Element } from './Element.ts';
import { InUseAttributeError, NotFoundError } from './errors.js';

/**
 * Runtime class for {@link NamedNodeMap}. Not exported from the package, so that
 * the public `NamedNodeMap` type can be widened with an `Attr | null` index
 * signature without the index signature having to be compatible with the
 * class's typed members (`length`, `getNamedItem(): Attr | null`, etc.).
 * Elements use it directly, without the proxy, for speed.
 */
export class NamedNodeMapImpl {
  #attr: Attr[];
  #owner: Element | null;

  /**
   * @param [list] The array to keep the attributes in. The map changes it in place.
   * @param [owner] The element the attributes belong to.
   */
  constructor (list: Attr[] = [], owner: Element | null = null) {
    this.#attr = list;
    this.#owner = owner;
  }

  // Test tools such as Vitest copy objects with Object.create(prototype) and
  // then copy the own properties. A copy has the indexed Attrs but not #attr,
  // so read-only methods fall back to those.
  static #list (map: NamedNodeMapImpl): Attr[] {
    if (#attr in map) {
      return map.#attr;
    }
    const list: Attr[] = [];
    const copy = map as unknown as Record<number, Attr>;
    for (let i = 0; i in copy; i++) {
      list.push(copy[i]);
    }
    return list;
  }

  item (index: number): Attr | null {
    return NamedNodeMapImpl.#list(this)[index] ?? null;
  }

  getNamedItem (qualifiedName: string) {
    return NamedNodeMapImpl.#list(this).find(d => d.fullName === qualifiedName) ?? null;
  }

  // Returns the old attribute if replaced, or null if the attribute is new.
  setNamedItem (attr: Attr) {
    const list = this.#attr;
    const owner = this.#owner;
    if (attr.ownerElement && attr.ownerElement !== owner) {
      throw new InUseAttributeError(`The attribute '${attr.fullName}' belongs to another element.`);
    }
    const fn = attr.fullName;
    for (let i = 0; i < list.length; i++) {
      if (list[i].fullName === fn) {
        const old = list[i];
        if (old !== attr) {
          list[i] = attr;
          setOwnerElement(old, null);
          setOwnerElement(attr, owner);
        }
        return old;
      }
    }
    list.push(attr);
    setOwnerElement(attr, owner);
    return null;
  }

  removeNamedItem (qualifiedName: string) {
    const existing = this.#attr.findIndex(d => d.fullName === qualifiedName);
    if (existing > -1) {
      const old = this.#attr.splice(existing, 1)[0];
      setOwnerElement(old, null);
      return old;
    }
    throw new NotFoundError(`No attribute with name '${qualifiedName}' was found.`);
  }

  get length () {
    return NamedNodeMapImpl.#list(this).length;
  }

  *[Symbol.iterator] (): IterableIterator<Attr> {
    yield* NamedNodeMapImpl.#list(this);
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

/**
 * Wrap an attribute map in the proxy that exposes attributes by index and name.
 *
 * @param [map] The map to wrap. A new, empty map is used if omitted.
 * @returns The proxied map.
 */
export function createNamedNodeMap (map: NamedNodeMapImpl = new NamedNodeMapImpl()): NamedNodeMap {
  return new Proxy(map, nameNodeMapProxy) as NamedNodeMap;
}
