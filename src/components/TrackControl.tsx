import React from 'react';
import { AudioTrack } from '../types/audio';

interface TrackControlProps {
  track: AudioTrack;
  onTogglePlay: (id: string) => void;
  onVolumeChange: (id: string, volume: number) => void;
  onRemove: (id: string) => void;
}

const TrackControl: React.FC<TrackControlProps> = ({
  track,
  onTogglePlay,
  onVolumeChange,
  onRemove,
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
        return 'bg-purple-700';
      case 'wilderness':
        return 'bg-green-700';
      case 'combat':
        return 'bg-red-700';
      case 'social':
        return 'bg-yellow-700';
      default:
        return 'bg-blue-700';
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onVolumeChange(track.id, parseFloat(e.target.value));
  };

  return (
    <div className={`p-4 rounded-lg mb-3 ${getCategoryColor(track.category)} transition-all ${track.isPlaying ? 'opacity-100' : 'opacity-70'}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <span className="text-2xl mr-3">{getCategoryIcon(track.category)}</span>
          <div>
            <h3 className="font-medieval text-lg font-bold text-white">{track.title}</h3>
            <p className="text-xs text-gray-200 capitalize">{track.category}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onTogglePlay(track.id)}
            className="w-10 h-10 rounded-full bg-white bg-opacity-20 flex items-center justify-center hover:bg-opacity-30 transition-all"
            aria-label={track.isPlaying ? 'Pausar' : 'Reproduzir'}
          >
            {track.isPlaying ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
            )}
          </button>
          <button
            onClick={() => onRemove(track.id)}
            className="w-8 h-8 rounded-full bg-white bg-opacity-10 flex items-center justify-center hover:bg-opacity-20 transition-all"
            aria-label="Remover"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
      <div className="mt-3">
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={track.volume}
          onChange={handleVolumeChange}
          className="slider"
          disabled={!track.isPlaying}
        />
      </div>
    </div>
  );
};

export default TrackControl;
