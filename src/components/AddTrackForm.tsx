import React, { useState } from 'react';
import { AudioCategory } from '../types/audio';

interface AddTrackFormProps {
  onAddTrack: (track: { title: string; category: AudioCategory; src: string }) => void;
}

const AddTrackForm: React.FC<AddTrackFormProps> = ({ onAddTrack }) => {
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
    <div className="mb-6">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="w-full py-3 rounded-lg bg-primary hover:bg-primary-dark transition-colors flex items-center justify-center font-medieval"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Adicionar Nova Faixa
        </button>
      ) : (
        <div className="bg-secondary rounded-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-medieval text-xl">Nova Faixa</h2>
            <button
              onClick={resetForm}
              className="text-gray-400 hover:text-white"
              aria-label="Fechar"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">
                Título
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Ex: Floresta Misteriosa"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-1">
                Categoria
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value as AudioCategory)}
                className="w-full px-3 py-2 bg-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
                required
              >
                <option value="mystery">Mistério</option>
                <option value="wilderness">Natureza</option>
                <option value="combat">Combate</option>
                <option value="social">Social</option>
              </select>
            </div>
            <div className="mb-4">
              <label htmlFor="src" className="block text-sm font-medium text-gray-300 mb-1">
                URL do Áudio
              </label>
              <input
                type="text"
                id="src"
                value={src}
                onChange={(e) => setSrc(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="https://exemplo.com/audio.mp3"
                required
              />
              <p className="mt-1 text-xs text-gray-400">
                Insira uma URL válida para um arquivo de áudio (MP3, WAV, OGG)
              </p>
            </div>
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-500 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="btn btn-accent"
              >
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
