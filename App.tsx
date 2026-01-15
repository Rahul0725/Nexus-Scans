import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, useLocation, useParams, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { ComicDetail } from './pages/ComicDetail';
import { Reader } from './pages/Reader';
import { Upload } from './pages/Upload';
import { Admin } from './pages/Admin';
import { Login } from './pages/Login';
import { MOCK_COMICS, POPULAR_TODAY } from './constants';
import { getAiRecommendations } from './services/geminiService';
import { Comic } from './types';

// ScrollToTop component to fix router scroll behavior
const ScrollToTop = () => {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Protected Route Component
const ProtectedRoute = ({ children, isAdmin }: { children: React.ReactNode, isAdmin: boolean }) => {
  if (!isAdmin) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

// Wrapper for editing to find the comic by ID
const EditComicWrapper: React.FC<{ comics: Comic[], onUpdate: (c: Comic) => void }> = ({ comics, onUpdate }) => {
  const { id } = useParams<{ id: string }>();
  const comic = comics.find(c => c.id === id);
  
  if (!comic) return <div className="p-20 text-center text-textMuted">Comic not found.</div>;
  
  return <Upload onUpload={onUpdate} initialData={comic} isEdit={true} />;
};

const Layout: React.FC = () => {
  const [comics, setComics] = useState<Comic[]>(MOCK_COMICS);
  const [aiComics, setAiComics] = useState<Comic[] | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const location = useLocation();
  const isReader = location.pathname.startsWith('/read/');

  const handleAiSearch = async (query: string) => {
    setIsAiLoading(true);
    try {
      const results = await getAiRecommendations(query);
      setAiComics(results);
    } catch (e) {
      console.error(e);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleCreate = (newComic: Comic) => {
    setComics(prev => [newComic, ...prev]);
  };

  const handleUpdate = (updatedComic: Comic) => {
    setComics(prev => prev.map(c => c.id === updatedComic.id ? updatedComic : c));
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this comic? This action cannot be undone.')) {
      setComics(prev => prev.filter(c => c.id !== id));
    }
  };

  // Derived state for popular comics to include new uploads if they are marked hot
  const displayPopular = [...comics.filter(c => c.isHot || c.isNew).slice(0, 8)];

  return (
    <div className={`min-h-screen flex flex-col font-sans text-textMain selection:bg-primary selection:text-white ${isReader ? 'bg-black' : 'bg-background'}`}>
      {!isReader && <Navbar onAiSearch={handleAiSearch} isAiLoading={isAiLoading} isAdmin={isAdmin} onLogout={() => setIsAdmin(false)} />}
      
      <main className={isReader ? "w-full flex-grow" : "flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8"}>
        <Routes>
          <Route 
            path="/" 
            element={<Home comics={comics} popular={displayPopular} aiResults={aiComics} />} 
          />
          <Route 
            path="/login" 
            element={<Login onLogin={setIsAdmin} />} 
          />
          <Route 
            path="/upload" 
            element={
              <ProtectedRoute isAdmin={isAdmin}>
                <Upload onUpload={handleCreate} />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute isAdmin={isAdmin}>
                <Admin comics={comics} onDelete={handleDelete} />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/edit/:id" 
            element={
              <ProtectedRoute isAdmin={isAdmin}>
                <EditComicWrapper comics={comics} onUpdate={handleUpdate} />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/comic/:id" 
            element={<ComicDetail comics={comics} aiResults={aiComics} />} 
          />
          <Route 
            path="/read/:id/:chapter" 
            element={<Reader comics={comics} aiResults={aiComics} />} 
          />
        </Routes>
      </main>
      
      {!isReader && <Footer />}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <ScrollToTop />
      <Layout />
    </HashRouter>
  );
};

export default App;