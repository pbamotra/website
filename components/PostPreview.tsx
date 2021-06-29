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
  fontSize: "1.4rem",
});

const PostPreviewExcerpt = styled.p({
  fontSize: "16px",
});

const PostPreviewContainer = styled.a({
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
});

export default function PostPreview({
  post: { title, slug, description },
}: PostPreviewProps) {
  return (
    <Link href={slug} passHref>
      <PostPreviewContainer>
        <PostPreviewTitle>{title}</PostPreviewTitle>
        <PostPreviewExcerpt>{description}</PostPreviewExcerpt>
      </PostPreviewContainer>
    </Link>
  );
}
