import styled from "@emotion/styled";
import Link from "next/link";

interface PostPreviewProps {
  post: {
    title: string;
    slug: string;
    description: string;
  };
}

const PostPreviewTitle = styled.h3({
  display: "inline",
});

const PostPreviewExcerpt = styled.p({
  fontSize: "16px",
});

const PostPreviewContainer = styled.a({
  display: "block",
  margin: "2rem 0",
  cursor: "pointer",
  border: "none",
  color: "inherit",
  ":hover h3": {
    color: "var(--accent-color)",
    borderBottom: "1px solid var(--accent-color-light)",
  },
});

export default function PostPreview({
  post: { title, slug, description },
}: PostPreviewProps) {
  return (
    <Link href={slug}>
      <PostPreviewContainer>
        <PostPreviewTitle>{title}</PostPreviewTitle>
        <PostPreviewExcerpt>{description}</PostPreviewExcerpt>
      </PostPreviewContainer>
    </Link>
  );
}
