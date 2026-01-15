import React, { useState } from 'react';
import { Search, Menu, X, Flame, BookOpen, User, Sparkles, UploadCloud, Shield, LogOut, LogIn } from 'lucide-react';
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
    <nav className="sticky top-0 z-50 w-full bg-surface/95 backdrop-blur-md border-b border-surfaceHighlight">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary/20">
              N
            </div>
            <span className="font-bold text-xl tracking-tight text-textMain hidden sm:block">
              Nexus<span className="text-primary">Scans</span>
            </span>
          </div>

          {/* Desktop Search */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8 relative">
            <div className="relative w-full group">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search comics..."
                className="w-full bg-background border border-surfaceHighlight text-textMain text-sm rounded-full pl-10 pr-24 py-2 focus:outline-none focus:border-primary transition-colors"
                onKeyDown={(e) => e.key === 'Enter' && handleSearch(e)}
              />
              <Search className="absolute left-3 top-2.5 text-textMuted w-4 h-4" />
              
              <button 
                onClick={triggerAiSearch}
                disabled={isAiLoading}
                className={`absolute right-1 top-1 bottom-1 px-3 rounded-full flex items-center gap-1 text-xs font-bold transition-all ${isAiLoading ? 'bg-surfaceHighlight text-textMuted' : 'bg-primary text-white hover:bg-primaryHover'}`}
              >
                {isAiLoading ? (
                  <span className="animate-pulse">Thinking...</span>
                ) : (
                  <>
                    <Sparkles size={12} />
                    <span>AI Find</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-textMuted">
            <Link to="/" className="hover:text-primary transition-colors flex items-center gap-1">
              <BookOpen size={16} /> Library
            </Link>
            <Link to="/" className="hover:text-primary transition-colors flex items-center gap-1">
              <Flame size={16} /> Popular
            </Link>
            
            {isAdmin ? (
              <>
                <Link to="/upload" className="hover:text-primary transition-colors flex items-center gap-1">
                  <UploadCloud size={16} /> Upload
                </Link>
                <Link to="/admin" className="hover:text-primary transition-colors flex items-center gap-1 text-secondary">
                  <Shield size={16} /> Admin
                </Link>
                <button 
                  onClick={onLogout}
                  className="bg-surfaceHighlight hover:bg-surface text-textMain p-2 rounded-full transition-colors flex items-center gap-2 px-3 text-xs"
                >
                  <LogOut size={14} /> Logout
                </button>
              </>
            ) : (
              <Link to="/login" className="bg-surfaceHighlight hover:bg-surface text-textMain px-4 py-2 rounded-full transition-colors flex items-center gap-2 text-xs font-bold">
                <LogIn size={14} /> Staff Login
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-textMuted hover:text-white p-2"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-surface border-b border-surfaceHighlight">
          <div className="px-4 pt-2 pb-4 space-y-3">
             <div className="relative w-full mb-4">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search comics..."
                className="w-full bg-background border border-surfaceHighlight text-textMain text-sm rounded-lg pl-10 pr-24 py-2 focus:outline-none focus:border-primary"
              />
              <Search className="absolute left-3 top-2.5 text-textMuted w-4 h-4" />
              <button 
                onClick={triggerAiSearch}
                className="absolute right-1 top-1 bottom-1 bg-primary text-white px-3 rounded-md text-xs font-bold flex items-center gap-1"
              >
                 <Sparkles size={12} /> AI
              </button>
            </div>
            
            <Link to="/" className="block text-textMuted hover:text-white font-medium py-2">Home</Link>
            
            {isAdmin ? (
              <>
                <Link to="/upload" className="block text-textMuted hover:text-white font-medium py-2 flex items-center gap-2"><UploadCloud size={16}/> Upload Series</Link>
                <Link to="/admin" className="block text-textMuted hover:text-white font-medium py-2 flex items-center gap-2 text-secondary"><Shield size={16}/> Admin Panel</Link>
                <button onClick={onLogout} className="w-full text-left text-textMuted hover:text-white font-medium py-2 flex items-center gap-2"><LogOut size={16}/> Logout</button>
              </>
            ) : (
              <Link to="/login" className="block text-textMuted hover:text-white font-medium py-2 flex items-center gap-2"><LogIn size={16}/> Staff Login</Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};