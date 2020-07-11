module.exports = (obj, key, val) => {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: false,
    writable: true
  });
};
