import { createLocalStorageAtom, useAtomState, useAtomValue, useSetAtomState } from "./atom";

function isBoolean(val: unknown): val is boolean {
  return typeof val === "boolean";
}

const ShowSeedAtom = createLocalStorageAtom("show-seeds", false, isBoolean);

export function useShowSeeds(): boolean {
  return useAtomValue(ShowSeedAtom);
}

export function useSetShowSeeds() {
  return useSetAtomState(ShowSeedAtom);
}

export function useSeedState() {
  return useAtomState(ShowSeedAtom);
}
