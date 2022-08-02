import { useMemo, useState } from "react";

const key = "theme-override";

if (typeof window !== "undefined") {
  try {
    var x = window.localStorage.getItem(key);
    if (x === "dark" || x === "light") {
      document.body.className = x;
    }
  } catch (e) {
    console.error(e);
  }
}

export function useIsDark(): [boolean, () => void] {
  const isMediaDark =
    typeof window === "undefined"
      ? false
      : window.matchMedia("@media (prefers-color-scheme: dark)").matches;

  const [override, setOverride] = useState<string | null>(
    useMemo(
      () => (typeof window === "undefined" ? null : localStorage.getItem(key)),
      []
    )
  );

  function toggle() {
    const current = override ?? (isMediaDark ? "dark" : "light");
    const next = current === "light" ? "dark" : "light";

    localStorage.setItem(key, next);
    document.body.className = next;
    setOverride(next);
  }

  return [override === "dark", toggle];
}
