import { ELEMENT_NODE } from './constants.ts';
import type { Element } from './Element.ts';

export function isElement (d: unknown): d is Element {
  return (
    !!d &&
    typeof d === 'object' &&
    'nodeType' in d &&
    d.nodeType === ELEMENT_NODE
  );
}
