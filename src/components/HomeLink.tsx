import React from "react";
import styled from "@emotion/styled";
import { Link } from "@reach/router";

const HomeLinkAnchor = styled(Link)({
  borderBottom: "none",
  color: "black",
  cursor: "pointer",

  ":visited": {
    color: "black",
  },
});

export default function HomeLink() {
  return <HomeLinkAnchor to="/">Home</HomeLinkAnchor>;
}
