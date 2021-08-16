import React from "react";
import styled from "@emotion/styled";
import { Link } from "@reach/router";

interface PostPreviewProps {
  post: {
    title: string;
    slug: string;
    description?: string;
  };
}

const PostPreviewTitle = styled.h3({
  display: "inline",
  fontSize: "1.4rem",
});

const PostPreviewExcerpt = styled.p({
  fontSize: "16px",
});

const PostPreviewContainer = styled(Link)({
  display: "block",
  margin: "0",
  marginBottom: "2rem",
  cursor: "pointer",
  border: "none",
  color: "inherit",
  ":hover h3": {
    color: "var(--accent-color)",
    borderBottom: "1px solid var(--accent-color-light)",
  },
  ":visited": {
    color: "inherit",
  },
});

export default function PostPreview({
  post: { title, slug, description },
}: PostPreviewProps) {
  return (
    <PostPreviewContainer to={slug}>
      <PostPreviewTitle>{title}</PostPreviewTitle>
      {description && <PostPreviewExcerpt>{description}</PostPreviewExcerpt>}
    </PostPreviewContainer>
  );
}
