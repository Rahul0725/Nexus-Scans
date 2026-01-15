import React, { useState } from 'react';
import { Search, Menu, X, Flame, BookOpen, User, Sparkles, UploadCloud, Shield, LogOut, LogIn, Shuffle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

interface NavbarProps {
  onAiSearch: (query: string) => void;
  isAiLoading: boolean;
  isAdmin: boolean;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onAiSearch, isAiLoading, isAdmin, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log("Standard search for:", searchQuery);
    }
  };

  const triggerAiSearch = () => {
    if (searchQuery.trim()) {
      onAiSearch(searchQuery);
      setIsOpen(false); 
      navigate('/'); 
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-[#111111] border-b border-[#222]">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Links Area */}
          <div className="flex items-center gap-8">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
              <div className="w-8 h-8 bg-primary rounded flex items-center justify-center text-white font-bold text-lg">
                N
              </div>
              <span className="font-bold text-lg tracking-tight text-white hidden sm:block">
                NEXUS<span className="text-primary">SCANS</span>
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6 text-sm font-semibold text-gray-300">
              <Link to="/" className="hover:text-white transition-colors">Home</Link>
              <Link to="/" className="hover:text-white transition-colors flex items-center gap-1">
                <BookOpen size={16} className="text-primary" /> Bookmarks
              </Link>
              <Link to="/" className="hover:text-white transition-colors flex items-center gap-1">
                <Shuffle size={16} className="text-primary" /> Surprise Me
              </Link>
            </div>
          </div>

          {/* Search & Actions */}
          <div className="flex items-center gap-4">
            {/* Desktop Search */}
            <div className="hidden md:block relative w-64">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="w-full bg-[#1c1c1c] border border-[#333] text-gray-200 text-sm rounded-md pl-3 pr-10 py-2 focus:outline-none focus:border-primary transition-colors"
                onKeyDown={(e) => e.key === 'Enter' && handleSearch(e)}
              />
              <button 
                onClick={triggerAiSearch}
                className="absolute right-1.5 top-1.5 text-gray-400 hover:text-primary transition-colors"
              >
                {isAiLoading ? <span className="animate-spin text-primary">⟳</span> : <Search size={16} />}
              </button>
            </div>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center gap-3">
              {isAdmin ? (
                <>
                  <Link to="/upload" className="text-gray-300 hover:text-white"><UploadCloud size={20} /></Link>
                  <Link to="/admin" className="text-gray-300 hover:text-white"><Shield size={20} /></Link>
                  <button onClick={onLogout} className="text-gray-300 hover:text-white"><LogOut size={20} /></button>
                </>
              ) : (
                <Link to="/login" className="bg-[#222] hover:bg-[#333] text-white px-3 py-1.5 rounded text-xs font-bold transition-colors flex items-center gap-1">
                  <User size={14} /> Login
                </Link>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-gray-300 hover:text-white p-2"
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-[#161616] border-b border-[#333]">
          <div className="px-4 py-4 space-y-4">
             <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search comics..."
                className="w-full bg-[#111] border border-[#333] text-gray-200 text-sm rounded pl-3 pr-10 py-2.5"
              />
              <button onClick={triggerAiSearch} className="absolute right-3 top-2.5 text-gray-400">
                <Search size={16} />
              </button>
            </div>
            
            <div className="flex flex-col gap-2 font-medium text-gray-300">
              <Link to="/" className="hover:text-white py-2 border-b border-[#222]">Home</Link>
              <Link to="/" className="hover:text-white py-2 border-b border-[#222]">Bookmarks</Link>
              <Link to="/" className="hover:text-white py-2 border-b border-[#222]">Surprise Me</Link>
              {isAdmin ? (
                <>
                  <Link to="/upload" className="hover:text-white py-2">Upload</Link>
                  <Link to="/admin" className="hover:text-white py-2">Admin</Link>
                  <button onClick={onLogout} className="text-left hover:text-white py-2">Logout</button>
                </>
              ) : (
                <Link to="/login" className="hover:text-white py-2">Login</Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};