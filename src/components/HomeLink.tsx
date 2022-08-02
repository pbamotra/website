import React from "react";
import styled from "@emotion/styled";
import { Link } from "react-router-dom";

const HomeLinkAnchor = styled(Link)({
  borderBottom: "none",
  color: "inherit",
  cursor: "pointer",
  margin: "0.67rem",
  paddingTop: "1rem",
  display: "flex",
  ":visited": {
    color: "inherit",
  },
});

export default function HomeLink() {
  return <HomeLinkAnchor to="/">⃪ Home</HomeLinkAnchor>;
}
``