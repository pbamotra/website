import React, { useMemo } from "react";
import { getMDXComponent } from "mdx-bundler/client";
import styled from "@emotion/styled";
import Head from "next/head";
import Link from "next/link";

import HomeLink from "./HomeLink";
import TweetSection from "./TweetSection";
import About from "./About";
import { useRouter } from "next/router";

import { join } from "path";

const PostTitle = styled.h1({
  fontSize: "2.4rem",
  marginBottom: ".4rem",
});

const CONTENT_WIDTH = "660px";

const PostContainer = styled.div({
  width: "100%",
  display: "grid",
  gridTemplateColumns: `${CONTENT_WIDTH} 1fr`,
  gridRowGap: "2rem",
  gridColumnGap: "1rem",

  "@media (max-width: 950px)": {
    gridTemplateColumns: "1fr",
  },

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
  type: string;
  status?: string;
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
});

const DateContainer = styled.div({
  fontSize: "0.8rem",
  margin: "0.5rem 0",
});

const Tag = styled.a({
  marginRight: "0.5rem",
  cursor: "pointer",
});

const InternalLink = styled.a({
  borderBottom: "none",
  ":before": {
    opacity: 0.4,
    content: "'['",
    transition: "opacity 50ms",
  },
  ":after": {
    opacity: 0.4,
    content: "']'",
    transition: "opacity 50ms",
  },
  ":hover": {
    ":before": {
      opacity: 0.8,
    },
    ":after": {
      opacity: 0.8,
    },
  },
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

const Anchor: React.FC<{ [key: string]: unknown }> = (props) => {
  const router = useRouter();

  if (typeof props.href === "string") {
    let { href, ...rest } = props;

    if (href.startsWith(".") || href.startsWith("/")) {
      if (href.startsWith(".")) {
        href = join(router.asPath, "..", href);
      }

      if (href.endsWith("/_index.mdx")) {
        href = href.slice(0, -"/_index.mdx".length);
      }

      if (href.endsWith("/index.mdx")) {
        href = href.slice(0, -"/index.mdx".length);
      }

      if (href.endsWith(".mdx")) {
        href = href.slice(0, -".mdx".length);
      }

      if (href.endsWith("/")) {
        href = href.slice(0, -"/".length);
      }

      return (
        <Link href={href} passHref>
          <InternalLink {...rest} />
        </Link>
      );
    }
  }

  return <a {...props} />;
};

const COMPONENT_MAP = {
  code: Code,
  a: Anchor,
} as const;

function formatDate(date: number): string {
  return new Date(date).toLocaleString("en-us", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

const STATUS_TEXT = {
  seedling: <>Seedling 🌱</>,
  budding: <>Budding 🌿</>,
  evergreen: <>Evergreen 🌳</>,
  seed: <>Seed 🌰</>,
};

const Warning = styled.div({
  background: "#fff9bb",
  border: "solid 2px #f5dd64",
  padding: "8px 24px",
  borderRadius: "4px",
});

const HeaderContainer = styled.div({
  gridColumn: "1 / span 2",
  maxWidth: CONTENT_WIDTH,
  width: "100%",
});

const FooterContainer = styled.div({});

const BacklinksContainer = styled.div({});

function SeedWarning() {
  return (
    <Warning>
      <p>
        This page is a seed and hasn't had a chance to grow just yet - it might
        not be ready for human consumption.
      </p>
    </Warning>
  );
}

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
  type,
  status,
}: PostPageProps) {
  const Component = useMemo(() => getMDXComponent(code), [code]);
  const router = useRouter();

  const createdAtString = useMemo(() => formatDate(createdAt), [createdAt]);
  const modifiedAtString = useMemo(() => formatDate(modifiedAt), [modifiedAt]);

  return (
    <PostContainer>
      <Head>
        {description && <meta name="description" content={description} />}
        {description && (
          <meta name="twitter:description" content={description} />
        )}
        {(type === "garden" && status === "seed") ||
          (status === "seedling" && <meta name="robots" content="noindex" />)}
        <title>{title}</title>
        <meta name="og:title" content={title} />
        <meta name="twitter:title" content={title} />
        2 /
        <meta name="twitter:card" content="summary" />
        {image && (
          <>
            <meta name="og:image" content={image.src} />
            <meta name="twitter:image" content={image.src} />
            <meta name="og:image:width" content={`${image.width}`} />
            <meta name="og:image:height" content={`${image.height}`} />
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

      <HeaderContainer>
        <HomeLink />
        <PostTitle>{title}</PostTitle>

        {tags.length > 0 && (
          <TagContainer>
            {tags.map((x) => (
              <Link href={`/tag/${x}`} key={x} passHref>
                <Tag>{x}</Tag>
              </Link>
            ))}
          </TagContainer>
        )}

        <DateContainer>
          {type === "garden" && STATUS_TEXT[status] && (
            <>{STATUS_TEXT[status]} - </>
          )}
          {createdAtString !== modifiedAtString && (
            <>
              Updated {modifiedAtString} - Published {createdAtString}
            </>
          )}
          {createdAtString === modifiedAtString && (
            <>Published {createdAtString}</>
          )}
        </DateContainer>
      </HeaderContainer>

      <PostContent>
        {type === "garden" && status === "seed" && <SeedWarning />}

        <Component components={COMPONENT_MAP} />
      </PostContent>

      <BacklinksContainer></BacklinksContainer>

      <FooterContainer>
        <hr />

        {type === "garden" && status !== "evergreen" ? null : (
          <TweetSection slug={slug} title={title} />
        )}
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
      </FooterContainer>
    </PostContainer>
  );
}
