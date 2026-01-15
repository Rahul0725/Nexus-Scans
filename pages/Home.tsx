import React from 'react';
import { Flame, Clock, Sparkles, ChevronRight } from 'lucide-react';
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
    <div className="space-y-12 pb-10">
      
      {/* Popular Today Section - "Weekly Popular" style */}
      {!isAiMode && (
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-[#262626] pb-3">
             <div className="flex items-center gap-2 text-white">
                <Flame className="text-primary w-5 h-5" fill="currentColor" />
                <h2 className="text-lg font-bold uppercase tracking-wide">Popular Today</h2>
             </div>
             <a href="#" className="text-xs font-bold text-[#666] hover:text-white transition-colors">VIEW ALL</a>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-6">
            {popular.map((comic) => (
              <ComicCard key={comic.id} comic={comic} />
            ))}
          </div>
        </section>
      )}

      {/* Main Content Section - "Latest Updates" */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-[#262626] pb-3">
          <div className="flex items-center gap-2 text-white">
            {isAiMode ? <Sparkles className="text-primary w-5 h-5" /> : <Clock className="text-primary w-5 h-5" />}
            <h2 className="text-lg font-bold uppercase tracking-wide">
              {isAiMode ? "AI Recommended For You" : "Latest Updates"}
            </h2>
          </div>
          {isAiMode ? (
             <button onClick={() => window.location.reload()} className="text-xs font-bold text-secondary hover:underline">
                CLEAR RESULTS
             </button>
          ) : (
             <a href="#" className="text-xs font-bold text-[#666] hover:text-white transition-colors">VIEW ALL</a>
          )}
        </div>

        {isAiMode && displayComics.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-[#444] border border-[#222] rounded-lg border-dashed">
            <Sparkles size={48} className="mb-4 opacity-20" />
            <p>No specific results found. Try a different query.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-8">
            {displayComics.map((comic) => (
              <ComicCard key={comic.id} comic={comic} />
            ))}
          </div>
        )}
        
        {/* Pagination Dummy */}
        {!isAiMode && (
          <div className="flex justify-center pt-8">
            <button className="bg-[#1c1c1c] hover:bg-[#262626] text-white px-6 py-3 rounded-lg font-bold text-sm transition-colors flex items-center gap-2">
               Load More Series <ChevronRight size={16} />
            </button>
          </div>
        )}
      </section>

    </div>
  );
};