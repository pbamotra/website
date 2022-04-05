import React from "react";
import { useIsDark } from "lib/useIsDark";
import styled from "@emotion/styled";

const DetailContainer = styled.div({
  fontSize: "0.8rem",
  opacity: 0.8,
  marginTop: "2rem",
  cursor: "pointer",
});

export function DarkModeToggle() {
  const [isDark, toggle] = useIsDark();

  return (
    <DetailContainer onClick={toggle}>
      {isDark && "Dark mode"}
      {!isDark && "Light mode"}
    </DetailContainer>
  );
}
