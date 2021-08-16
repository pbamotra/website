import { useRef, useCallback } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function usePersistFn<V extends unknown, A extends unknown[]>(
  fn: (...args: A) => V
): typeof fn {
  const ref = useRef(fn);
  ref.current = fn;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useCallback(((...args) => ref.current(...args)) as typeof fn, []);
}
