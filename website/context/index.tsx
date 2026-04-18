'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { TopicNotes, Note } from '@/types';

type NotesContextType = {
  topics: TopicNotes[];
  setTopics: (topics: TopicNotes[]) => void;
  notes: Note[];
  setNotes: (notes: Note[]) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
};

const NotesContext = createContext<NotesContextType | null>(null);

export function NotesProvider({
  initialTopics,
  initialNotes,
  children,
}: {
  initialTopics: TopicNotes[];
  initialNotes: Note[];
  children: ReactNode;
}) {
  const [topics, setTopics] = useState<TopicNotes[]>(initialTopics);
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <NotesContext.Provider value={{ 
        topics, setTopics, 
        notes, setNotes, 
        searchQuery, setSearchQuery 
    }}>
      {children}
    </NotesContext.Provider>
  );
}

export function useNotes() {
  const ctx = useContext(NotesContext);
  if (!ctx) {
    throw new Error('useNotes must be used inside NotesProvider');
  }
  return ctx;
}
