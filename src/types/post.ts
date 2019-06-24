interface Post {
    frontmatter: {
        title: string;
        byline: string;
        created?: string;
        tags?: string[];
        comments?: boolean;
    };
    excerpt: string;
    fields: {
        slug?: string;
        date: string;
    };
}
