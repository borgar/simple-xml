import { XML_NS, XMLNS_NS } from './constants.js';
import { NamespaceError } from './errors.js';

/**
 * Check a name against a namespace with the same rules as DOM's
 * createElementNS: a prefix needs a namespace, the xml prefix belongs to the
 * XML namespace, and the xmlns prefix and name belong to the XMLNS namespace,
 * and nothing else does.
 *
 * @param namespaceURI The namespace, or null for none.
 * @param prefix The prefix of the name, or null if it has none.
 * @param qualifiedName The full name.
 * @throws {NamespaceError} If the name breaks one of the rules.
 */
export function checkNamespace (namespaceURI: string | null, prefix: string | null, qualifiedName: string) {
  if (
    (prefix && !namespaceURI) ||
    (prefix === 'xml' && namespaceURI !== XML_NS) ||
    ((prefix === 'xmlns' || qualifiedName === 'xmlns') !== (namespaceURI === XMLNS_NS))
  ) {
    throw new NamespaceError(`Invalid name ${qualifiedName} for namespace ${namespaceURI ?? 'null'}`);
  }
}
