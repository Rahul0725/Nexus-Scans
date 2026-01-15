import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Comic } from '../types';
import { ArrowLeft, ArrowRight, List, Settings, Home, ChevronLeft, ChevronRight, Menu } from 'lucide-react';

interface ReaderProps {
  comics: Comic[];
  aiResults: Comic[] | null;
}

export const Reader: React.FC<ReaderProps> = ({ comics, aiResults }) => {
  const { id, chapter } = useParams<{ id: string, chapter: string }>();
  const navigate = useNavigate();
  const [comic, setComic] = useState<Comic | undefined>(undefined);
  const [showControls, setShowControls] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);
  const controlsTimeoutRef = useRef<number | null>(null);
  
  // Find comic data
  useEffect(() => {
    const found = comics.find(c => c.id === id) || aiResults?.find(c => c.id === id);
    setComic(found);
  }, [id, comics, aiResults]);

  // Scroll Progress Listener
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-hide controls interaction
  const resetControlsTimeout = () => {
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    // Optional: Auto hide after 3 seconds of inactivity
    // controlsTimeoutRef.current = window.setTimeout(() => setShowControls(false), 3000);
  };

  const toggleControls = () => {
    setShowControls(prev => !prev);
    resetControlsTimeout();
  };

  if (!comic) return (
    <div className="flex items-center justify-center min-h-screen text-textMuted bg-black">
      <div className="animate-pulse flex flex-col items-center gap-2">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
        <span>Loading Chapter...</span>
      </div>
    </div>
  );

  const currentChapterNum = parseInt(chapter || '1');
  // Logic assumes chapters are numeric and sequential for mock purposes
  // In a real app, we'd find the index in comic.chapters
  const currentChapterIndex = comic.chapters.findIndex(c => c.number === chapter);
  
  // Safe navigation logic
  const prevChapter = currentChapterIndex < comic.chapters.length - 1 ? comic.chapters[currentChapterIndex + 1] : null; // Older chapter (higher index)
  const nextChapter = currentChapterIndex > 0 ? comic.chapters[currentChapterIndex - 1] : null; // Newer chapter (lower index)

  // Use simple number math if index logic fails (fallback for mock data consistency)
  const fallbackPrev = currentChapterNum > 1 ? currentChapterNum - 1 : null;
  const fallbackNext = currentChapterNum < comic.chapters.length ? currentChapterNum + 1 : null;
  
  // Simulate images for the reader
  const images = Array.from({ length: 12 }, (_, i) => `https://picsum.photos/seed/${comic.id}-${chapter}-${i}/800/1200`);

  const handlePrev = () => {
    if (prevChapter) navigate(`/read/${id}/${prevChapter.number}`);
    else if (fallbackPrev) navigate(`/read/${id}/${fallbackPrev}`);
  };

  const handleNext = () => {
    if (nextChapter) navigate(`/read/${id}/${nextChapter.number}`);
    else if (fallbackNext) navigate(`/read/${id}/${fallbackNext}`);
  };

  return (
    <div className="bg-[#121212] min-h-screen text-gray-200">
      
      {/* Progress Bar (Always visible at very top) */}
      <div className="fixed top-0 left-0 w-full h-1 z-50 bg-gray-800">
        <div 
          className="h-full bg-primary transition-all duration-150 ease-out shadow-[0_0_10px_rgba(124,58,237,0.5)]" 
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Top Navigation Bar */}
      <div className={`fixed top-0 left-0 right-0 z-40 transition-transform duration-300 transform ${showControls ? 'translate-y-0' : '-translate-y-full'}`}>
        <div className="bg-surface/95 backdrop-blur-md border-b border-surfaceHighlight shadow-lg px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            <Link to={`/comic/${comic.id}`} className="p-2 -ml-2 hover:bg-surfaceHighlight rounded-full text-textMuted hover:text-white transition-colors">
               <ArrowLeft size={20} />
            </Link>
            <div className="flex flex-col overflow-hidden">
              <h1 className="text-sm font-bold text-textMain truncate max-w-[200px] sm:max-w-md">{comic.title}</h1>
              <p className="text-xs text-textMuted truncate">
                {comic.chapters.find(c => c.number === chapter)?.title || `Chapter ${chapter}`}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-1 sm:gap-2">
             <button 
               disabled={!prevChapter && !fallbackPrev}
               onClick={handlePrev}
               className="p-2 hover:bg-surfaceHighlight rounded-full disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
               title="Previous Chapter"
             >
               <ChevronLeft size={20} />
             </button>
             
             <div className="relative group">
                <select 
                  className="appearance-none bg-surfaceHighlight hover:bg-surface border border-surfaceHighlight text-textMain text-sm rounded-lg pl-3 pr-8 py-1.5 focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-colors cursor-pointer"
                  value={chapter}
                  onChange={(e) => navigate(`/read/${id}/${e.target.value}`)}
                >
                  {comic.chapters.map(ch => (
                    <option key={ch.id} value={ch.number}>Ch. {ch.number}</option>
                  ))}
                </select>
                <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-textMuted">
                  <List size={14} />
                </div>
             </div>

             <button 
               disabled={!nextChapter && !fallbackNext}
               onClick={handleNext}
               className="p-2 hover:bg-surfaceHighlight rounded-full disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
               title="Next Chapter"
             >
               <ChevronRight size={20} />
             </button>
             
             <button className="hidden sm:block p-2 hover:bg-surfaceHighlight rounded-full text-textMuted hover:text-white transition-colors">
               <Settings size={20} />
             </button>
          </div>
        </div>
      </div>

      {/* Reader Content Area */}
      <div 
        className="w-full max-w-3xl mx-auto min-h-screen bg-black shadow-2xl cursor-pointer"
        onClick={toggleControls}
      >
         {images.map((img, idx) => (
           <div key={idx} className="relative w-full">
             <img 
               src={img} 
               alt={`Page ${idx + 1}`} 
               className="w-full h-auto block select-none"
               loading={idx < 2 ? "eager" : "lazy"}
             />
             {/* Render a skeleton loader behind the image if needed, or simple background */}
           </div>
         ))}
         
         {/* End of chapter Actions */}
         <div className="py-12 px-4 flex flex-col items-center gap-6 bg-[#121212]">
            <p className="text-textMuted text-sm">You have reached the end of the chapter.</p>
            <div className="flex items-center gap-4 w-full max-w-md">
                <button 
                   onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                   disabled={!prevChapter && !fallbackPrev}
                   className="flex-1 bg-surfaceHighlight hover:bg-surface disabled:opacity-50 text-textMain py-3 rounded-lg font-bold transition-colors flex justify-center items-center gap-2"
                >
                  <ChevronLeft size={16} /> Previous
                </button>
                <button 
                   onClick={(e) => { e.stopPropagation(); handleNext(); }}
                   disabled={!nextChapter && !fallbackNext}
                   className="flex-1 bg-primary hover:bg-primaryHover disabled:opacity-50 disabled:hover:bg-primary text-white py-3 rounded-lg font-bold transition-colors shadow-lg shadow-primary/20 flex justify-center items-center gap-2"
                >
                  Next <ChevronRight size={16} />
                </button>
            </div>
         </div>
      </div>

      {/* Bottom Floating Bar (Mobile primarily) */}
      <div className={`fixed bottom-0 left-0 right-0 z-40 transition-transform duration-300 transform ${showControls ? 'translate-y-0' : 'translate-y-full'}`}>
        <div className="bg-surface/95 backdrop-blur-md border-t border-surfaceHighlight px-4 py-3 sm:hidden">
           <div className="flex justify-between items-center text-textMuted">
              <Link to="/" className="flex flex-col items-center gap-1">
                 <Home size={20} />
                 <span className="text-[10px]">Home</span>
              </Link>
              <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex flex-col items-center gap-1">
                 <ArrowLeft size={20} className="rotate-90" />
                 <span className="text-[10px]">Top</span>
              </button>
              <button className="flex flex-col items-center gap-1">
                 <Menu size={20} />
                 <span className="text-[10px]">Menu</span>
              </button>
           </div>
        </div>
      </div>

    </div>
  );
};
