import { useRef, useState } from "react";
import { usePersistFn } from "./usePersistFn";

export type PromiseResult<T> =
  | { status: "loading" }
  | { status: "error"; error: unknown }
  | { status: "success"; data: T };

export type IdlePromiseResult<T> = PromiseResult<T> | { status: "idle" };

export function useDispatchPromise<T extends unknown, P extends unknown[]>(
  callback: (...args: P) => Promise<T>,
  options?: { onSuccess?: (value: T) => void; onError?: (error: Error) => void }
): [IdlePromiseResult<T>, (...args: P) => void] {
  const [result, setResult] = useState<IdlePromiseResult<T>>({
    status: "idle",
  });
  const currentPromise = useRef<Promise<T>>();

  const optionsRef = useRef(options);
  optionsRef.current = options;

  function handleError(e: unknown) {
    const error = e instanceof Error ? e : new Error(`${e}`);

    optionsRef.current?.onError?.(error);

    setResult({
      status: "error",
      error,
    });

    currentPromise.current = undefined;
  }

  const dispatch = usePersistFn((...args: P) => {
    if (currentPromise.current) {
      return;
    }

    try {
      const promise = callback(...args);
      currentPromise.current = promise;

      setResult({ status: "loading" });

      promise
        .then((data) => {
          optionsRef.current?.onSuccess?.(data);

          setResult({ status: "success", data });
          currentPromise.current = undefined;
        })
        .catch((e) => {
          handleError(e);
        });
    } catch (e) {
      handleError(e);
    }
  });

  return [result, dispatch];
}
