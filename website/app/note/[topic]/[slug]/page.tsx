import { notFound } from "next/navigation";
import { fetchMarkdownContent } from "@/lib/github";
import { parseMarkdown } from "@/lib/markdown";
import NoteContent from "@/components/noteContent";
import Navbar from "@/components/navbar";

export default async function NotePage({
    params,
}: {
    params: { topic: string; slug: string };
}) {
    const { topic, slug } = await params;

    try {
        const path = `${topic}/${slug}.md`;
        const content = await fetchMarkdownContent(path);

        const post = parseMarkdown(content, `${slug}.md`, topic);

        return (
            <div className="min-h-screen bg-gray-950">
                <Navbar />
                <main className="container mx-auto px-4 py-8 max-w-3xl">
                    {/* Content card */}
                    <article className="bg-gray-800/60 backdrop-blur-sm rounded-xl p-6 md:p-8 border border-gray-700/50 shadow-lg">
                        <h1 className="text-2xl md:text-3xl font-bold text-white mb-3">
                            {post.title}
                        </h1>

                        <div className="text-gray-400 text-sm mb-6 pb-3 border-b border-gray-700/40">
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
    } catch {
        notFound();
    }
}

