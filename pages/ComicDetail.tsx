import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Comic } from '../types';
import { Star, BookOpen, Calendar, User, Tag, Share2, Flag, ArrowLeft } from 'lucide-react';

interface ComicDetailProps {
  comics: Comic[];
  aiResults: Comic[] | null;
}

export const ComicDetail: React.FC<ComicDetailProps> = ({ comics, aiResults }) => {
  const { id } = useParams<{ id: string }>();
  const [comic, setComic] = useState<Comic | undefined>(undefined);

  useEffect(() => {
    // Check both main list and AI results list
    const found = comics.find(c => c.id === id) || aiResults?.find(c => c.id === id);
    setComic(found);
  }, [id, comics, aiResults]);

  if (!comic) {
    return <div className="p-10 text-center text-textMuted">Comic not found or loading...</div>;
  }

  return (
    <div className="animate-in fade-in duration-500">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-textMuted mb-6">
        <Link to="/" className="hover:text-primary">Home</Link>
        <span>/</span>
        <Link to="/" className="hover:text-primary">{comic.type}</Link>
        <span>/</span>
        <span className="text-textMain">{comic.title}</span>
      </div>

      {/* Top Section: Info */}
      <div className="flex flex-col md:flex-row gap-8 mb-12">
        {/* Cover Image */}
        <div className="flex-shrink-0 w-full md:w-64 lg:w-72">
           <div className="relative rounded-lg overflow-hidden shadow-2xl shadow-primary/10 aspect-[2/3]">
             <img src={comic.coverUrl} alt={comic.title} className="w-full h-full object-cover" />
             <div className="absolute top-2 left-2 bg-secondary text-white text-xs font-bold px-2 py-1 rounded">
               {comic.status}
             </div>
           </div>
        </div>

        {/* Info */}
        <div className="flex-grow">
          <h1 className="text-3xl md:text-4xl font-bold text-textMain mb-2">{comic.title}</h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-textMuted mb-6">
            <span className="flex items-center gap-1 text-yellow-400 font-semibold"><Star size={16} fill="currentColor"/> {comic.rating}</span>
            <span className="flex items-center gap-1"><BookOpen size={16}/> {comic.chapters.length} Chapters</span>
            <span className="flex items-center gap-1"><User size={16}/> {comic.author}</span>
            <span className="bg-surfaceHighlight px-2 py-0.5 rounded text-xs">{comic.type}</span>
          </div>

          <div className="prose prose-invert prose-sm max-w-none text-textMuted mb-6">
             <h3 className="text-textMain font-bold text-sm uppercase tracking-wider mb-2 border-b border-surfaceHighlight pb-1 inline-block">Synopsis</h3>
             <p className="leading-relaxed">{comic.description}</p>
          </div>

          <div className="flex flex-wrap gap-2 mb-8">
            {comic.genres.map(g => (
              <span key={g} className="px-3 py-1 rounded-full bg-surfaceHighlight hover:bg-surface border border-surface text-xs text-textMuted hover:text-primary transition-colors cursor-pointer">
                {g}
              </span>
            ))}
          </div>

          <div className="flex gap-3">
             <Link 
                to={`/read/${comic.id}/${comic.chapters[0]?.number || '1'}`}
                className="bg-primary hover:bg-primaryHover text-white px-8 py-3 rounded-lg font-bold flex items-center gap-2 transition-all shadow-lg shadow-primary/25"
             >
                Read First
             </Link>
             <button className="bg-surfaceHighlight hover:bg-surface text-textMain px-4 py-3 rounded-lg flex items-center gap-2 transition-colors">
                <Share2 size={18} />
             </button>
             <button className="bg-surfaceHighlight hover:bg-surface text-textMain px-4 py-3 rounded-lg flex items-center gap-2 transition-colors">
                <Flag size={18} />
             </button>
          </div>
        </div>
      </div>

      {/* Chapter List */}
      <div className="bg-surfaceHighlight rounded-xl overflow-hidden shadow-lg">
        <div className="p-4 border-b border-surface flex items-center justify-between">
           <h3 className="font-bold text-lg text-textMain">Chapter List</h3>
           <div className="text-xs text-textMuted">{new Date().getFullYear()}</div>
        </div>
        <div className="max-h-[600px] overflow-y-auto p-2 space-y-1">
          {comic.chapters.map((ch) => (
            <Link 
              key={ch.id}
              to={`/read/${comic.id}/${ch.number}`}
              className="flex items-center justify-between p-3 rounded hover:bg-surface group transition-colors"
            >
              <div className="flex items-center gap-3">
                 <span className="text-textMuted font-medium group-hover:text-primary transition-colors">Chapter {ch.number}</span>
                 {parseInt(ch.number) > comic.chapters.length - 3 && (
                   <span className="text-[10px] bg-secondary/10 text-secondary px-1.5 py-0.5 rounded font-bold">NEW</span>
                 )}
              </div>
              <div className="flex items-center gap-4 text-xs text-textMuted/50">
                 <span className="hidden sm:inline">{ch.releaseDate}</span>
                 <ArrowLeft size={14} className="rotate-180 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
