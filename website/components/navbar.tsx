'use client';

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { useNotes } from '@/context';

export default function Navbar() {
    const { topics } = useNotes();
    const [openTopic, setOpenTopic] = useState<string | null>(null);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    // New state for mobile accordion
    const [mobileExpandedTopic, setMobileExpandedTopic] = useState<string | null>(null);

    const navRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (navRef.current && !navRef.current.contains(event.target as Node)) {
                setOpenTopic(null);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const toggleTopic = (topic: string) => {
        setOpenTopic(openTopic === topic ? null : topic);
    };

    const toggleMobileTopic = (topic: string) => {
        setMobileExpandedTopic(mobileExpandedTopic === topic ? null : topic);
    };

    return (
        <nav ref={navRef} className="bg-slate-950/80 backdrop-blur-md border-b border-slate-800/60 sticky top-0 z-40 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 py-3">
                {/* Desktop */}
                <div className="hidden md:flex gap-3 flex-wrap items-center">
                    <Link
                        href="/"
                        className="text-white font-bold bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/20 px-4 py-1.5 rounded-lg transition-all duration-300 shadow-xs"
                    >
                        Home
                    </Link>

                    {topics.map((topic) => (
                        <div key={topic.topic} className="relative">
                            <button
                                onClick={() => toggleTopic(topic.topic)}
                                className="text-slate-200 font-medium bg-slate-800/50 hover:bg-slate-700/80 border border-slate-700/50 hover:border-slate-600/50 px-3 py-1.5 rounded-lg transition-all duration-300 whitespace-nowrap shadow-xs flex items-center gap-1"
                            >
                                {topic.topic}
                                <svg className={`w-3 h-3 transition-transform duration-200 ${openTopic === topic.topic ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                            </button>

                            {openTopic === topic.topic && (
                                <div className="absolute left-0 mt-2 bg-slate-900/95 backdrop-blur-xl border border-slate-700/60 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.4)] w-56 z-50 overflow-hidden transform origin-top transition-all animate-in fade-in slide-in-from-top-2">
                                    {/* Added max-h-64 and overflow-y-auto for desktop scroll */}
                                    <ul className="py-2 max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
                                        {topic.files.map((file) => {
                                            const slug = file.name.replace(/\.md$/, '');
                                            return (
                                                <li key={file.path}>
                                                    <Link
                                                        href={`/note/${topic.topic}/${slug}`}
                                                        className="block px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-blue-500/10 transition-colors"
                                                        onClick={() => setOpenTopic(null)}
                                                    >
                                                        {slug}
                                                    </Link>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Mobile Header */}
                <div className="md:hidden flex justify-between items-center py-1">
                    <Link
                        href="/"
                        className="text-white font-bold text-lg"
                        onClick={() => setIsMobileOpen(false)}
                    >
                        Home
                    </Link>
                    <button
                        onClick={() => setIsMobileOpen(!isMobileOpen)}
                        className="text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 border border-slate-700/50 p-2 rounded-lg transition-colors shadow-xs"
                        aria-label={isMobileOpen ? 'Close menu' : 'Open menu'}
                    >
                        {isMobileOpen ? (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        ) : (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                        )}
                    </button>
                </div>

                {/* Mobile Menu Content */}
                {isMobileOpen && (
                    <div className="mt-4 pb-4 md:hidden space-y-2 border-t border-slate-800/80 pt-4 animate-in fade-in slide-in-from-top-2">
                        {topics.map((topic) => (
                            <div key={topic.topic} className="flex flex-col">
                                {/* Topic Toggle Button */}
                                <button
                                    onClick={() => toggleMobileTopic(topic.topic)}
                                    className="flex justify-between items-center w-full text-blue-400 font-semibold text-xs uppercase tracking-widest py-3 px-2 hover:bg-slate-900/50 rounded-lg transition-colors"
                                >
                                    {topic.topic}
                                    <svg className={`w-4 h-4 transition-transform ${mobileExpandedTopic === topic.topic ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                </button>

                                {/* Nested Files List with Scroll */}
                                {mobileExpandedTopic === topic.topic && (
                                    <div className="mt-1 space-y-1 bg-slate-900/50 rounded-lg p-2 border border-slate-800/50 max-h-48 overflow-y-auto">
                                        {topic.files.map((file) => {
                                            const slug = file.name.replace(/\.md$/, '');
                                            return (
                                                <Link
                                                    key={file.path}
                                                    href={`/note/${topic.topic}/${slug}`}
                                                    className="block text-slate-300 hover:text-white hover:bg-slate-800/80 rounded-md px-3 py-2.5 text-sm transition-colors"
                                                    onClick={() => {
                                                        setIsMobileOpen(false);
                                                        setMobileExpandedTopic(null);
                                                    }}
                                                >
                                                    {slug}
                                                </Link>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </nav>
    );
}