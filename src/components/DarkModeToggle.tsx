import React from "react";
import { useIsDark } from "lib/useIsDark";
import styled from "@emotion/styled";
import { BiSun, BiMoon } from 'react-icons/bi';

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
      {isDark && <BiSun size={70} />}
      {!isDark &&  <BiMoon size={70} />}
    </DetailContainer>
  );
}
