import React from 'react';

interface MainControlsProps {
  onPlayAll: () => void;
  onStopAll: () => void;
  onShare: () => void;
}

const MainControls: React.FC<MainControlsProps> = ({ onPlayAll, onStopAll, onShare }) => {
  return (
    <div className="flex flex-wrap gap-4 mb-6">
      <button 
        onClick={onPlayAll}
        className="bg-accent hover:bg-accent-dark text-black font-medium py-2 px-4 rounded flex items-center gap-1"
      >
        <PlayIcon />
        Reproduzir Tudo
      </button>
      <button 
        onClick={onStopAll}
        className="bg-primary-dark hover:bg-primary text-white font-medium py-2 px-4 rounded flex items-center gap-1"
      >
        <StopIcon />
        Parar Tudo
      </button>
      <button 
        onClick={onShare}
        className="bg-primary-dark hover:bg-primary text-white font-medium py-2 px-4 rounded flex items-center gap-1"
      >
        <ShareIcon />
        Compartilhar
      </button>
    </div>
  );
};

// Ícones
function PlayIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" className="fill-current">
      <polygon points="5 3 19 12 5 21 5 3"/>
    </svg>
  );
}

function StopIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" className="fill-current">
      <rect x="4" y="4" width="16" height="16"/>
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" className="fill-none stroke-current stroke-2">
      <circle cx="18" cy="5" r="3"/>
      <circle cx="6" cy="12" r="3"/>
      <circle cx="18" cy="19" r="3"/>
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
    </svg>
  );
}

export default MainControls;
