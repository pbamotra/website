import styled from "@emotion/styled";
import Link from "next/link";

interface PostPreviewProps {
  post: {
    title: string;
    slug: string;
  };
}

const PostPreviewContainer = styled.div({});

const PostPreviewTitle = styled.h3({});

export default function PostPreview({
  post: { title, slug },
}: PostPreviewProps) {
  return (
    <Link href={slug}>
      <a>
        <PostPreviewContainer>
          <PostPreviewTitle>{title}</PostPreviewTitle>
        </PostPreviewContainer>
      </a>
    </Link>
  );
}
