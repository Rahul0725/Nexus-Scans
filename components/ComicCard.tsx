import React from 'react';
import { Star, Clock } from 'lucide-react';
import { Comic } from '../types';
import { Link } from 'react-router-dom';

interface ComicCardProps {
  comic: Comic;
  compact?: boolean;
}

export const ComicCard: React.FC<ComicCardProps> = ({ comic, compact = false }) => {
  const latestChapter = comic.chapters[0];

  return (
    <div className="group relative flex flex-col bg-surfaceHighlight rounded-lg overflow-hidden shadow-lg hover:shadow-primary/20 transition-all duration-300">
      {/* Image Container */}
      <Link to={`/comic/${comic.id}`} className="relative aspect-[2/3] overflow-hidden">
        <img 
          src={comic.coverUrl} 
          alt={comic.title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        
        {/* Overlay Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {comic.isHot && (
            <span className="bg-secondary text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider shadow-sm">
              Hot
            </span>
          )}
          {comic.isNew && (
            <span className="bg-blue-500 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider shadow-sm">
              New
            </span>
          )}
        </div>

        {/* Rating Badge */}
        <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-sm text-yellow-400 text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
          <Star size={10} fill="currentColor" />
          {comic.rating}
        </div>
        
        {/* Type Badge */}
        <div className="absolute top-2 right-2 bg-primary/90 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
          {comic.type}
        </div>
      </Link>

      {/* Content */}
      <div className="p-3 flex flex-col flex-grow">
        <Link to={`/comic/${comic.id}`} className="block">
          <h3 className="font-bold text-sm text-textMain line-clamp-1 group-hover:text-primary transition-colors mb-1" title={comic.title}>
            {comic.title}
          </h3>
        </Link>
        
        {!compact && (
           <div className="flex flex-wrap gap-1 mb-2">
             {comic.genres.slice(0, 2).map(g => (
               <span key={g} className="text-[10px] text-textMuted bg-surface px-1.5 py-0.5 rounded">
                 {g}
               </span>
             ))}
           </div>
        )}

        {/* Latest Chapters - pushed to bottom */}
        <div className="mt-auto border-t border-surface pt-2 space-y-1">
          {comic.chapters.slice(0, 2).map((ch) => (
            <Link 
              key={ch.id} 
              to={`/read/${comic.id}/${ch.number}`}
              className="flex justify-between items-center text-xs group/chapter hover:bg-surface p-1 rounded transition-colors"
            >
              <span className="text-textMuted group-hover/chapter:text-textMain font-medium">
                Ch. {ch.number}
              </span>
              <div className="flex items-center gap-1 text-[10px] text-textMuted/70">
                <Clock size={10} />
                <span>{ch.releaseDate}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
