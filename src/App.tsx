import React, { useState, useEffect } from 'react';
import './App.css';
import { AudioProvider, useAudio } from './contexts/AudioContext';
import TrackControl from './components/TrackControl';
import CategorySelector from './components/CategorySelector';
import AddTrackForm from './components/AddTrackForm';
import EnvironmentManager from './components/EnvironmentManager';
import { AudioCategory } from './types/audio';
import MainControls from './components/MainControls';
import MixerSection from './components/MixerSection';

const AppContent: React.FC = () => {
  const {
    tracks,
    environments,
    activeEnvironment,
    addTrack,
    removeTrack,
    togglePlayTrack,
    setTrackVolume,
    saveEnvironment,
    loadEnvironment,
    deleteEnvironment,
    stopAllTracks,
    playAllTracks,
    toggleCategory,
  } = useAudio();

  const [selectedCategory, setSelectedCategory] = useState<AudioCategory | null>(null);
  const [shareVisible, setShareVisible] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  
  // Efeito de carregamento para animação de entrada
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const filteredTracks = selectedCategory
    ? tracks.filter((track) => track.category === selectedCategory)
    : tracks;

  return (
    <div className="min-h-screen bg-secondary-dark text-white fog-overlay">
      <div className="absolute inset-0 bg-gradient-radial from-secondary-dark to-secondary opacity-80 z-0"></div>
      
      <header className="relative z-10 bg-secondary-dark border-b border-accent/20 shadow-lg">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent to-accent-dark flex items-center justify-center mr-4 outer-glow">
                <span className="text-2xl text-secondary-dark">🎲</span>
              </div>
              <h1 className="text-4xl font-title font-bold text-white text-shadow-lg text-glow">RadioPG</h1>
            </div>
            <div className="flex items-center gap-3">
              <p className="text-gray-300 text-sm mr-4 font-body italic">Ambientação sonora para RPG narrativo</p>
              <button 
                onClick={() => saveEnvironment('Novo Ambiente')}
                className="btn-gold py-2 px-4 rounded-md flex items-center gap-2 text-sm animate-pulse"
              >
                <SaveIcon />
                Salvar Ambiente
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className={`container mx-auto px-6 py-10 relative z-10 ${isLoaded ? 'fade-in' : 'opacity-0'}`}>
        <MainControls 
          onPlayAll={playAllTracks}
          onStopAll={stopAllTracks}
          onShare={() => setShareVisible(!shareVisible)}
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">
          <div className="lg:col-span-2">
            <MixerSection title="Mixer de Áudio" icon="🎵" className="glass-panel rounded-lg overflow-hidden">
              <CategorySelector
                selectedCategory={selectedCategory}
                onSelectCategory={(category) => {
                  if (category === selectedCategory) {
                    setSelectedCategory(null);
                  } else {
                    setSelectedCategory(category);
                  }
                }}
                onToggleCategory={toggleCategory}
              />
              <div className="space-y-4 mt-6 inner-glow p-4 rounded-md bg-secondary/30">
                {filteredTracks.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="w-16 h-16 mb-4 opacity-30">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-full h-full">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                      </svg>
                    </div>
                    <p className="text-gray-400 font-body">
                      {selectedCategory
                        ? `Nenhuma faixa na categoria ${selectedCategory}`
                        : 'Nenhuma faixa disponível. Adicione uma nova faixa para começar.'}
                    </p>
                  </div>
                ) : (
                  filteredTracks.map((track, index) => (
                    <TrackControl
                      key={track.id}
                      track={track}
                      onTogglePlay={togglePlayTrack}
                      onVolumeChange={setTrackVolume}
                      onRemove={removeTrack}
                      className={`transition-all duration-300 delay-${index * 100}`}
                    />
                  ))
                )}
              </div>
            </MixerSection>

            <AddTrackForm onAddTrack={addTrack} className="mt-6 glass-panel rounded-lg overflow-hidden" />
            
            {shareVisible && (
              <MixerSection title="Compartilhar Ambiente" icon="🔗" className="mt-6 glass-panel rounded-lg overflow-hidden">
                <p className="mb-4 font-body text-gray-300">Compartilhe esta URL única com seus jogadores para sincronizar a experiência de áudio:</p>
                <div className="flex gap-2 mb-4">
                  <input 
                    id="share-url"
                    type="text" 
                    value={`https://radiopg.app/mix/${activeEnvironment?.id || 'atual'}`} 
                    readOnly
                    className="flex-1 p-3 bg-surface border border-primary/30 rounded-md text-gray-200 font-body focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                  <button 
                    onClick={() => {
                      const shareInput = document.getElementById('share-url') as HTMLInputElement;
                      shareInput.select();
                      document.execCommand('copy');
                      // Substituir alert por uma notificação mais elegante
                      const notification = document.createElement('div');
                      notification.className = 'fixed bottom-4 right-4 bg-accent text-secondary-dark py-2 px-4 rounded-md shadow-lg fade-in';
                      notification.textContent = 'URL copiada para a área de transferência!';
                      document.body.appendChild(notification);
                      setTimeout(() => {
                        notification.style.opacity = '0';
                        notification.style.transition = 'opacity 0.5s';
                        setTimeout(() => notification.remove(), 500);
                      }, 2000);
                    }}
                    className="btn-fantasy py-2 px-4 rounded-md flex items-center gap-2"
                  >
                    <CopyIcon />
                    Copiar
                  </button>
                </div>
              </MixerSection>
            )}
          </div>

          <div>
            <MixerSection title="Ambientes Salvos" icon="📚" className="glass-panel rounded-lg overflow-hidden">
              <EnvironmentManager
                environments={environments}
                activeEnvironment={activeEnvironment}
                onSave={saveEnvironment}
                onLoad={loadEnvironment}
                onDelete={deleteEnvironment}
              />
            </MixerSection>

            <MixerSection title="Como Usar" icon="📖" className="mt-6 glass-panel rounded-lg overflow-hidden">
              <div className="text-gray-300 space-y-4 font-body">
                <div className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-primary/30 flex items-center justify-center mr-3 text-accent font-title">1</div>
                  <p>
                    Adicione faixas de áudio usando o formulário abaixo.
                  </p>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-primary/30 flex items-center justify-center mr-3 text-accent font-title">2</div>
                  <p>
                    Reproduza múltiplas faixas simultaneamente para criar ambientes sonoros únicos.
                  </p>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-primary/30 flex items-center justify-center mr-3 text-accent font-title">3</div>
                  <p>
                    Ajuste o volume de cada faixa para equilibrar o ambiente.
                  </p>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-primary/30 flex items-center justify-center mr-3 text-accent font-title">4</div>
                  <p>
                    Salve suas combinações como ambientes para uso futuro.
                  </p>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-primary/30 flex items-center justify-center mr-3 text-accent font-title">5</div>
                  <p>
                    Filtre faixas por categoria para encontrar rapidamente o que precisa.
                  </p>
                </div>
              </div>
            </MixerSection>
            
            <MixerSection title="Sobre o Web Audio API" icon="🔊" className="mt-6 glass-panel rounded-lg overflow-hidden">
              <div className="text-gray-300 font-body">
                <div className="p-4 bg-surface/50 rounded-md border border-primary/20 inner-glow">
                  <p className="mb-3">
                    Este aplicativo utiliza a Web Audio API para gerar sons diretamente no navegador quando não há arquivos de áudio disponíveis.
                  </p>
                  <p>
                    Cada categoria tem uma frequência base diferente, criando uma experiência sonora única para cada tipo de ambiente narrativo.
                  </p>
                </div>
              </div>
            </MixerSection>
          </div>
        </div>
      </main>

      <footer className="relative z-10 border-t border-accent/10 mt-16 backdrop-blur-sm bg-secondary-dark/70">
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent/30 to-accent-dark/30 flex items-center justify-center mb-3">
              <span className="text-xl">🎲</span>
            </div>
            <p className="text-center text-gray-400 font-body text-sm mb-2">
              RadioPG © {new Date().getFullYear()} - Ambientação sonora para RPG narrativo
            </p>
            <div className="flex space-x-4 text-accent/50 text-xs">
              <button className="hover:text-accent transition-colors">Sobre</button>
              <button className="hover:text-accent transition-colors">Contato</button>
              <button className="hover:text-accent transition-colors">Termos</button>
              <button className="hover:text-accent transition-colors">Privacidade</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

function App() {
  return (
    <AudioProvider>
      <AppContent />
    </AudioProvider>
  );
}

// Ícones para a interface
function SaveIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" className="fill-none stroke-current stroke-2">
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" strokeLinecap="round" strokeLinejoin="round"/>
      <polyline points="17 21 17 13 7 13 7 21" strokeLinecap="round" strokeLinejoin="round"/>
      <polyline points="7 3 7 8 15 8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" className="fill-none stroke-current stroke-2">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export default App;
