import React, { useState } from 'react';
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

  const filteredTracks = selectedCategory
    ? tracks.filter((track) => track.category === selectedCategory)
    : tracks;

  return (
    <div className="min-h-screen bg-secondary-dark text-white">
      <header className="bg-secondary shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-3xl mr-3">🎲</span>
              <h1 className="text-3xl font-medieval font-bold text-white">RadioPG</h1>
            </div>
            <div className="flex items-center gap-2">
              <p className="text-gray-400 text-sm mr-4">Ambientação sonora para RPG</p>
              <button 
                onClick={() => saveEnvironment('Novo Ambiente')}
                className="bg-accent hover:bg-accent-dark text-black font-medium py-2 px-4 rounded flex items-center gap-1 text-sm"
              >
                <SaveIcon />
                Salvar Ambiente
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <MainControls 
          onPlayAll={playAllTracks}
          onStopAll={stopAllTracks}
          onShare={() => setShareVisible(!shareVisible)}
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <MixerSection title="Mixer de Áudio">
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
              <div className="space-y-3 mt-4">
                {filteredTracks.length === 0 ? (
                  <p className="text-gray-400 text-center py-8">
                    {selectedCategory
                      ? `Nenhuma faixa na categoria ${selectedCategory}`
                      : 'Nenhuma faixa disponível. Adicione uma nova faixa para começar.'}
                  </p>
                ) : (
                  filteredTracks.map((track) => (
                    <TrackControl
                      key={track.id}
                      track={track}
                      onTogglePlay={togglePlayTrack}
                      onVolumeChange={setTrackVolume}
                      onRemove={removeTrack}
                    />
                  ))
                )}
              </div>
            </MixerSection>

            <AddTrackForm onAddTrack={addTrack} />
            
            {shareVisible && (
              <MixerSection title="Compartilhar Ambiente">
                <p className="mb-4">Compartilhe esta URL única com seus jogadores para sincronizar a experiência de áudio:</p>
                <div className="flex gap-2 mb-4">
                  <input 
                    id="share-url"
                    type="text" 
                    value={`https://radiopg.app/mix/${activeEnvironment?.id || 'atual'}`} 
                    readOnly
                    className="flex-1 p-2 bg-gray-700 border border-primary rounded text-gray-200"
                  />
                  <button 
                    onClick={() => {
                      const shareInput = document.getElementById('share-url') as HTMLInputElement;
                      shareInput.select();
                      document.execCommand('copy');
                      alert('URL copiada para a área de transferência!');
                    }}
                    className="bg-primary hover:bg-primary-dark text-white font-medium py-2 px-4 rounded flex items-center gap-1"
                  >
                    <CopyIcon />
                    Copiar
                  </button>
                </div>
              </MixerSection>
            )}
          </div>

          <div>
            <MixerSection title="Ambientes Salvos">
              <EnvironmentManager
                environments={environments}
                activeEnvironment={activeEnvironment}
                onSave={saveEnvironment}
                onLoad={loadEnvironment}
                onDelete={deleteEnvironment}
              />
            </MixerSection>

            <MixerSection title="Como Usar" className="mt-6">
              <div className="text-gray-300 space-y-3 text-sm">
                <p>
                  <strong>1.</strong> Adicione faixas de áudio usando o formulário abaixo.
                </p>
                <p>
                  <strong>2.</strong> Reproduza múltiplas faixas simultaneamente para criar ambientes sonoros únicos.
                </p>
                <p>
                  <strong>3.</strong> Ajuste o volume de cada faixa para equilibrar o ambiente.
                </p>
                <p>
                  <strong>4.</strong> Salve suas combinações como ambientes para uso futuro.
                </p>
                <p>
                  <strong>5.</strong> Filtre faixas por categoria para encontrar rapidamente o que precisa.
                </p>
              </div>
            </MixerSection>
            
            <MixerSection title="Sobre o Web Audio API" className="mt-6">
              <div className="text-gray-300 text-sm">
                <p className="mb-2">
                  Este aplicativo utiliza a Web Audio API para gerar sons diretamente no navegador quando não há arquivos de áudio disponíveis.
                </p>
                <p>
                  Cada categoria tem uma frequência base diferente, criando uma experiência sonora única para cada tipo de ambiente.
                </p>
              </div>
            </MixerSection>
          </div>
        </div>
      </main>

      <footer className="bg-secondary-dark border-t border-gray-800 mt-12">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-gray-500 text-sm">
            RadioPG © {new Date().getFullYear()} - Ambientação sonora para RPG
          </p>
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
    <svg width="16" height="16" viewBox="0 0 24 24" className="fill-current">
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
      <polyline points="17 21 17 13 7 13 7 21"/>
      <polyline points="7 3 7 8 15 8"/>
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" className="fill-current">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
    </svg>
  );
}

export default App;
