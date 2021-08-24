import React from "react";
import { useSeedState } from "lib/seed";
import styled from "@emotion/styled";

const DetailContainer = styled.div({
  fontSize: "0.8rem",
  opacity: 0.8,
  marginTop: "2rem",
  cursor: "pointer",
});

export function DetailToggle() {
  const [showing, setShowing] = useSeedState();

  return (
    <DetailContainer onClick={() => setShowing(!showing)}>
      {showing && "Showing drafts and unfinished posts. Click to hide."}
      {!showing && "Hiding drafs and unfinished posts. Click to show."}
    </DetailContainer>
  );
}
