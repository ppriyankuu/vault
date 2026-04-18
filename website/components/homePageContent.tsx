'use client';

import { useNotes } from '@/context';
import NoteCard from '@/components/noteCard';

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
            <h1 className="
                text-4xl md:text-5xl font-extrabold text-white
                mb-8 text-center
                py-4 px-8
                bg-linear-to-r from-slate-800 to-slate-900
                border border-slate-700/50
                rounded-2xl
                shadow-[0_8px_30px_rgb(0,0,0,0.4)]
                backdrop-blur-md
                z-20
                tracking-tight
            ">
                Notes I push to GitHub.
            </h1>

            {/* Search Bar */}
            <div className="w-full max-w-2xl mb-12">
                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                        <svg className="w-5 h-5 text-slate-400 group-focus-within:text-blue-400 transition-colors" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                        </svg>
                    </div>
                    <input 
                        type="text" 
                        className="block w-full p-4 pl-12 text-sm text-white bg-slate-900/60 border border-slate-700 rounded-xl focus:ring-blue-500 focus:border-blue-500 placeholder-slate-400 shadow-inner backdrop-blur-sm transition-all outline-hidden" 
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
                                <div className="h-px bg-gradient-to-r from-slate-700 to-transparent flex-1 ml-4 opacity-50"></div>
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
