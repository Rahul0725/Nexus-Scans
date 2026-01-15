import React, { useState, useRef, useEffect } from 'react';
import { UploadCloud, Image as ImageIcon, X, Save, Trash2, Plus, GripVertical } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Comic, Chapter } from '../types';

interface UploadProps {
  onUpload: (comic: Comic) => void;
  initialData?: Comic;
  isEdit?: boolean;
}

const GENRES_LIST = [
  'Action', 'Adventure', 'Fantasy', 'Romance', 'Comedy', 
  'Slice of Life', 'Drama', 'Thriller', 'Horror', 'Mystery',
  'Sci-Fi', 'Isekai', 'Martial Arts', 'System', 'Regression'
];

export const Upload: React.FC<UploadProps> = ({ onUpload, initialData, isEdit = false }) => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    author: '',
    artist: '',
    type: 'Manhwa' as Comic['type'],
    status: 'Ongoing' as Comic['status'],
    coverUrl: '',
    genres: [] as string[],
    rating: 0
  });

  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [newChapterNum, setNewChapterNum] = useState('');
  
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [dragActive, setDragActive] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        description: initialData.description,
        author: initialData.author,
        artist: initialData.artist,
        type: initialData.type,
        status: initialData.status,
        coverUrl: initialData.coverUrl,
        genres: initialData.genres,
        rating: initialData.rating
      });
      setPreviewUrl(initialData.coverUrl);
      setChapters(initialData.chapters);
    } else {
      // Default fake chapters only for new upload
      setChapters(Array.from({ length: 3 }, (_, i) => ({
        id: `new-${Date.now()}-${3-i}`,
        number: `${3-i}`,
        title: `Chapter ${3-i}`,
        releaseDate: new Date().toISOString().split('T')[0]
      })));
    }
  }, [initialData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const toggleGenre = (genre: string) => {
    setFormData(prev => {
      const genres = prev.genres.includes(genre)
        ? prev.genres.filter(g => g !== genre)
        : [...prev.genres, genre];
      return { ...prev, genres };
    });
  };

  const handleFile = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreviewUrl(result);
        setFormData(prev => ({ ...prev, coverUrl: result }));
        if (errors.coverUrl) setErrors(prev => ({ ...prev, coverUrl: '' }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const addChapter = () => {
    if (!newChapterNum) return;
    const newCh: Chapter = {
      id: `ch-${Date.now()}`,
      number: newChapterNum,
      title: `Chapter ${newChapterNum}`,
      releaseDate: new Date().toISOString().split('T')[0]
    };
    setChapters(prev => [newCh, ...prev].sort((a, b) => parseFloat(b.number) - parseFloat(a.number)));
    setNewChapterNum('');
  };

  const removeChapter = (id: string) => {
    setChapters(prev => prev.filter(c => c.id !== id));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.title) newErrors.title = "Title is required";
    if (!formData.description) newErrors.description = "Description is required";
    if (!formData.coverUrl) newErrors.coverUrl = "Cover image is required";
    if (formData.genres.length === 0) newErrors.genres = "Select at least one genre";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const comicData: Comic = {
      id: initialData?.id || `upload-${Date.now()}`,
      title: formData.title,
      slug: initialData?.slug || formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
      description: formData.description,
      coverUrl: formData.coverUrl,
      rating: formData.rating,
      status: formData.status,
      type: formData.type,
      author: formData.author || 'Unknown',
      artist: formData.artist || 'Unknown',
      genres: formData.genres,
      chapters: chapters,
      isNew: isEdit ? initialData?.isNew : true,
      isHot: initialData?.isHot || false
    };

    onUpload(comicData);
    navigate(isEdit ? '/admin' : '/');
  };

  return (
    <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-surfaceHighlight rounded-xl overflow-hidden shadow-2xl border border-surface">
        <div className="p-6 border-b border-surface flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-textMain flex items-center gap-2">
              {isEdit ? <Save className="text-primary" /> : <UploadCloud className="text-primary" />}
              {isEdit ? 'Edit Series' : 'Upload New Series'}
            </h1>
            <p className="text-textMuted text-sm mt-1">
              {isEdit ? 'Update comic details and manage chapters.' : 'Submit a new comic to the Nexus Scans library.'}
            </p>
          </div>
          {isEdit && (
            <button onClick={() => navigate('/admin')} className="text-textMuted hover:text-white transition-colors">
              <X size={24} />
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="p-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Left Column - Image Upload */}
          <div className="md:col-span-1 space-y-4">
             <label className="block text-sm font-bold text-textMain mb-2">Cover Art</label>
             <div 
               className={`aspect-[2/3] rounded-lg border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden relative group
                 ${dragActive ? 'border-primary bg-primary/10' : 'border-surface bg-background hover:border-textMuted'}
                 ${errors.coverUrl ? 'border-secondary' : ''}
               `}
               onDragEnter={() => setDragActive(true)}
               onDragLeave={() => setDragActive(false)}
               onDragOver={(e) => e.preventDefault()}
               onDrop={handleDrop}
               onClick={() => fileInputRef.current?.click()}
             >
                {previewUrl ? (
                  <>
                    <img src={previewUrl} alt="Cover preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <span className="text-white text-xs font-bold">Change Image</span>
                    </div>
                  </>
                ) : (
                  <div className="text-center p-4">
                     <ImageIcon size={48} className="mx-auto mb-2 text-textMuted" />
                     <span className="text-xs text-textMuted block">Click or Drag Image</span>
                     <span className="text-[10px] text-textMuted/60 block mt-1">(Max 2MB)</span>
                  </div>
                )}
             </div>
             {errors.coverUrl && <p className="text-secondary text-xs">{errors.coverUrl}</p>}
             <input 
               type="file" 
               ref={fileInputRef} 
               className="hidden" 
               accept="image/*" 
               onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
             />
          </div>

          {/* Right Column - Details */}
          <div className="md:col-span-2 space-y-6">
             {/* Basic Info */}
             <div className="bg-background/50 p-4 rounded-lg border border-surface space-y-4">
               <h3 className="text-sm font-bold text-textMain uppercase tracking-wider border-b border-surface pb-2">Information</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="space-y-1">
                   <label className="text-xs font-bold text-textMuted uppercase">Title</label>
                   <input 
                     name="title" 
                     value={formData.title} 
                     onChange={handleInputChange} 
                     className={`w-full bg-surface border ${errors.title ? 'border-secondary' : 'border-surfaceHighlight'} rounded p-2 text-sm text-textMain focus:border-primary focus:outline-none`}
                     placeholder="e.g. Solo Leveling"
                   />
                   {errors.title && <p className="text-secondary text-xs">{errors.title}</p>}
                 </div>
                 
                 <div className="space-y-1">
                   <label className="text-xs font-bold text-textMuted uppercase">Type</label>
                   <select 
                      name="type" 
                      value={formData.type} 
                      onChange={handleInputChange}
                      className="w-full bg-surface border border-surfaceHighlight rounded p-2 text-sm text-textMain focus:border-primary focus:outline-none"
                   >
                     <option value="Manhwa">Manhwa (Korea)</option>
                     <option value="Manga">Manga (Japan)</option>
                     <option value="Manhua">Manhua (China)</option>
                   </select>
                 </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="space-y-1">
                   <label className="text-xs font-bold text-textMuted uppercase">Author</label>
                   <input 
                     name="author" 
                     value={formData.author} 
                     onChange={handleInputChange}
                     className="w-full bg-surface border border-surfaceHighlight rounded p-2 text-sm text-textMain focus:border-primary focus:outline-none"
                     placeholder="Author Name"
                   />
                 </div>
                 
                 <div className="space-y-1">
                   <label className="text-xs font-bold text-textMuted uppercase">Artist</label>
                   <input 
                     name="artist" 
                     value={formData.artist} 
                     onChange={handleInputChange}
                     className="w-full bg-surface border border-surfaceHighlight rounded p-2 text-sm text-textMain focus:border-primary focus:outline-none"
                     placeholder="Artist Name"
                   />
                 </div>
               </div>
               
               <div className="space-y-1">
                 <label className="text-xs font-bold text-textMuted uppercase">Description</label>
                 <textarea 
                   name="description" 
                   value={formData.description} 
                   onChange={handleInputChange}
                   rows={3}
                   className={`w-full bg-surface border ${errors.description ? 'border-secondary' : 'border-surfaceHighlight'} rounded p-2 text-sm text-textMain focus:border-primary focus:outline-none resize-none`}
                   placeholder="Enter a brief synopsis..."
                 />
                 {errors.description && <p className="text-secondary text-xs">{errors.description}</p>}
               </div>
                
               <div className="space-y-2">
                 <label className="text-xs font-bold text-textMuted uppercase flex justify-between">
                   <span>Genres</span>
                   {errors.genres && <span className="text-secondary normal-case">{errors.genres}</span>}
                 </label>
                 <div className="flex flex-wrap gap-2">
                   {GENRES_LIST.map(genre => (
                     <button
                       key={genre}
                       type="button"
                       onClick={() => toggleGenre(genre)}
                       className={`px-3 py-1 rounded-full text-xs font-medium transition-colors border ${
                         formData.genres.includes(genre) 
                           ? 'bg-primary border-primary text-white' 
                           : 'bg-surface border-surfaceHighlight text-textMuted hover:border-textMuted'
                       }`}
                     >
                       {genre}
                     </button>
                   ))}
                 </div>
               </div>
             </div>

             {/* Chapter Manager */}
             <div className="bg-background/50 p-4 rounded-lg border border-surface space-y-4">
                <div className="flex items-center justify-between border-b border-surface pb-2">
                  <h3 className="text-sm font-bold text-textMain uppercase tracking-wider">Chapters</h3>
                  <div className="flex gap-2">
                    <input 
                      type="number" 
                      value={newChapterNum}
                      onChange={(e) => setNewChapterNum(e.target.value)}
                      placeholder="#"
                      className="w-16 bg-surface border border-surfaceHighlight rounded p-1 text-sm text-center text-textMain focus:border-primary focus:outline-none"
                    />
                    <button 
                      type="button"
                      onClick={addChapter}
                      className="bg-primary hover:bg-primaryHover text-white px-3 py-1 rounded text-xs font-bold flex items-center gap-1"
                    >
                      <Plus size={14} /> Add
                    </button>
                  </div>
                </div>
                
                <div className="max-h-60 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
                  {chapters.length === 0 && <p className="text-xs text-textMuted text-center py-4">No chapters added yet.</p>}
                  {chapters.map((ch) => (
                    <div key={ch.id} className="flex items-center justify-between bg-surface p-2 rounded group">
                       <div className="flex items-center gap-3">
                         <GripVertical size={14} className="text-textMuted cursor-grab" />
                         <span className="text-sm font-medium text-textMain">Chapter {ch.number}</span>
                       </div>
                       <div className="flex items-center gap-4">
                          <span className="text-xs text-textMuted">{ch.releaseDate}</span>
                          <button 
                            type="button" 
                            onClick={() => removeChapter(ch.id)}
                            className="text-textMuted hover:text-secondary transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                       </div>
                    </div>
                  ))}
                </div>
             </div>

             <div className="pt-4 flex items-center justify-end gap-4">
               <button 
                 type="button" 
                 onClick={() => navigate(isEdit ? '/admin' : '/')}
                 className="px-4 py-2 rounded text-textMuted hover:text-white text-sm font-medium transition-colors"
               >
                 Cancel
               </button>
               <button 
                 type="submit"
                 className="bg-primary hover:bg-primaryHover text-white px-6 py-2 rounded font-bold text-sm shadow-lg shadow-primary/20 flex items-center gap-2 transition-transform active:scale-95"
               >
                 {isEdit ? <Save size={16} /> : <UploadCloud size={16} />}
                 {isEdit ? 'Save Changes' : 'Upload Series'}
               </button>
             </div>

          </div>
        </form>
      </div>
    </div>
  );
};