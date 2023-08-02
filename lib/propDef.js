export const propDef = (obj, key, val = null) => {
  Object.defineProperty(obj, key, {
    // value: val,
    enumerable: false,
    writable: true
  });
  return val;
};
