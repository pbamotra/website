import styled from "@emotion/styled";
import Link from "next/link";

const HomeLinkAnchor = styled.a({
  borderBottom: "none",
  color: "black",
  cursor: "pointer",
});

export default function HomeLink() {
  return (
    <Link href="/">
      <HomeLinkAnchor>Home 🏡</HomeLinkAnchor>
    </Link>
  );
}
