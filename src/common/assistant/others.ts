export const isEmptyObj = (obj: Record<string, unknown>) => (
  obj && Object.keys(obj).length === 0 && obj.constructor === Object
);



