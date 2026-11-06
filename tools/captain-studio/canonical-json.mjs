/** Canonical JSON for studio hashes. String contents and array order are preserved. */
export function canonicalJson(value) {
  const active = new Set();
  function encode(v) {
    if (v === null || typeof v === 'string' || typeof v === 'boolean') return JSON.stringify(v);
    if (typeof v === 'number' && Number.isFinite(v)) return JSON.stringify(v);
    if (typeof v !== 'object' || active.has(v)) throw new TypeError('Expected acyclic JSON data');
    if (!Array.isArray(v) && Object.getPrototypeOf(v) !== Object.prototype && Object.getPrototypeOf(v) !== null) throw new TypeError('Expected plain JSON object');
    if (Reflect.ownKeys(v).some(k => typeof k !== 'string')) throw new TypeError('Symbol keys are not JSON');
    active.add(v);
    let result;
    if (Array.isArray(v)) {
      if (Object.keys(v).length !== v.length) throw new TypeError('Sparse or augmented array');
      result = '[' + Array.from({length:v.length}, (_,i) => {
        const descriptor=Object.getOwnPropertyDescriptor(v,String(i));
        if (!descriptor || !('value' in descriptor)) throw new TypeError('Array accessors are not JSON');
        return encode(descriptor.value);
      }).join(',') + ']';
    } else {
      result = '{' + Object.keys(v).sort().map(k => {
        const descriptor = Object.getOwnPropertyDescriptor(v,k);
        if (!('value' in descriptor)) throw new TypeError('Accessors are not JSON');
        return JSON.stringify(k) + ':' + encode(descriptor.value);
      }).join(',') + '}';
    }
    active.delete(v);
    return result;
  }
  return encode(value);
}
