import { useMemo, useState } from "react";

const key = "theme-override";

try {
  var x = window.localStorage.getItem(key);
  if (x === "dark" || x === "light") {
    document.body.className = x;
  }
} catch (e) {
  console.error(e);
}

export function useIsDark(): [boolean, () => void] {
  const isMediaDark = window.matchMedia(
    "@media (prefers-color-scheme: dark)"
  ).matches;

  const [override, setOverride] = useState<string | null>(
    useMemo(() => localStorage.getItem(key), [])
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
