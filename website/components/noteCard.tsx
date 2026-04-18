import { CardProps } from "@/types";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function NoteCard({ post }: CardProps) {
    const excerptWithoutFirstLine = post.excerpt?.split("\n").slice(1).join("\n");

    return (
        <Link href={`/note/${post.topic}/${post.slug}`} className="block h-full outline-hidden">
            <div className="
        bg-slate-900/50 backdrop-blur-md rounded-2xl p-6
        border border-slate-700/50
        h-full flex flex-col
        transition-all duration-300 ease-in-out
        hover:bg-slate-800/60 hover:border-slate-500/50
        hover:shadow-[0_8px_30px_rgb(0,0,0,0.5)]
        hover:-translate-y-1
        shadow-lg
        group
        relative
        overflow-hidden
      ">
                {/* Subtle gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Title */}
                <h3 className="relative text-xl font-bold text-slate-100 mb-3 line-clamp-2 leading-tight group-hover:text-blue-400 transition-colors duration-300 z-10">
                    {post.title}
                </h3>

                {/* Excerpt */}
                <div className="relative flex-1 min-h-20 mb-5 overflow-hidden z-10">
                    <div className="prose prose-sm prose-invert text-slate-400 max-w-none prose-a:text-blue-400 hover:prose-a:text-blue-300">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {excerptWithoutFirstLine || post.excerpt || ""}
                        </ReactMarkdown>
                    </div>
                </div>

                {/* Footer */}
                <div className="relative flex justify-between items-center pt-4 mt-auto border-t border-slate-800/80 z-10">
                    <span className="text-xs font-medium text-slate-500 tracking-wide uppercase">
                        {new Date(post.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                        })}
                    </span>
                    <span className="
            text-xs font-bold px-3 py-1.5 rounded-lg
            bg-slate-800 text-slate-300
            group-hover:bg-blue-600/20 group-hover:text-blue-300
            border border-transparent group-hover:border-blue-500/30
            transition-all duration-300
            whitespace-nowrap
            flex items-center gap-1
          ">
                        Read
                        <svg className="w-3 h-3 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                    </span>
                </div>
            </div>
        </Link>
    );
}