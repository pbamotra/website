import React from "react";
import type { Backlink as BacklinkType } from "lib/posts";
import styled from "@emotion/styled";
import { Link } from "@reach/router";

interface BacklinkProps {
  backlink: BacklinkType;
}

const BacklinkContainer = styled(Link)({
  display: "block",
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
  return (
    <BacklinkContainer to={backlink.slug}>
      <BacklinkTitle>{backlink.title}</BacklinkTitle>
      <BacklinkDescription>{backlink.description}</BacklinkDescription>
    </BacklinkContainer>
  );
}
