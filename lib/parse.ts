export function loadValidDate(date: Date, or: Date = new Date()): Date {
  if (isNaN(Number(date)) || date < new Date("2015-01-01")) {
    return loadValidDate(or, new Date());
  } else {
    return date;
  }
}

export function loadDate(val: unknown, or: Date = new Date()): Date {
  return loadValidDate(new Date(String(val)), or);
}

export function loadString(val: unknown): string | undefined {
  if (typeof val !== "string") {
    return undefined;
  }

  return val;
}

export function loadStringArray(val: unknown): string[] {
  if (Array.isArray(val) && val.every((x) => typeof x === "string")) {
    return val;
  }

  return [];
}

export function loadLiteral<T>(
  value: unknown,
  literals: readonly T[]
): T | undefined {
  if (literals.includes(value as T)) {
    return value as T;
  }

  return undefined;
}

export function loadLiteralDefault<T>(
  value: unknown,
  literals: readonly T[],
  or: T
): T {
  if (literals.includes(value as T)) {
    return value as T;
  }

  return or;
}

export function loadBoolean(bool: unknown) {
  if (typeof bool === "boolean") {
    return bool;
  }

  if (bool === "false") {
    return false;
  }

  return Boolean(bool);
}
