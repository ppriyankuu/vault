import { notFound } from "next/navigation";
import { fetchMarkdownContent, fetchFileLastCommitDate } from "@/lib/github";
import { parseMarkdown } from "@/lib/markdown";
import NoteContent from "@/components/noteContent";
import Navbar from "@/components/navbar";

export default async function NotePage({
    params,
}: {
    params: { topic: string; slug: string };
}) {
    const { topic, slug } = await params;

    let post;
    try {
        const path = `${topic}/${slug}.md`;
        const content = await fetchMarkdownContent(path);
        const lastModifiedDate = await fetchFileLastCommitDate(path);

        post = parseMarkdown(content, `${slug}.md`, topic, lastModifiedDate || undefined);
    } catch {
        notFound();
    }

    return (
        <div className="min-h-screen bg-neutral-950">
            <Navbar />
            <main className="mx-auto px-2 sm:px-4 md:px-6 py-8 max-w-5xl lg:max-w-5xl xl:max-w-6xl">
                {/* Content card */}
                <article className="bg-neutral-800/60 backdrop-blur-sm rounded-xl p-3 md:p-8 border border-neutral-700/50 shadow-lg">
                    <h1 className="text-2xl md:text-3xl font-bold text-white mb-3">
                        {post.title}
                    </h1>

                    <div className="text-neutral-400 text-sm mb-6 pb-3 border-b border-neutral-700/40">
                        {new Date(post.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                        })}
                    </div>

                    <NoteContent content={post.content} />
                </article>
            </main>
        </div>
    );
}

