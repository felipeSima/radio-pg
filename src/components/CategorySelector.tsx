import React from 'react';
import { AudioCategory } from '../types/audio';

interface CategorySelectorProps {
  selectedCategory: AudioCategory | null;
  onSelectCategory: (category: AudioCategory | null) => void;
  onToggleCategory: (category: AudioCategory) => void;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({
  selectedCategory,
  onSelectCategory,
  onToggleCategory,
}) => {
  const categories: { id: AudioCategory; name: string; icon: string; color: string }[] = [
    { id: 'mystery', name: 'Mistério', icon: '🔮', color: 'bg-purple-700 hover:bg-purple-600' },
    { id: 'wilderness', name: 'Natureza', icon: '🌲', color: 'bg-green-700 hover:bg-green-600' },
    { id: 'combat', name: 'Combate', icon: '⚔️', color: 'bg-red-700 hover:bg-red-600' },
    { id: 'social', name: 'Social', icon: '🍻', color: 'bg-yellow-700 hover:bg-yellow-600' },
  ];

  return (
    <div className="flex flex-wrap gap-3 mb-4">
      {categories.map((category) => (
        <div key={category.id} className="flex flex-col items-center">
          <button
            onClick={() => onSelectCategory(selectedCategory === category.id ? null : category.id)}
            className={`px-4 py-2 rounded-lg flex items-center transition-colors ${
              selectedCategory === category.id
                ? `${category.color} ring-2 ring-white`
                : `${category.color} opacity-70`
            }`}
          >
            <span className="mr-2 text-xl">{category.icon}</span>
            <span className="font-medieval">{category.name}</span>
          </button>
          <button
            onClick={() => onToggleCategory(category.id)}
            className="mt-1 px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-xs flex items-center justify-center"
            title={`Reproduzir/Pausar todas as faixas de ${category.name}`}
          >
            <PlayPauseIcon />
          </button>
        </div>
      ))}
    </div>
  );
};

function PlayPauseIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" className="fill-current">
      <path d="M18.54 9L8.88 3.46a3.42 3.42 0 0 0-5.13 3v12.08a3.42 3.42 0 0 0 5.13 3L18.54 15a3.42 3.42 0 0 0 0-6z" />
    </svg>
  );
}

export default CategorySelector;
