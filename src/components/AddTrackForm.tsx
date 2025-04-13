import React, { useState } from 'react';
import { AudioCategory } from '../types/audio';

interface AddTrackFormProps {
  onAddTrack: (track: { title: string; category: AudioCategory; src: string }) => void;
  className?: string;
}

const AddTrackForm: React.FC<AddTrackFormProps> = ({ onAddTrack, className = '' }) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<AudioCategory>('mystery');
  const [src, setSrc] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && src.trim()) {
      onAddTrack({
        title: title.trim(),
        category,
        src: src.trim(),
      });
      resetForm();
    }
  };

  const resetForm = () => {
    setTitle('');
    setCategory('mystery');
    setSrc('');
    setIsOpen(false);
  };

  return (
    <div className={`mb-6 ${className}`}>
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="w-full py-4 rounded-lg btn-fantasy flex items-center justify-center font-title text-shadow-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="16" />
            <line x1="8" y1="12" x2="16" y2="12" />
          </svg>
          Adicionar Nova Faixa
        </button>
      ) : (
        <div className="bg-surface rounded-lg p-6 border border-accent/10 shadow-lg inner-glow">
          <div className="flex justify-between items-center mb-6 border-b border-accent/20 pb-3">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center mr-3 text-accent">
                <span>🎵</span>
              </div>
              <h2 className="font-title text-xl text-white text-shadow-sm">Nova Faixa</h2>
            </div>
            <button
              onClick={resetForm}
              className="w-8 h-8 rounded-full bg-surface-dark hover:bg-surface flex items-center justify-center transition-all"
              aria-label="Fechar"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
          <form onSubmit={handleSubmit} className="font-body">
            <div className="mb-5">
              <label htmlFor="title" className="block text-sm font-medium text-gray-200 mb-2">
                Título da Faixa
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 bg-surface-dark border border-primary/20 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/30"
                placeholder="Ex: Sussurros da Floresta Sombria"
                required
              />
            </div>
            <div className="mb-5">
              <label htmlFor="category" className="block text-sm font-medium text-gray-200 mb-2">
                Categoria Sonora
              </label>
              <div className="relative">
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as AudioCategory)}
                  className="w-full px-4 py-3 bg-surface-dark border border-primary/20 rounded-md text-white appearance-none focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/30"
                  required
                >
                  <option value="mystery">Mistério & Suspense</option>
                  <option value="wilderness">Natureza & Ambientes</option>
                  <option value="combat">Combate & Ação</option>
                  <option value="social">Social & Interação</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-accent">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="mb-5">
              <label htmlFor="src" className="block text-sm font-medium text-gray-200 mb-2">
                URL do Áudio
              </label>
              <input
                type="text"
                id="src"
                value={src}
                onChange={(e) => setSrc(e.target.value)}
                className="w-full px-4 py-3 bg-surface-dark border border-primary/20 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/30"
                placeholder="https://exemplo.com/audio.mp3"
                required
              />
              <p className="mt-2 text-xs text-gray-400 italic">
                Insira uma URL válida para um arquivo de áudio (MP3, WAV, OGG) ou deixe em branco para gerar um som sintético
              </p>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={resetForm}
                className="px-5 py-2 rounded-md bg-surface hover:bg-surface-light transition-all text-gray-300 border border-gray-700"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="btn-gold px-5 py-2 rounded-md flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" />
                  <polyline points="17 21 17 13 7 13 7 21" />
                  <polyline points="7 3 7 8 15 8" />
                </svg>
                Adicionar Faixa
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AddTrackForm;
