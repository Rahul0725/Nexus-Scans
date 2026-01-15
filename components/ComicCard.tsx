import React from 'react';
import { Star, Clock, User } from 'lucide-react';
import { Comic } from '../types';
import { Link } from 'react-router-dom';

interface ComicCardProps {
  comic: Comic;
  compact?: boolean;
}

export const ComicCard: React.FC<ComicCardProps> = ({ comic, compact = false }) => {
  return (
    <div className="flex flex-col gap-2 group w-full">
      {/* Cover Image Container */}
      <Link to={`/comic/${comic.id}`} className="relative aspect-[2/3] w-full overflow-hidden rounded-md bg-[#222]">
        <img 
          src={comic.coverUrl} 
          alt={comic.title} 
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        
        {/* Badges Overlay */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 items-start">
           {/* Rating Badge */}
           <div className="bg-[#111]/80 backdrop-blur-sm px-1.5 py-0.5 rounded text-[10px] font-bold text-white flex items-center gap-1 border border-white/10">
              <Star size={8} className="text-yellow-400 fill-yellow-400" /> {comic.rating}
           </div>
        </div>

        {/* Hot/New Badges - Top Right */}
        <div className="absolute top-2 right-2 flex flex-col gap-1 items-end">
          {comic.isHot && (
            <span className="bg-red-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded uppercase">
              Hot
            </span>
          )}
          {comic.isNew && (
            <span className="bg-blue-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded uppercase">
              New
            </span>
          )}
        </div>
        
        {/* Type Badge - Bottom Right Overlay */}
        <div className="absolute bottom-0 right-0 left-0 bg-gradient-to-t from-black/90 to-transparent p-2 pt-8 flex justify-between items-end">
           <span className="text-[10px] font-bold text-white uppercase bg-primary px-1.5 py-0.5 rounded-sm">
             {comic.type}
           </span>
        </div>
      </Link>

      {/* Details */}
      <div className="flex flex-col gap-1">
        <Link to={`/comic/${comic.id}`}>
          <h3 className="text-white font-semibold text-sm leading-tight line-clamp-2 hover:text-primary transition-colors" title={comic.title}>
            {comic.title}
          </h3>
        </Link>
        
        {/* Latest Chapters - Asura Style */}
        <div className="flex flex-col gap-1 mt-1">
          {comic.chapters.slice(0, 2).map((ch) => (
            <div key={ch.id} className="flex justify-between items-center text-[11px] text-[#888] border-t border-[#222] pt-1">
              <Link to={`/read/${comic.id}/${ch.number}`} className="hover:text-primary transition-colors flex items-center gap-1 truncate max-w-[60%]">
                 <span className="truncate">Ch. {ch.number}</span>
              </Link>
              <span className="text-[#555] text-[10px] whitespace-nowrap">{ch.releaseDate}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};