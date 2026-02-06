'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useNotes } from '@/context';

export default function Navbar() {
    const { topics } = useNotes();
    const [openTopic, setOpenTopic] = useState<string | null>(null);
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    const toggleTopic = (topic: string) => {
        setOpenTopic(openTopic === topic ? null : topic);
    };

    return (
        <nav className="bg-gray-900/90 backdrop-blur-sm border-b border-gray-700/50 sticky top-0 z-40">
            <div className="max-w-7xl mx-auto px-4 py-2.5">
                {/* Desktop */}
                <div className="hidden md:flex gap-3 flex-wrap items-center">
                    <Link
                        href="/"
                        className="text-white font-semibold bg-blue-900/40 hover:bg-blue-800/50 px-3 py-1.5 rounded-lg transition-colors duration-200"
                    >
                        Home
                    </Link>

                    {topics.map((topic) => (
                        <div key={topic.topic} className="relative">
                            <button
                                onClick={() => toggleTopic(topic.topic)}
                                className="text-gray-200 font-medium bg-gray-800/60 hover:bg-gray-700/70 px-3 py-1.5 rounded-lg transition-colors duration-200 whitespace-nowrap"
                            >
                                {topic.topic}
                            </button>

                            {openTopic === topic.topic && (
                                <div className="absolute left-0 mt-1.5 bg-gray-800/90 backdrop-blur border border-gray-700/50 rounded-lg shadow-xl w-52 z-50 overflow-hidden">
                                    <ul className="py-1 max-h-60 overflow-y-auto">
                                        {topic.files.map((file) => {
                                            const slug = file.name.replace(/\.md$/, '');
                                            return (
                                                <li key={file.path}>
                                                    <Link
                                                        href={`/note/${topic.topic}/${slug}`}
                                                        className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700/60 transition-colors"
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

                {/* Mobile */}
                <div className="md:hidden flex justify-between items-center py-1">
                    <Link
                        href="/"
                        className="text-white font-medium"
                        onClick={() => setIsMobileOpen(false)}
                    >
                        Home
                    </Link>
                    <button
                        onClick={() => setIsMobileOpen(!isMobileOpen)}
                        className="text-gray-300 hover:text-white bg-gray-800/60 hover:bg-gray-700/70 p-1.5 rounded-md transition-colors"
                        aria-label={isMobileOpen ? 'Close menu' : 'Open menu'}
                    >
                        {isMobileOpen ? '✕' : '☰'}
                    </button>
                </div>

                {isMobileOpen && (
                    <div className="mt-3 pb-3 md:hidden space-y-3 border-t border-gray-700/40 pt-3">
                        {topics.map((topic) => (
                            <div key={topic.topic}>
                                <div className="text-gray-500 text-xs uppercase tracking-wider mb-1.5">
                                    {topic.topic}
                                </div>
                                <div className="space-y-1">
                                    {topic.files.map((file) => {
                                        const slug = file.name.replace(/\.md$/, '');
                                        return (
                                            <Link
                                                key={file.path}
                                                href={`/note/${topic.topic}/${slug}`}
                                                className="block text-gray-300 hover:text-white text-sm py-1 transition-colors"
                                                onClick={() => setIsMobileOpen(false)}
                                            >
                                                {slug}
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </nav>
    );
}