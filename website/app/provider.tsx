import { fetchTopicsWithNotes, fetchMarkdownContent, fetchFileLastCommitDate, fetchSearchIndex } from '@/lib/github';
import { parseMarkdown } from '@/lib/markdown';
import { NotesProvider } from '@/context';
import { TopicNotes, Note } from '@/types';

export default async function NotesProviderServer({
    children,
}: {
    children: React.ReactNode;
}) {
    let topics: TopicNotes[] = [];
    let notePosts: Note[] = [];
    
    try {
        topics = await fetchTopicsWithNotes();

        try {
            const searchIndex = await fetchSearchIndex();
            if (searchIndex && searchIndex.length > 0) {
                notePosts = searchIndex;
            } else {
                // Fallback to the old method if search_index.json is missing or empty
                const promises = topics.flatMap((topic) =>
                    topic.files.map(async (file) => {
                        const content = await fetchMarkdownContent(file.path);
                        const lastModifiedDate = await fetchFileLastCommitDate(file.path);
                        return parseMarkdown(content, file.name, topic.topic, lastModifiedDate || undefined);
                    })
                );
                notePosts = await Promise.all(promises);
            }
        } catch (e) {
            console.error("Could not fetch search index, falling back to individual fetches", e);
            const promises = topics.flatMap((topic) =>
                topic.files.map(async (file) => {
                    const content = await fetchMarkdownContent(file.path);
                    const lastModifiedDate = await fetchFileLastCommitDate(file.path);
                    return parseMarkdown(content, file.name, topic.topic, lastModifiedDate || undefined);
                })
            );
            notePosts = await Promise.all(promises);
        }
        
        notePosts.sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
    } catch (error) {
        console.error("Error fetching notes in provider:", error);
    }

    return (
        <NotesProvider initialTopics={topics} initialNotes={notePosts}>
            {children}
        </NotesProvider>
    );
}
