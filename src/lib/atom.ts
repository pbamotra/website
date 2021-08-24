import { useCallback, useEffect, useRef, useState } from "react";

class Stateful<T> {
  private listeners = new Set<(value: T) => void>();

  constructor(protected _value: T) {}

  private emit(): void {
    for (const listener of Array.from(this.listeners)) {
      listener(this._value);
    }
  }

  snapshot(): T {
    return this._value;
  }

  protected update(value: T): void {
    if (this._value !== value) {
      this._value = value;
      this.emit();
    }
  }

  subscribe(callback: (value: T) => void) {
    this.listeners.add(callback);

    return {
      unsubscribe: () => {
        this.listeners.delete(callback);
      },
    };
  }
}

class Atom<T> extends Stateful<T> {
  setState(value: T): void {
    this.update(value);
  }
}

type SelectorGenerator<T> = (context: { get: <V>(dep: Stateful<V>) => V }) => T;

class Selector<T> extends Stateful<T> {
  private registeredDeps = new Set<Stateful<unknown>>();

  private addDep<V>(dep: Stateful<V>): V {
    if (!this.registeredDeps.has(dep)) {
      dep.subscribe(() => this.updateSelector());
      this.registeredDeps.add(dep);
    }

    return dep.snapshot();
  }

  constructor(private readonly generate: SelectorGenerator<T>) {
    // Here we need to create the base class with "undefined" so that we can
    // call the generate method using "this"
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    super(undefined as any);
    this._value = generate({ get: (dep) => this.addDep(dep) });
  }

  private updateSelector(): void {
    this.update(this.generate({ get: (dep) => this.addDep(dep) }));
  }

  clear(): void {
    this.registeredDeps.clear();
  }
}

function getFromLocalStorage<T>(
  key: string,
  defaultValue: T,
  isValid: (val: unknown) => val is T
): T {
  if (typeof localStorage === "undefined") {
    return defaultValue;
  }

  try {
    const value = JSON.parse(localStorage.getItem(key) || "null") as unknown;

    if (isValid(value)) {
      return value;
    } else {
      return defaultValue;
    }
  } catch (e) {
    return defaultValue;
  }
}

class LocalStorageAtom<T> extends Atom<T> {
  protected update(value: T) {
    if (this.snapshot() !== value) {
      if (typeof localStorage !== "undefined") {
        localStorage.setItem(this.key, JSON.stringify(value));
      }
    }

    super.update(value);
  }

  constructor(
    private key: string,
    defaultValue: T,
    isValid: (val: unknown) => val is T,
    load?: (value: T) => T
  ) {
    super(
      (load ?? ((x) => x))(getFromLocalStorage(key, defaultValue, isValid))
    );
  }
}

export function createLocalStorageAtom<T>(
  key: string,
  defaultValue: T,
  isValid: (val: unknown) => val is T,
  load?: (value: T) => T
): LocalStorageAtom<T> {
  return new LocalStorageAtom(key, defaultValue, isValid, load);
}

export function createAtom<T extends unknown>(initial: T): Atom<T>;
export function createAtom<T = undefined>(): Atom<T | undefined>;
export function createAtom(initial?: unknown): Atom<unknown> {
  return new Atom(initial ?? undefined);
}

export function createSelector<T>(callback: SelectorGenerator<T>): Selector<T> {
  return new Selector(callback);
}

export function useAtomValue<T>(value: Stateful<T>): T {
  const [, updateState] = useState({});
  const prev = useRef<T>(value.snapshot());
  prev.current = value.snapshot();

  useEffect(() => {
    function check() {
      if (prev.current !== value.snapshot()) {
        updateState({});
      }
    }

    check();

    const { unsubscribe } = value.subscribe(() => {
      check();
    });
    return () => unsubscribe();
  }, [value]);

  return value.snapshot();
}

export function useAtomState<T>(atom: Atom<T>): [T, (value: T) => void] {
  const value = useAtomValue(atom);
  return [value, useCallback((value) => atom.setState(value), [atom])];
}

export function useSetAtomState<T>(atom: Atom<T>): (value: T) => void {
  return useCallback((value) => atom.setState(value), [atom]);
}

export function mapAtom<T, V>(
  value: Stateful<T>,
  callback: (value: T) => V
): Stateful<V> {
  return new Selector(({ get }) => callback(get(value)));
}
