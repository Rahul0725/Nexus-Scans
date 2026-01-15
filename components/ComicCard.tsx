import React from 'react';
import { Star } from 'lucide-react';
import { Comic } from '../types';
import { Link } from 'react-router-dom';

interface ComicCardProps {
  comic: Comic;
  compact?: boolean;
}

export const ComicCard: React.FC<ComicCardProps> = ({ comic, compact = false }) => {
  return (
    <div className="flex flex-col gap-3 group w-full">
      {/* Cover Image Container */}
      <Link to={`/comic/${comic.id}`} className="relative aspect-[3/4] w-full overflow-hidden rounded bg-[#222] block shadow-md">
        <img 
          src={comic.coverUrl} 
          alt={comic.title} 
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        
        {/* Rating Badge Overlay - Top Left */}
        <div className="absolute top-2 left-2 flex items-center">
           <div className="bg-white text-black text-[10px] font-bold px-1.5 py-0.5 rounded-sm flex items-center gap-0.5">
              <Star size={8} className="text-yellow-500 fill-yellow-500" /> {comic.rating}
           </div>
        </div>

        {/* Badges - Top Right */}
        <div className="absolute top-2 right-2 flex flex-col gap-1 items-end">
          {comic.isHot && (
            <span className="bg-[#ff3b30] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-sm uppercase tracking-wide">
              Hot
            </span>
          )}
          {comic.isNew && (
            <span className="bg-[#007aff] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-sm uppercase tracking-wide">
              New
            </span>
          )}
        </div>
        
        {/* Shadow Overlay for Type at bottom */}
        <div className="absolute bottom-0 left-0 w-full p-2 bg-gradient-to-t from-black/80 to-transparent">
          <span className={`text-[10px] font-bold text-white uppercase px-1.5 py-0.5 rounded-sm 
            ${comic.type === 'Manhwa' ? 'bg-[#7645d9]' : comic.type === 'Manhua' ? 'bg-[#ff9500]' : 'bg-[#ff3b30]'}`}>
             {comic.type}
          </span>
        </div>
      </Link>

      {/* Content Area */}
      <div className="flex flex-col">
        {/* Title */}
        <Link to={`/comic/${comic.id}`} className="mb-2">
          <h3 className="text-white font-bold text-[14px] leading-tight line-clamp-2 group-hover:text-primary transition-colors" title={comic.title}>
            {comic.title}
          </h3>
        </Link>
        
        {/* Chapter List - Asura Style */}
        <div className="flex flex-col gap-1.5">
          {comic.chapters.slice(0, 3).map((ch) => (
            <div key={ch.id} className="flex justify-between items-center text-[#999] text-[11px]">
              <Link to={`/read/${comic.id}/${ch.number}`} className="hover:text-primary transition-colors truncate max-w-[65%]">
                 Chapter {ch.number}
              </Link>
              {/* Mock relative time based on index for demo purposes */}
              <span className="text-[#666] text-[10px] whitespace-nowrap">
                {parseInt(ch.number) % 2 === 0 ? '5 hours ago' : '1 day ago'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};