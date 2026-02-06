import { Note } from "@/types";
import matter from "gray-matter";

export function parseMarkdown(
    content: string,
    filename: string,
    topic: string
): Note {
    const { data, content: markdownContent } = matter(content);

    const slug = filename.replace(".md", "");

    const title =
        data.title ||
        slug.replace(/-/g, " ");

    const excerpt =
        data.excerpt ||
        markdownContent.slice(0, 150).trim() + "...";

    return {
        slug,
        title,
        content: markdownContent,
        date: data.date || new Date().toISOString(),
        excerpt,
        topic,
    };
}
