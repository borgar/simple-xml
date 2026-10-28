import { InvalidCharacterError } from './errors.ts';

const START = 1;
const FOLLOW = 2;

// What each ASCII character may be in a name: START can begin a name part,
// FOLLOW can only come after the first character, and 0 is not allowed. The
// colon is handled separately, as it separates the prefix from the local name.
const ASCII = new Uint8Array(128);
for (let c = 0x20; c <= 0x7F; c++) {
  const s = String.fromCharCode(c);
  ASCII[c] = (/^[a-zA-Z_]/.test(s) ? START : 0) | (/^[0-9.-]/.test(s) ? FOLLOW : 0);
}

// XML 1.0 NameStartChar, for characters outside ASCII and the surrogate range
function isStartChar (c: number): boolean {
  return (
    (c >= 0xC0 && c <= 0xD6) ||
    (c >= 0xD8 && c <= 0xF6) ||
    (c >= 0xF8 && c <= 0x2FF) ||
    (c >= 0x370 && c <= 0x37D) ||
    (c >= 0x37F && c <= 0x1FFF) ||
    c === 0x200C || c === 0x200D ||
    (c >= 0x2070 && c <= 0x218F) ||
    (c >= 0x2C00 && c <= 0x2FEF) ||
    (c >= 0x3001 && c <= 0xD7FF) ||
    (c >= 0xF900 && c <= 0xFDCF) ||
    (c >= 0xFDF0 && c <= 0xFFFD)
  );
}

// XML 1.0 NameChar, for characters outside ASCII and the surrogate range
function isNameChar (c: number): boolean {
  return (
    isStartChar(c) ||
    c === 0xB7 ||
    (c >= 0x300 && c <= 0x36F) ||
    c === 0x203F || c === 0x2040
  );
}

function invalid (name: string): never {
  throw new InvalidCharacterError(`'${name}' is not a valid XML name.`);
}

/**
 * Check a qualified name and find the colon that separates its prefix from
 * its local name.
 *
 * The name must follow XML 1.0 and Namespaces in XML: an optional prefix and
 * a colon, then a local name. Neither part may be empty, contain a colon, or
 * start with a digit, `-`, or `.`. This is checked in a single pass, which is
 * about as fast as only splitting the name.
 *
 * Constructors use this rather than `splitQName`: returning a number instead
 * of an array lets V8 keep them optimized while parsing.
 *
 * @param name The qualified name, such as `x` or `p:x`.
 * @returns The index of the colon, or -1 if the name has no prefix.
 * @throws {InvalidCharacterError} If the name is not a valid qualified name.
 */
export function qnameColon (name: string): number {
  const len = name.length;
  let colon = -1;
  let partStart = 0;
  for (let i = 0; i < len; i++) {
    const c = name.charCodeAt(i);
    const first = i === partStart;
    if (c < 0x80) {
      if (c === 0x3A) {
        // a second colon, or a colon that starts the name
        if (colon !== -1 || first) {
          invalid(name);
        }
        colon = i;
        partStart = i + 1;
      }
      else {
        const kind = ASCII[c];
        if (!kind || (first && kind !== START)) {
          invalid(name);
        }
      }
    }
    else if (c >= 0xD800 && c <= 0xDBFF) {
      // a surrogate pair: U+10000 to U+EFFFF are all allowed, which is a
      // high surrogate up to U+DB7F followed by a low surrogate
      const next = name.charCodeAt(i + 1);
      if (c > 0xDB7F || !(next >= 0xDC00 && next <= 0xDFFF)) {
        invalid(name);
      }
      i++;
    }
    else if (!(first ? isStartChar(c) : isNameChar(c))) {
      invalid(name);
    }
  }
  // an empty name, or a colon that ends it
  if (partStart === len) {
    invalid(name);
  }
  return colon;
}

/**
 * Check a qualified name and split it into its prefix and local name.
 *
 * @param name The qualified name, such as `x` or `p:x`.
 * @returns The prefix, or null if there is none, and the local name.
 * @throws {InvalidCharacterError} If the name is not a valid qualified name.
 */
export function splitQName (name: string): [ string, string ] | [ null, string ] {
  const colon = qnameColon(name);
  return colon === -1
    ? [ null, name ]
    : [ name.slice(0, colon), name.slice(colon + 1) ];
}
