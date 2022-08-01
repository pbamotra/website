import React, { useMemo, useState } from "react";
import { getMDXComponent } from "mdx-bundler/client";
import styled from "@emotion/styled";
import { Head } from "react-static";
import { Link, useLocation } from "react-router-dom";

import HomeLink from "components/HomeLink";
import TweetSection from "components/TweetSection";
import About from "components/About";
import Backlink from "components/Backlink";

import { join } from "path";

import type { PostPageProps } from "lib/posts";

import "./theme.scss";

import Preview, { useIsPreview } from "components/Preview";
import { useShowSeeds } from "lib/seed";
import { useData } from "lib/useData";

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
  gridColumnGap: "2rem",

  "@media (max-width: 950px)": {
    display: "flex",
    flexDirection: "column",
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
  },
  ".remark-highlight > pre": {
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

    margin: 0,
    ".token": {
      background: "none",
    },
    ".remark-highlight-code-line": {
      background: "var(--highlight-color)",
      width: "calc(100% + 32px)",
      display: "block",
      padding: "2px 16px",
      marginLeft: "-16px",
    },
  },
});

const PostContent = styled.div({
  "> *:first-child-of-type": {
    marginTop: "0",
  },
});

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

const Tag = styled(Link)({
  marginRight: "0.5rem",
  cursor: "pointer",
});

const InternalLink = styled(Link)({
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

const REPLACE_LANGUAGES = new Set(["language-unknown", "language-plaintext", "language-txt"]);

const Code: React.FC<{ [key: string]: unknown }> = (props) => {
  if (
    REPLACE_LANGUAGES.has(props.className as string) &&
    typeof props.children === "string"
  ) {
    return <code dangerouslySetInnerHTML={{ __html: props.children }} />;
  }

  return <code {...props} />;
};

type InternalAnchorProps = {
  slug: string;
};

function InternalAnchor({ slug, ...rest }: InternalAnchorProps) {
  const [hovered, setHovered] = useState(false);
  const [element, setElement] = useState<HTMLAnchorElement>();

  return (
    <>
      <InternalLink
        {...rest}
        to={slug}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        ref={setElement}
      />
      <Preview slug={slug} show={hovered} referenceElement={element} />
    </>
  );
}

function withoutEnding(x: string, ending: string): string {
  if (x.endsWith(ending)) {
    return x.slice(0, -ending.length);
  }

  return x;
}

const Anchor: React.FC<{ [key: string]: unknown }> = (props) => {
  const location = useLocation();

  if (typeof props.href === "string") {
    let { href, ...rest } = props;

    if (href.startsWith(".") || href.startsWith("/")) {
      if (href.startsWith(".")) {
        href = join(location.pathname, "..", href);
      }

      href = withoutEnding(href, '/')
      href = withoutEnding(href, '.mdx')
      href = withoutEnding(href, '.md')
      href = withoutEnding(href, '_index')
      href = withoutEnding(href, 'index')

      if (!href.endsWith("/")) {
        href = href + "/";
      }

      return <InternalAnchor {...rest} slug={href} />;
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

const STATUS_TEXT: { [key: string]: React.ReactNode } = {
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
  color: "black"
});

const HeaderContainer = styled.div({
  gridColumn: "1 / span 2",
  maxWidth: CONTENT_WIDTH,
  width: "100%",
});

const FooterContainer = styled.div({});

const BacklinkTitle = styled.h3({
  margin: "0",
  marginBottom: "0.5rem",
});

const BacklinksOuterContainer = styled.div({
  opacity: "0.4",
  transition: "opacity 100ms",
  ":hover": {
    opacity: "1",
  },

  "@media (hover: none)": {
    opacity: "1",
  },
});

const BacklinksContainer = styled.div({
  display: "flex",
  flexWrap: "wrap",
  flexDirection: "column",
  transition: "opacity 100ms",
});

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

export default function PostPage() {
  const {
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
    ...rest
  } = useData<PostPageProps>();

  const Component = useMemo(() => getMDXComponent(code), [code]);
  const location = useLocation();

  const createdAtString = useMemo(() => formatDate(createdAt), [createdAt]);
  const modifiedAtString = useMemo(() => formatDate(modifiedAt), [modifiedAt]);

  const isPreview = useIsPreview();

  const showSeeds = useShowSeeds();

  const backlinks = !showSeeds
    ? rest.backlinks.filter((x) => x.status !== "seed")
    : rest.backlinks;

  return (
    <PostContainer>
      {!isPreview && (
        <Head>
          {description && <meta name="description" content={description} />}
          {description && (
            <meta name="twitter:description" content={description} />
          )}
          {type === "garden" &&
            (status === "seed" || status === "seedling") && (
              <meta name="robots" content="noindex" />
            )}
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
                "@id": `https://pankesh.com${location.pathname}`,
              },
              headline: title,
              image: ["https://pankesh.com/profile.jpg"],
              datePublished: new Date(createdAt).toISOString(),
              dateModified: new Date(modifiedAt).toISOString(),
              author: { "@type": "Person", name: "Pankesh Bamotra" },
              publisher: {
                "@type": "Organization",
                name: "Pankesh Bamotra",
                logo: {
                  "@type": "ImageObject",
                  url: "https://pankesh.com/profile.jpg",
                },
              },
            })}
          </script>
        </Head>
      )}

      <HeaderContainer>
        <br/>
        {!isPreview && <HomeLink />}
        <PostTitle>{title}</PostTitle>

        {tags.length > 0 && (
          <TagContainer>
            {tags.map((x) => (
              <Tag to={`/tag/${x}/`} key={x}>
                {x}
              </Tag>
            ))}
          </TagContainer>
        )}

        <DateContainer>
          {type === "garden" && status && STATUS_TEXT[status] && (
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

      {!isPreview && backlinks.length <= 0 && <div />}
      {!isPreview && backlinks.length > 0 && (
        <BacklinksOuterContainer>
          <BacklinkTitle>Links to this note</BacklinkTitle>
          <BacklinksContainer>
            {backlinks.map((x) => (
              <Backlink backlink={x} key={x.slug} />
            ))}
          </BacklinksContainer>
        </BacklinksOuterContainer>
      )}

      {!isPreview && (
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
                  <Link to={previous.slug}>{previous.title}</Link>
                </>
              )}
            </LinkSection>
            <LinkSection>
              {next && (
                <>
                  <div>Next</div>
                  <Link to={next.slug}>{next.title}</Link>
                </>
              )}
            </LinkSection>
          </NextPreviousContainer>
        </FooterContainer>
      )}
    </PostContainer>
  );
}
