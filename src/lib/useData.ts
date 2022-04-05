import { useRouteData } from "react-static";

export function useData<T extends object>(): T {
  try {
    return useRouteData<T>();
  } catch (e) {
    if (e instanceof TypeError && e.message.includes("Cannot read properties of undefined (reading 'useRouteData')")) {
      debugger;
      window.location.reload();
    }

    throw e;
  }
}
