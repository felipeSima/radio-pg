import React from 'react';
import { AudioTrack } from '../types/audio';

interface TrackControlProps {
  track: AudioTrack;
  onTogglePlay: (id: string) => void;
  onVolumeChange: (id: string, volume: number) => void;
  onRemove: (id: string) => void;
  className?: string;
}

const TrackControl: React.FC<TrackControlProps> = ({
  track,
  onTogglePlay,
  onVolumeChange,
  onRemove,
  className = '',
}) => {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'mystery':
        return '🔮';
      case 'wilderness':
        return '🌲';
      case 'combat':
        return '⚔️';
      case 'social':
        return '🍻';
      default:
        return '🎵';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'mystery':
        return 'from-primary to-primary-dark border-primary/30';
      case 'wilderness':
        return 'from-emerald to-emerald-dark border-emerald/30';
      case 'combat':
        return 'from-red-700 to-red-900 border-red-700/30';
      case 'social':
        return 'from-accent to-accent-dark border-accent/30';
      default:
        return 'from-blue-700 to-blue-900 border-blue-700/30';
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onVolumeChange(track.id, parseFloat(e.target.value));
  };

  return (
    <div className={`p-5 rounded-lg mb-4 bg-gradient-to-br ${getCategoryColor(track.category)} border border-opacity-10 shadow-lg backdrop-blur-xs transition-all duration-300 ${track.isPlaying ? 'opacity-100 shadow-lg' : 'opacity-80'} ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-black bg-opacity-20 flex items-center justify-center mr-3 shadow-inner text-xl">
            {getCategoryIcon(track.category)}
          </div>
          <div>
            <h3 className="font-title text-lg font-semibold text-white text-shadow-sm">{track.title}</h3>
            <p className="text-xs text-gray-200 capitalize font-body">{track.category}</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => onTogglePlay(track.id)}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${track.isPlaying ? 'bg-black bg-opacity-30 outer-glow' : 'bg-black bg-opacity-20 hover:bg-opacity-30'}`}
            aria-label={track.isPlaying ? 'Pausar' : 'Reproduzir'}
          >
            {track.isPlaying ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="10" y1="15" x2="10" y2="9" />
                <line x1="14" y1="15" x2="14" y2="9" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polygon points="10 8 16 12 10 16 10 8" />
              </svg>
            )}
          </button>
          <button
            onClick={() => onRemove(track.id)}
            className="w-9 h-9 rounded-full bg-black bg-opacity-20 flex items-center justify-center hover:bg-opacity-40 transition-all hover:text-red-400"
            aria-label="Remover"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 6h18" />
              <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
              <path d="M10 11v6" />
              <path d="M14 11v6" />
            </svg>
          </button>
        </div>
      </div>
      <div className="mt-4 px-2">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-gray-300 font-body">Volume</span>
          <span className="text-xs text-gray-300 font-body">{Math.round(track.volume * 100)}%</span>
        </div>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={track.volume}
          onChange={handleVolumeChange}
          className="slider w-full"
          disabled={!track.isPlaying}
        />
      </div>
    </div>
  );
};

export default TrackControl;
