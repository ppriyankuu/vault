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
            (note.excerpt && note.excerpt.toLowerCase().includes(query)) ||
            (note.content && note.content.toLowerCase().includes(query))
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
                bg-linear-to-r from-neutral-800 to-neutral-900
                border border-neutral-700/50
                rounded-2xl
                shadow-[0_8px_30px_rgb(0,0,0,0.4)]
                backdrop-blur-md
            ">
                <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-yellow-500 to-yellow-200 tracking-tight">
                    Vault of Notes.
                </h1>

                <div className='flex gap-2 ml-2 items-center'>
                    <h3 className='font-mono'>Github</h3>
                    <a
                        href="https://github.com/ppriyankuu"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg border border-neutral-700/50 hover:border-neutral-500 hover:bg-neutral-700/40 transition-all"
                    >
                        <Computer className="w-6 h-6 text-yellow-500/70 hover:text-yellow-400 transition-colors" />
                    </a>
                </div>
            </div>

            {/* Search Bar */}
            <div className="w-full max-w-2xl mb-12">
                <div className="relative group">
                    <input
                        type="text"
                        className="block w-full py-4 px-6 text-sm text-white bg-neutral-900/60 border border-neutral-700 rounded-xl focus:ring-yellow-500 focus:border-yellow-500 placeholder-neutral-400 shadow-inner backdrop-blur-sm transition-all outline-hidden"
                        placeholder="Search notes by title, topic, or content..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        required
                    />
                </div>
            </div>

            {groupedNotes.length === 0 ? (
                <div className="text-center py-16 w-full bg-neutral-900/30 rounded-2xl border border-neutral-800/50">
                    <p className="text-neutral-400 text-lg">
                        {notes.length === 0 ? "Loading notes or no notes found." : "No notes match your search."}
                    </p>
                </div>
            ) : (
                <div className="w-full space-y-12">
                    {groupedNotes.map((group) => (
                        <div key={group.topic} className="w-full">
                            <div className="flex items-center mb-6">
                                <h2 className="text-2xl font-bold text-yellow-500 tracking-wide uppercase bg-neutral-800/80 px-4 py-2 rounded-lg border border-yellow-500/30 shadow-sm inline-block">
                                    {group.topic}
                                </h2>
                                <div className="h-px bg-linear-to-r from-yellow-500/50 to-transparent flex-1 ml-4 opacity-50"></div>
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
