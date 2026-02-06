'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { TopicNotes } from '@/types';

type NotesContextType = {
  topics: TopicNotes[];
  setTopics: (topics: TopicNotes[]) => void;
};

const NotesContext = createContext<NotesContextType | null>(null);

export function NotesProvider({
  initialTopics,
  children,
}: {
  initialTopics: TopicNotes[];
  children: ReactNode;
}) {
  const [topics, setTopics] = useState<TopicNotes[]>(initialTopics);

  return (
    <NotesContext.Provider value={{ topics, setTopics }}>
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
