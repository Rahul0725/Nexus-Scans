import React, { useState } from 'react';
import { Search, Menu, X, BookOpen, User, UploadCloud, Shield, LogOut, Shuffle, Moon } from 'lucide-react';
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
    <nav className="sticky top-0 z-50 w-full bg-[#16151d] border-b border-[#262626] shadow-md">
      <div className="max-w-[1400px] mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo Area */}
          <div className="flex items-center gap-6">
            <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
              {/* Logo Icon */}
              <div className="w-8 h-8 bg-primary rounded flex items-center justify-center text-white font-bold text-lg">
                N
              </div>
              <span className="font-bold text-xl tracking-tight text-white hidden sm:block">
                NEXUS<span className="text-primary">SCANS</span>
              </span>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center gap-6 text-[13px] font-bold text-[#b0b0b0] uppercase tracking-wide">
              <Link to="/" className="hover:text-primary transition-colors">Home</Link>
              <Link to="/" className="hover:text-primary transition-colors">Bookmarks</Link>
              <Link to="/" className="hover:text-primary transition-colors">Projects</Link>
            </div>
          </div>

          {/* Search & Actions */}
          <div className="flex items-center gap-3">
            {/* Desktop Search */}
            <div className="hidden md:block relative w-64">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="w-full bg-[#242424] border border-[#333] text-gray-200 text-xs rounded pl-3 pr-8 py-2 focus:outline-none focus:border-primary transition-colors placeholder:text-gray-500"
                onKeyDown={(e) => e.key === 'Enter' && handleSearch(e)}
              />
              <button 
                onClick={triggerAiSearch}
                className="absolute right-2 top-2 text-gray-500 hover:text-primary transition-colors"
              >
                {isAiLoading ? <span className="animate-spin text-primary block text-xs">⟳</span> : <Search size={14} />}
              </button>
            </div>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center gap-2">
              {isAdmin ? (
                <>
                  <Link to="/upload" className="text-gray-400 hover:text-white p-2"><UploadCloud size={18} /></Link>
                  <Link to="/admin" className="text-gray-400 hover:text-white p-2"><Shield size={18} /></Link>
                  <button onClick={onLogout} className="text-gray-400 hover:text-white p-2"><LogOut size={18} /></button>
                </>
              ) : (
                <Link to="/login" className="bg-[#333] hover:bg-[#444] text-white px-3 py-1.5 rounded text-xs font-bold transition-colors">
                  Log In
                </Link>
              )}
            </div>
            
            <button className="text-gray-400 hover:text-white p-2">
               <Moon size={18} />
            </button>

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
        <div className="md:hidden bg-[#16151d] border-b border-[#333]">
          <div className="px-4 py-4 space-y-4">
             <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="w-full bg-[#242424] border border-[#333] text-gray-200 text-sm rounded pl-3 pr-10 py-2.5"
              />
              <button onClick={triggerAiSearch} className="absolute right-3 top-2.5 text-gray-400">
                <Search size={16} />
              </button>
            </div>
            
            <div className="flex flex-col gap-2 font-medium text-gray-300">
              <Link to="/" className="hover:text-primary py-2 border-b border-[#222]">Home</Link>
              <Link to="/" className="hover:text-primary py-2 border-b border-[#222]">Bookmarks</Link>
              <Link to="/" className="hover:text-primary py-2 border-b border-[#222]">Projects</Link>
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