import NoteCard from '@/components/noteCard';
import { fetchTopicsWithNotes, fetchMarkdownContent } from '@/lib/github';
import { parseMarkdown } from '@/lib/markdown';
import { Note } from '@/types';

export const revalidate = 60;

export default async function HomePage() {
  let notePosts: Note[] = [];
  let topics = [];

  try {
    topics = await fetchTopicsWithNotes();

    const promises = topics.flatMap((topic) =>
      topic.files.map(async (file) => {
        const content = await fetchMarkdownContent(file.path);
        return parseMarkdown(content, file.name, topic.topic);
      })
    );

    notePosts = await Promise.all(promises);

    notePosts.sort(
      (a, b) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  } catch (error) {
    console.error(error);
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center max-w-lg mx-auto p-6">
          <h1 className="text-2xl font-bold text-red-400 mb-3">Error Loading Notes</h1>
          <p className="text-gray-400 mb-4">Failed to fetch notes. Please try again later.</p>
          <pre className="text-gray-500 text-sm mt-4 p-4 bg-gray-900 rounded-lg overflow-x-auto">
            {error instanceof Error ? error.message : 'Unknown error'}
          </pre>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <main className="container mx-auto px-4 py-8 sm:px-6">
        <h1 className="
          text-3xl md:text-4xl font-bold text-white
          mb-10 text-center
          py-4
          bg-linear-to-r from-gray-800 to-gray-900
          border border-gray-700/50
          rounded-xl
          shadow-[0_4px_12px_rgba(0,0,0,0.3)]
          backdrop-blur-sm
          sticky top-4 z-20
        ">
          Notes I push to GitHub.
        </h1>

        {notePosts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg italic">
              No notes found.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {notePosts.map((post) => (
              <NoteCard key={`${post.topic}-${post.slug}`} post={post} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}