import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-surface border-t border-surfaceHighlight mt-12 py-8">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
           <div className="w-6 h-6 bg-gradient-to-br from-primary to-secondary rounded flex items-center justify-center text-white font-bold text-xs">N</div>
           <span className="font-bold text-lg text-textMain">Nexus<span className="text-primary">Scans</span></span>
        </div>
        <p className="text-textMuted text-sm mb-4">
          The best place to read Manhwa, Manhua, and Manga online for free.
        </p>
        <div className="flex justify-center gap-4 text-xs text-textMuted/60">
          <a href="#" className="hover:text-textMain">Privacy Policy</a>
          <a href="#" className="hover:text-textMain">Terms of Service</a>
          <a href="#" className="hover:text-textMain">DMCA</a>
          <a href="#" className="hover:text-textMain">Contact</a>
        </div>
        <p className="mt-6 text-xs text-textMuted/40">
          © {new Date().getFullYear()} Nexus Scans. All rights reserved.
        </p>
      </div>
    </footer>
  );
};
