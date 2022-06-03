import React, { useState } from "react";
import type { Backlink as BacklinkType } from "lib/posts";
import styled from "@emotion/styled";
import Preview from "components/Preview";
import { Link } from "react-router-dom";

interface BacklinkProps {
  backlink: BacklinkType;
}

const BacklinkContainer = styled(Link)({
  display: "block",
  position: "relative",
  cursor: "pointer",
  border: "none",
  color: "inherit",
  ":visited": {
    color: "inherit",
  },

  borderRadius: "4px",
  padding: "8px",
  background: "rgba(0, 0, 0, 0.1)",
  transition: "background 100ms",

  ":hover": {
    background: "rgba(0, 0, 0, 0.15)",
  },
});

const BacklinkTitle = styled.h4({
  margin: "0",
  fontSize: "0.9rem",
});

const BacklinkDescription = styled.div({
  fontSize: "0.9rem",
});

export default function Backlink({ backlink }: BacklinkProps) {
  const [element, setElement] = useState<HTMLAnchorElement>();

  const [hovered, setHovered] = useState(false);

  return (
    <>
      <BacklinkContainer
        ref={setElement}
        to={backlink.slug}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <BacklinkTitle>{backlink.title}</BacklinkTitle>
        <BacklinkDescription>{backlink.description}</BacklinkDescription>
      </BacklinkContainer>
      <Preview show={hovered} referenceElement={element} slug={backlink.slug} />
    </>
  );
}
