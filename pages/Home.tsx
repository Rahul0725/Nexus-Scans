import React from 'react';
import { Flame, Clock, Sparkles } from 'lucide-react';
import { Comic } from '../types';
import { ComicCard } from '../components/ComicCard';

interface HomeProps {
  comics: Comic[];
  popular: Comic[];
  aiResults: Comic[] | null;
}

export const Home: React.FC<HomeProps> = ({ comics, popular, aiResults }) => {
  
  // If we have AI results, we show them in a special section at the top
  const displayComics = aiResults || comics;
  const isAiMode = !!aiResults;

  return (
    <div className="space-y-10 pb-10">
      
      {/* Hero / Popular Section */}
      {!isAiMode && (
        <section>
          <div className="flex items-center gap-2 mb-4 text-textMain border-b border-surfaceHighlight pb-2">
            <Flame className="text-secondary" />
            <h2 className="text-xl font-bold">Popular Today</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {popular.map((comic) => (
              <ComicCard key={comic.id} comic={comic} />
            ))}
          </div>
        </section>
      )}

      {/* Main Content Section */}
      <section>
        <div className="flex items-center justify-between mb-4 border-b border-surfaceHighlight pb-2">
          <div className="flex items-center gap-2 text-textMain">
            {isAiMode ? <Sparkles className="text-primary" /> : <Clock className="text-primary" />}
            <h2 className="text-xl font-bold">
              {isAiMode ? "AI Recommended For You" : "Latest Updates"}
            </h2>
          </div>
          {isAiMode && (
             <button onClick={() => window.location.reload()} className="text-xs text-secondary hover:underline">
                Clear AI Results
             </button>
          )}
        </div>

        {isAiMode && displayComics.length === 0 ? (
          <div className="text-center py-20 text-textMuted">
            <p>No results found for your specific query. Try a broader term.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {displayComics.map((comic) => (
              <ComicCard key={comic.id} comic={comic} />
            ))}
          </div>
        )}
      </section>

    </div>
  );
};
