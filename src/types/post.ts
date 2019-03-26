interface Post {
    frontmatter: {
        title: string;
        byline: string;
        date: string;
        tags?: string[];
        comments?: boolean;
    };
    excerpt: string;
    fields: {
        slug?: string;
    };
}