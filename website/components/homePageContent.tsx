'use client';

import { useNotes } from '@/context';
import NoteCard from '@/components/noteCard';
import { Computer } from "lucide-react";

export default function HomePageContent() {
    const { topics, notes, searchQuery, setSearchQuery } = useNotes();

    // Filter notes based on search query
    const filteredNotes = notes.filter(note => {
        const query = searchQuery.toLowerCase();
        return (
            note.title.toLowerCase().includes(query) ||
            note.topic.toLowerCase().includes(query) ||
            (note.excerpt && note.excerpt.toLowerCase().includes(query))
        );
    });

    // Group filtered notes by topic
    const groupedNotes = topics.map(topicObj => {
        return {
            topic: topicObj.topic,
            notes: filteredNotes.filter(note => note.topic === topicObj.topic)
        };
    }).filter(group => group.notes.length > 0);

    return (
        <div className="flex flex-col items-center w-full">
            <div className="
                w-full max-w-5xl
                flex items-center justify-between
                mb-8
                py-4 px-12
                bg-linear-to-r from-slate-800 to-slate-900
                border border-slate-700/50
                rounded-2xl
                shadow-[0_8px_30px_rgb(0,0,0,0.4)]
                backdrop-blur-md
            ">
                <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
                    Notes.
                </h1>

                <div className='flex gap-2 ml-2 items-center'>
                    <h3 className='font-mono'>Github</h3>
                    <a
                        href="https://github.com/ppriyankuu"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg border border-slate-700/50 hover:border-slate-500 hover:bg-slate-700/40 transition-all"
                    >
                        <Computer className="w-6 h-6 text-slate-300 hover:text-white transition-colors" />
                    </a>
                </div>
            </div>

            {/* Search Bar */}
            <div className="w-full max-w-2xl mb-12">
                <div className="relative group">
                    <input
                        type="text"
                        className="block w-full py-4 px-6 text-sm text-white bg-slate-900/60 border border-slate-700 rounded-xl focus:ring-blue-500 focus:border-blue-500 placeholder-slate-400 shadow-inner backdrop-blur-sm transition-all outline-hidden"
                        placeholder="Search notes by title, topic, or content..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        required
                    />
                </div>
            </div>

            {groupedNotes.length === 0 ? (
                <div className="text-center py-16 w-full bg-slate-900/30 rounded-2xl border border-slate-800/50">
                    <p className="text-slate-400 text-lg">
                        {notes.length === 0 ? "Loading notes or no notes found." : "No notes match your search."}
                    </p>
                </div>
            ) : (
                <div className="w-full space-y-12">
                    {groupedNotes.map((group) => (
                        <div key={group.topic} className="w-full">
                            <div className="flex items-center mb-6">
                                <h2 className="text-2xl font-bold text-white tracking-wide uppercase bg-slate-800/80 px-4 py-2 rounded-lg border border-slate-700/50 shadow-sm inline-block">
                                    {group.topic}
                                </h2>
                                <div className="h-px bg-linear-to-r from-slate-700 to-transparent flex-1 ml-4 opacity-50"></div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {group.notes.map((post) => (
                                    <NoteCard key={`${post.topic}-${post.slug}`} post={post} />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
