import { ServerLocation, Router } from "@reach/router";
import React, {
  createContext,
  PropsWithChildren,
  Suspense,
  useContext,
  useMemo,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { usePopper } from "react-popper";
import { Routes } from "react-static";
import styled from "@emotion/styled";

const PreviewContext = createContext(false);

export function PreviewProvider({ children }: PropsWithChildren<unknown>) {
  return (
    <PreviewContext.Provider value={true}>{children}</PreviewContext.Provider>
  );
}

export function useIsPreview(): boolean {
  return useContext(PreviewContext);
}

type PreviewProps<T extends HTMLElement> = {
  show: boolean;
  slug: string;
  referenceElement: T;
};

const PreviewContainer = styled.div({
  background: "white",
  border: "solid 1px rgba(0, 0, 0, 0.1)",
  borderRadius: "8px",
  padding: "8px",
  boxShadow:
    "0 0 0 1px rgba(16, 22, 26, 0.1), 0 2px 4px rgba(16, 22, 26, 0.2), 0 8px 24px rgba(16, 22, 26, 0.2)",
});

export default function Preview<T extends HTMLElement>({
  show,
  slug,
  referenceElement,
}: PreviewProps<T>) {
  const [popover, setPreview] = useState<HTMLDivElement>();

  const { styles, attributes } = usePopper(referenceElement, popover, {
    placement: "right",
  });

  const outlet = useMemo(() => {
    if (typeof document === "undefined") {
      return undefined;
    }

    let element = document.getElementById("popover-outlet");

    if (!element) {
      element = document.createElement("div");
      element.id = "popover-outlet";
      document.body.appendChild(element);
    }

    return element;
  }, []);

  if (outlet === undefined) {
    return null;
  }

  // Disable for now since it's borked
  return false && show
    ? createPortal(
        <PreviewContainer
          style={styles.popper}
          {...attributes.popper}
          ref={setPreview}
        >
          <PreviewProvider>
            <Suspense fallback={<em>Loading...</em>}>
              <ServerLocation url={slug}>
                <Router>
                  <Routes path="*" />
                </Router>
              </ServerLocation>
            </Suspense>
          </PreviewProvider>
        </PreviewContainer>,
        outlet
      )
    : null;
}
