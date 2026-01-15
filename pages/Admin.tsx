import React, { useState } from 'react';
import { Comic } from '../types';
import { Search, Edit, Trash2, Plus, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

interface AdminProps {
  comics: Comic[];
  onDelete: (id: string) => void;
}

export const Admin: React.FC<AdminProps> = ({ comics, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredComics = comics.filter(c => 
    c.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-textMain">Admin Dashboard</h1>
          <p className="text-sm text-textMuted">Manage your comic library, chapters, and metadata.</p>
        </div>
        <Link 
          to="/upload" 
          className="bg-primary hover:bg-primaryHover text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 shadow-lg shadow-primary/20 transition-all"
        >
          <Plus size={18} /> Add New Series
        </Link>
      </div>

      <div className="bg-surfaceHighlight rounded-xl border border-surface overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-surface">
           <div className="relative max-w-md">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search library..."
                className="w-full bg-background border border-surface rounded-lg pl-10 pr-4 py-2 text-sm text-textMain focus:border-primary focus:outline-none"
              />
              <Search className="absolute left-3 top-2.5 text-textMuted w-4 h-4" />
           </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface text-textMuted text-xs uppercase tracking-wider">
                <th className="p-4 font-semibold">Cover</th>
                <th className="p-4 font-semibold">Title</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold">Chapters</th>
                <th className="p-4 font-semibold">Rating</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface">
              {filteredComics.length === 0 ? (
                 <tr>
                   <td colSpan={6} className="p-8 text-center text-textMuted">
                     No comics found.
                   </td>
                 </tr>
              ) : (
                filteredComics.map((comic) => (
                  <tr key={comic.id} className="hover:bg-surface/50 transition-colors group">
                    <td className="p-4 w-16">
                      <div className="w-10 h-14 rounded overflow-hidden bg-surface">
                         <img src={comic.coverUrl} alt="" className="w-full h-full object-cover" />
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="font-medium text-textMain">{comic.title}</div>
                      <div className="text-xs text-textMuted">{comic.type} • {comic.author}</div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase
                        ${comic.status === 'Ongoing' ? 'bg-blue-500/10 text-blue-400' : ''}
                        ${comic.status === 'Completed' ? 'bg-green-500/10 text-green-400' : ''}
                        ${comic.status === 'Hiatus' ? 'bg-yellow-500/10 text-yellow-400' : ''}
                      `}>
                        {comic.status}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-textMuted">
                      {comic.chapters.length}
                    </td>
                    <td className="p-4 text-sm text-yellow-500 font-medium">
                      ★ {comic.rating}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link 
                          to={`/admin/edit/${comic.id}`}
                          className="p-2 bg-surface hover:bg-white/10 rounded text-textMain transition-colors"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </Link>
                        <button 
                          onClick={() => onDelete(comic.id)}
                          className="p-2 bg-surface hover:bg-secondary/20 hover:text-secondary rounded text-textMuted transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};