export function withoutUndefined<T>(obj: T): T {
  if (typeof obj !== "object" || obj === null || Array.isArray(obj)) {
    return obj;
  }

  const next: T = {} as T;

  for (const key in obj) {
    if (obj[key] !== undefined) {
      next[key] = obj[key];
    }
  }

  return next;
}
