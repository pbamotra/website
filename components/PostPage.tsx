import React, { useMemo } from "react";
import { getMDXComponent } from "mdx-bundler/client";
import styled from "@emotion/styled";
import Head from "next/head";
import Link from "next/link";

import HomeLink from "./HomeLink";
import TweetSection from "./TweetSection";
import About from "./About";
import { useRouter } from "next/router";

const PostTitle = styled.h1({
  fontSize: "2.4rem",
  marginBottom: ".4rem",
});

const PostContainer = styled.div({
  width: "100%",
  maxWidth: "660px",
  img: {
    boxShadow: "0px 3px 6px rgb(0 0 0 / 5%)",
    maxWidth: "100%",
    margin: "auto",
    display: "block",
    border: "solid 1px rgba(0, 0, 0, 0.1)",
    borderRadius: "4px",
  },
  ".remark-highlight": {
    boxShadow: "0px 3px 6px rgb(0 0 0 / 5%)",
    maxWidth: "100%",
    margin: "auto",
    display: "block",
    border: "solid 1px rgba(0, 0, 0, 0.1)",
    borderRadius: "4px",
    overflow: "auto",

    "::-webkit-scrollbar": {
      width: "8px",
      height: "8px",
      background: "rgba(0, 0, 0, 0.03)",
    },

    "::-webkit-scrollbar-thumb": {
      borderRadius: "4px",
      background: "rgba(0, 0, 0, 0.15)",
    },
  },
  ".remark-highlight > pre": {
    background: "none",
    overflow: "unset",
    ".token": {
      background: "none",
    },
    ".remark-highlight-code-line": {
      background: "#19bbce26",
      width: "100%",
      display: "block",
      padding: "4px",
    },
  },
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

const TagContainer = styled.div({
  display: "flex",
  marginBottom: "2rem",
});

const Tag = styled.a({
  marginRight: "0.5rem",
  cursor: "pointer",
});

const REPLACE_LANGUAGES = new Set(["language-unknown"]);

const Code: React.FC<{ [key: string]: unknown }> = (props) => {
  if (
    REPLACE_LANGUAGES.has(props.className as string) &&
    typeof props.children === "string"
  ) {
    return <code dangerouslySetInnerHTML={{ __html: props.children }} />;
  }

  return <code {...props} />;
};

const COMPONENT_MAP = {
  code: Code,
} as const;

export default function PostPage({
  slug,
  description,
  title,
  code,
  image,
  next,
  previous,
  createdAt,
  modifiedAt,
  tags,
}: PostPageProps) {
  const Component = useMemo(() => getMDXComponent(code), [code]);
  const router = useRouter();

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

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "TechArticle",
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": `https://bennetthardwick.com${router.asPath}`,
            },
            headline: title,
            image: ["https://bennetthardwick.com/profile.jpg"],
            datePublished: new Date(createdAt).toISOString(),
            dateModified: new Date(modifiedAt).toISOString(),
            author: { "@type": "Person", name: "Bennett Hardwick" },
            publisher: {
              "@type": "Organization",
              name: "Bennett Hardwick",
              logo: {
                "@type": "ImageObject",
                url: "https://bennetthardwick.com/profile.jpg",
              },
            },
          })}
        </script>
      </Head>
      <HomeLink />
      <PostTitle>{title}</PostTitle>
      {tags.length > 0 && (
        <TagContainer>
          {tags.map((x) => (
            <Link href={`/tag/${x}`} key={x}>
              <Tag>{x}</Tag>
            </Link>
          ))}
        </TagContainer>
      )}
      <PostContent>
        <Component components={COMPONENT_MAP} />
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
