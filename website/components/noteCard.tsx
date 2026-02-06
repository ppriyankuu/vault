import { CardProps } from "@/types";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function NoteCard({ post }: CardProps) {
    const excerptWithoutFirstLine = post.excerpt?.split("\n").slice(1).join("\n");

    return (
        <Link href={`/note/${post.topic}/${post.slug}`} className="block h-full">
            <div className="
        bg-gray-800/70 backdrop-blur-sm rounded-xl p-5
        border border-gray-700/60
        h-full flex flex-col
        transition-all duration-300
        hover:bg-gray-700/80 hover:border-gray-600/70
        shadow-md hover:shadow-lg
        group
        overflow-hidden
      ">
                {/* Title */}
                <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 leading-tight">
                    {post.title}
                </h3>

                {/* Excerpt */}
                <div className="flex-1 min-h-20 mb-4 overflow-hidden">
                    <div className="prose prose-sm prose-invert text-gray-300 max-w-none prose-a:text-blue-400 hover:prose-a:text-blue-300">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {excerptWithoutFirstLine || post.excerpt || ""}
                        </ReactMarkdown>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-between items-center pt-3 mt-auto border-t border-gray-700/50">
                    <span className="text-xs text-gray-400 tracking-wide">
                        {new Date(post.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                        })}
                    </span>
                    <span className="
            text-xs font-medium px-2.5 py-1 rounded-md
            bg-blue-900/30 text-blue-300
            group-hover:bg-blue-800/40 group-hover:text-blue-200
            transition-colors duration-200
            whitespace-nowrap
          ">
                        Read →
                    </span>
                </div>
            </div>
        </Link>
    );
}