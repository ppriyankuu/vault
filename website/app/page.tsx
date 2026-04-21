import HomePageContent from '@/components/homePageContent';

export const revalidate = 60;

export default function HomePage() {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-200">
      <main className="container mx-auto px-4 py-12 sm:px-6">
        <HomePageContent />
      </main>
    </div>
  );
}