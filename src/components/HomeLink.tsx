import React from "react";
import styled from "@emotion/styled";
import { Link } from "react-router-dom";

const HomeLinkAnchor = styled(Link)({
  borderBottom: "none",
  color: "inherit",
  cursor: "pointer",

  ":visited": {
    color: "inherit",
  },
});

export default function HomeLink() {
  return <HomeLinkAnchor to="/">Home</HomeLinkAnchor>;
}
