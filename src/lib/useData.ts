import { useRouteData } from "react-static";

export function useData<T extends object>(): T {
  try {
    return useRouteData<T>();
  } catch (e) {
    debugger;
    window.location.reload();
  }
}
