import React, { useMemo } from "react";
import { getMDXComponent } from "mdx-bundler/client";
import styled from "@emotion/styled";
import Head from "next/head";
import Link from "next/link";

import HomeLink from "./HomeLink";
import TweetSection from "./TweetSection";
import About from "./About";

const PostTitle = styled.h1({
  fontSize: "2.4rem",
});

const PostContainer = styled.div({
  width: "100%",
  maxWidth: "660px",
});

const PostContent = styled.div({});

interface PostLink {
  title: string;
  slug: string;
}

export interface PostPageProps {
  slug: string;
  title: string;
  code: string;
  createdAt: number;
  modifiedAt: number;
  tags: string[];
  previous?: PostLink;
  next?: PostLink;
  description?: string;
  isAmp?: boolean;
  image?: { width: number; height: number; src: string };
}

const NextPreviousContainer = styled.div({
  marginTop: "2rem",
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gridGap: "2rem",
});

const LinkSection = styled.div({
  textAlign: "center",
});

export default function PostPage({
  slug,
  description,
  title,
  code,
  image,
  next,
  previous,
}: PostPageProps) {
  const Component = useMemo(() => getMDXComponent(code), [code]);

  return (
    <PostContainer>
      <Head>
        {description && <meta name="description" content={description} />}
        {description && (
          <meta property="twitter:description" content={description} />
        )}

        <title>{title}</title>

        <meta property="og:title" content={title} />
        <meta property="twitter:title" content={title} />

        <meta property="twitter:card" content="summary" />

        {image && (
          <>
            <meta property="og:image" content={image.src} />
            <meta property="twitter:image" content={image.src} />
            <meta property="og:image:width" content={`${image.width}`} />
            <meta property="og:image:height" content={`${image.height}`} />
          </>
        )}
      </Head>
      <HomeLink />
      <PostTitle>{title}</PostTitle>
      <PostContent>
        <Component />
      </PostContent>
      <TweetSection slug={slug} title={title} />
      <About />
      <NextPreviousContainer>
        <LinkSection>
          {previous && (
            <>
              <div>Previous</div>
              <Link href={previous.slug}>
                <a>{previous.title}</a>
              </Link>
            </>
          )}
        </LinkSection>
        <LinkSection>
          {next && (
            <>
              <div>Next</div>
              <Link href={next.slug}>
                <a>{next.title}</a>
              </Link>
            </>
          )}
        </LinkSection>
      </NextPreviousContainer>
    </PostContainer>
  );
}
