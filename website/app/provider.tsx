import { fetchTopicsWithNotes } from '@/lib/github';
import { NotesProvider } from '@/context';

export default async function NotesProviderServer({
    children,
}: {
    children: React.ReactNode;
}) {
    const topics = await fetchTopicsWithNotes();

    return (
        <NotesProvider initialTopics={topics}>
            {children}
        </NotesProvider>
    );
}
