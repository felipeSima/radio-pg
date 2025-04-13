import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { audioService } from '../services/AudioService';
import { AudioCategory, AudioTrack, Environment } from '../types/audio';

interface AudioContextType {
  tracks: AudioTrack[];
  environments: Environment[];
  activeEnvironment: Environment | null;
  addTrack: (track: Omit<AudioTrack, 'id' | 'isPlaying' | 'volume'>) => void;
  removeTrack: (id: string) => void;
  togglePlayTrack: (id: string) => void;
  setTrackVolume: (id: string, volume: number) => void;
  saveEnvironment: (name: string) => void;
  loadEnvironment: (id: string) => void;
  deleteEnvironment: (id: string) => void;
  stopAllTracks: () => void;
  playAllTracks: () => void;
  toggleCategory: (category: AudioCategory) => void;
  generateTrackId: (category: AudioCategory) => string;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

// Dados de exemplo para desenvolvimento
const sampleTracks: AudioTrack[] = [
  // Mystery tracks
  {
    id: 'mystery-1',
    title: 'Corredores Sombrios',
    category: 'mystery',
    src: '/audio/mystery-1.mp3',
    volume: 0.7,
    isPlaying: false,
  },
  {
    id: 'mystery-5',
    title: 'Passos na Escuridão',
    category: 'mystery',
    src: '/audio/mystery-5.mp3',
    volume: 0.6,
    isPlaying: false,
  },
  {
    id: 'mystery-2',
    title: 'Sussurros Antigos',
    category: 'mystery',
    src: '/audio/mystery-2.mp3',
    volume: 0.5,
    isPlaying: false,
  },
  {
    id: 'mystery-3',
    title: 'Templo Esquecido',
    category: 'mystery',
    src: '/audio/mystery-3.mp3',
    volume: 0.6,
    isPlaying: false,
  },
  {
    id: 'mystery-4',
    title: 'Silêncio Perturbador',
    category: 'mystery',
    src: '/audio/mystery-4.mp3',
    volume: 0.4,
    isPlaying: false,
  },
  
  // Wilderness tracks
  {
    id: 'wilderness-1',
    title: 'Floresta Misteriosa',
    category: 'wilderness',
    src: '/audio/wilderness-1.mp3',
    volume: 0.7,
    isPlaying: false,
  },
  {
    id: 'wilderness-2',
    title: 'Riacho Suave',
    category: 'wilderness',
    src: '/audio/wilderness-2.mp3',
    volume: 0.6,
    isPlaying: false,
  },
  {
    id: 'wilderness-3',
    title: 'Ventos da Montanha',
    category: 'wilderness',
    src: '/audio/wilderness-3.mp3',
    volume: 0.5,
    isPlaying: false,
  },
  {
    id: 'wilderness-4',
    title: 'Trovão Distante',
    category: 'wilderness',
    src: '/audio/wilderness-4.mp3',
    volume: 0.8,
    isPlaying: false,
  },
  
  // Combat tracks
  {
    id: 'combat-1',
    title: 'Batalha Épica',
    category: 'combat',
    src: '/audio/combat-1.mp3',
    volume: 0.8,
    isPlaying: false,
  },
  {
    id: 'combat-2',
    title: 'Tambores de Guerra',
    category: 'combat',
    src: '/audio/combat-2.mp3',
    volume: 0.7,
    isPlaying: false,
  },
  {
    id: 'combat-3',
    title: 'Confronto com Chefe',
    category: 'combat',
    src: '/audio/combat-3.mp3',
    volume: 0.9,
    isPlaying: false,
  },
  {
    id: 'combat-4',
    title: 'Investida Heroica',
    category: 'combat',
    src: '/audio/combat-4.mp3',
    volume: 0.6,
    isPlaying: false,
  },
  
  // Social tracks
  {
    id: 'social-1',
    title: 'Taverna Animada',
    category: 'social',
    src: '/audio/social-1.mp3',
    volume: 0.6,
    isPlaying: false,
  },
  {
    id: 'social-2',
    title: 'Corte Nobre',
    category: 'social',
    src: '/audio/social-2.mp3',
    volume: 0.5,
    isPlaying: false,
  },
  {
    id: 'social-3',
    title: 'Praça do Mercado',
    category: 'social',
    src: '/audio/social-3.mp3',
    volume: 0.7,
    isPlaying: false,
  },
  {
    id: 'social-4',
    title: 'Música de Festival',
    category: 'social',
    src: '/audio/social-4.mp3',
    volume: 0.8,
    isPlaying: false,
  },
];

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tracks, setTracks] = useState<AudioTrack[]>([]);
  const [environments, setEnvironments] = useState<Environment[]>([]);
  const [activeEnvironment, setActiveEnvironment] = useState<Environment | null>(null);
  const [audioElements, setAudioElements] = useState<Record<string, HTMLAudioElement>>({});
  const audioInitialized = useRef<boolean>(false);

  // Carregar ambientes salvos do localStorage
  useEffect(() => {
    const savedEnvironments = localStorage.getItem('rpg-radio-environments');
    if (savedEnvironments) {
      setEnvironments(JSON.parse(savedEnvironments));
    }
    
    // Para desenvolvimento, carregamos alguns tracks de exemplo
    setTracks(sampleTracks);
  }, []);

  // Salvar ambientes no localStorage quando houver alterações
  useEffect(() => {
    if (environments.length > 0) {
      localStorage.setItem('rpg-radio-environments', JSON.stringify(environments));
    }
  }, [environments]);

  // Inicializar o serviço de áudio na primeira interação do usuário
  const initAudioService = useCallback(() => {
    try {
      audioService.initAudio();
      audioInitialized.current = true;
    } catch (error) {
      console.error('Erro ao inicializar serviço de áudio:', error);
    }
  }, []);

  // Gerenciar elementos de áudio
  useEffect(() => {
    console.log('Tracks atualizados:', tracks);
    console.log('Tracks em reprodução:', tracks.filter(t => t.isPlaying));
    
    // Criar um mapa de IDs de faixas em reprodução para rastreamento
    const playingTrackIds = new Set(tracks.filter(t => t.isPlaying).map(t => t.id));
    console.log('IDs de faixas em reprodução:', Array.from(playingTrackIds));
    
    // Parar faixas que não estão mais em reprodução
    Object.entries(audioElements).forEach(([id, audio]) => {
      if (!playingTrackIds.has(id)) {
        console.log(`Parando áudio: ${id}`);
        audio.pause();
      }
    });
    
    // Atualizar ou criar elementos de áudio para faixas em reprodução
    const updatedElements: Record<string, HTMLAudioElement> = {};
    
    const processAudioTracks = async () => {
      for (const track of tracks) {
        if (track.isPlaying) {
          if (track.src && (track.src.startsWith('/audio/') || track.src.startsWith('./audio/'))) {
            console.log(`Processando faixa de áudio: ${track.id}, src: ${track.src}`);
            
            // Verificar se já temos um elemento de áudio para esta faixa
            const existingAudio = audioElements[track.id];
            
            if (existingAudio) {
              console.log(`Usando elemento de áudio existente para: ${track.id}`);
              // Atualizar volume
              existingAudio.volume = track.volume;
              
              // Garantir que está reproduzindo
              if (existingAudio.paused) {
                try {
                  await existingAudio.play();
                  console.log(`Áudio reproduzido com sucesso: ${track.id}`);
                } catch (error) {
                  console.error(`Erro ao reproduzir áudio ${track.id}:`, error);
                }
              }
              
              updatedElements[track.id] = existingAudio;
            } else {
              console.log(`Criando novo elemento de áudio para: ${track.id}`);
              try {
                // Criar novo elemento de áudio
                const audio = new Audio();
                audio.src = track.src;
                audio.loop = true;
                audio.volume = track.volume;
                
                // Adicionar event listeners para depuração
                audio.addEventListener('canplay', () => {
                  console.log(`Áudio pronto para reproduzir: ${track.id}`);
                });
                
                audio.addEventListener('playing', () => {
                  console.log(`Áudio reproduzindo: ${track.id}`);
                });
                
                audio.addEventListener('error', (e) => {
                  console.error(`Erro no elemento de áudio ${track.id}:`, e);
                });
                
                // Tentar reproduzir o áudio
                await audio.play();
                console.log(`Novo áudio iniciado: ${track.id}`);
                updatedElements[track.id] = audio;
              } catch (error) {
                console.error(`Erro ao criar/reproduzir áudio ${track.id}:`, error);
              }
            }
          } else {
            console.log(`Usando Web Audio API para: ${track.id}`);
            // Usar Web Audio API para sons gerados
            try {
              initAudioService();
              audioService.playTrack(track.id);
              audioService.setTrackVolume(track.id, track.volume);
            } catch (error) {
              console.error(`Erro ao usar Web Audio API para ${track.id}:`, error);
            }
          }
        } else if (!track.isPlaying && audioElements[track.id]) {
          console.log(`Faixa não está em reprodução, pausando: ${track.id}`);
          audioElements[track.id].pause();
        }
      }
    };
    
    // Executar o processamento de áudio
    processAudioTracks().catch(error => {
      console.error('Erro ao processar faixas de áudio:', error);
    });
    
    // Atualizar o estado apenas se houver mudanças
    if (Object.keys(updatedElements).length > 0) {
      console.log('Atualizando elementos de áudio:', updatedElements);
      setAudioElements(prev => {
        // Manter apenas os elementos que ainda estão em reprodução
        const newElements = { ...updatedElements };
        
        // Adicionar elementos existentes que não foram atualizados
        Object.entries(prev).forEach(([id, audio]) => {
          if (!newElements[id] && playingTrackIds.has(id)) {
            newElements[id] = audio;
          }
        });
        
        return newElements;
      });
    }
    
    // Limpar elementos de áudio ao desmontar
    return () => {
      console.log('Limpando recursos de áudio');
      Object.values(audioElements).forEach(audio => {
        audio.pause();
        audio.src = '';
      });
      audioService.cleanup();
    };
  }, [tracks, audioElements, initAudioService]);

  // Gerar um ID único para uma nova faixa
  const generateTrackId = useCallback((category: AudioCategory): string => {
    // Encontrar o maior número para a categoria
    const categoryTracks = tracks.filter(track => track.category === category);
    let maxNumber = 0;
    
    categoryTracks.forEach(track => {
      const parts = track.id.split('-');
      if (parts.length === 2) {
        const num = parseInt(parts[1]);
        if (!isNaN(num) && num > maxNumber) {
          maxNumber = num;
        }
      }
    });
    
    return `${category}-${maxNumber + 1}`;
  }, [tracks]);

  const addTrack = useCallback((track: Omit<AudioTrack, 'id' | 'isPlaying' | 'volume'>) => {
    const newTrack: AudioTrack = {
      ...track,
      id: generateTrackId(track.category),
      isPlaying: false,
      volume: 0.7,
    };
    
    setTracks(prevTracks => [...prevTracks, newTrack]);
  }, [generateTrackId]);

  const removeTrack = useCallback((id: string) => {
    setTracks(prevTracks => prevTracks.filter(track => track.id !== id));
  }, []);

  // Função auxiliar para criar e reproduzir um elemento de áudio
  const createAndPlayAudio = useCallback((track: AudioTrack) => {
    try {
      console.log(`Criando novo elemento de áudio para: ${track.id}`);
      const newAudio = new Audio();
      newAudio.src = track.src;
      newAudio.loop = true;
      newAudio.volume = track.volume;
      
      // Adicionar event listeners para depuração
      newAudio.addEventListener('canplay', () => {
        console.log(`Áudio pronto para reproduzir: ${track.id}`);
      });
      
      newAudio.addEventListener('playing', () => {
        console.log(`Áudio reproduzindo: ${track.id}`);
      });
      
      newAudio.addEventListener('error', (e) => {
        console.error(`Erro no elemento de áudio ${track.id}:`, e);
      });
      
      // Tentar reproduzir o áudio
      newAudio.play()
        .then(() => {
          console.log(`Novo áudio iniciado: ${track.id}`);
          // Atualizar o estado dos elementos de áudio
          setAudioElements(prev => ({
            ...prev,
            [track.id]: newAudio
          }));
        })
        .catch(error => {
          console.error(`Erro ao reproduzir novo áudio ${track.id}:`, error);
        });
    } catch (error) {
      console.error(`Erro ao criar elemento de áudio para ${track.id}:`, error);
    }
  }, []);

  const togglePlayTrack = useCallback((id: string) => {
    console.log(`Alternando reprodução da faixa: ${id}`);
    
    const track = tracks.find(t => t.id === id);
    if (!track) {
      console.error(`Faixa não encontrada: ${id}`);
      return;
    }
    
    // Inicializar o serviço de áudio na primeira interação do usuário
    initAudioService();
    
    const isCurrentlyPlaying = track.isPlaying;
    console.log(`Estado atual da faixa ${id}: ${isCurrentlyPlaying ? 'reproduzindo' : 'parado'}`);
    
    // Atualizar o estado das faixas
    setTracks(prevTracks => {
      const updatedTracks = prevTracks.map(t => 
        t.id === id 
          ? { ...t, isPlaying: !isCurrentlyPlaying } 
          : t
      );
      console.log('Faixas atualizadas após toggle:', updatedTracks.filter(t => t.id === id));
      return updatedTracks;
    });
    
    // Reproduzir ou pausar o áudio
    if (track.src && (track.src.startsWith('/audio/') || track.src.startsWith('./audio/'))) {
      console.log(`Manipulando arquivo de áudio: ${track.src}`);
      
      // Verificar se já existe um elemento de áudio para esta faixa
      const audio = audioElements[id];
      
      if (audio) {
        console.log(`Elemento de áudio encontrado para ${id}`);
        if (isCurrentlyPlaying) {
          console.log(`Pausando áudio: ${id}`);
          audio.pause();
        } else {
          console.log(`Tentando reproduzir áudio: ${id}`);
          // Verificar se o áudio está pronto para ser reproduzido
          if (audio.readyState >= 2) {
            audio.play()
              .then(() => console.log(`Áudio reproduzido com sucesso: ${id}`))
              .catch(error => {
                console.error(`Erro ao reproduzir áudio ${id}:`, error);
                // Tentar criar um novo elemento de áudio como fallback
                createAndPlayAudio(track);
              });
          } else {
            console.log(`Áudio não está pronto, criando novo elemento: ${id}`);
            createAndPlayAudio(track);
          }
        }
      } else {
        console.log(`Nenhum elemento de áudio encontrado para ${id}, criando um novo`);
        if (!isCurrentlyPlaying) {
          createAndPlayAudio(track);
        }
      }
    } else {
      console.log(`Usando Web Audio API para: ${id}`);
      // Usar Web Audio API para sons gerados
      try {
        if (isCurrentlyPlaying) {
          audioService.stopTrack(id);
        } else {
          audioService.playTrack(id);
          audioService.setTrackVolume(id, track.volume);
        }
      } catch (error) {
        console.error(`Erro ao manipular áudio com Web Audio API: ${id}`, error);
      }
    }
  }, [tracks, audioElements, initAudioService, createAndPlayAudio]);

  const setTrackVolume = useCallback((id: string, volume: number) => {
    console.log(`Ajustando volume da faixa ${id} para ${volume}`);
    
    // Atualizar o estado das faixas primeiro
    setTracks(prevTracks => {
      const updatedTracks = prevTracks.map(track => 
        track.id === id 
          ? { ...track, volume } 
          : track
      );
      console.log('Faixas atualizadas após mudança de volume:', updatedTracks.filter(t => t.id === id));
      return updatedTracks;
    });
    
    // Atualizar volume do áudio
    const track = tracks.find(t => t.id === id);
    if (!track) {
      console.error(`Faixa não encontrada para ajuste de volume: ${id}`);
      return;
    }
    
    // Verificar se temos um elemento de áudio HTML para esta faixa
    const audio = audioElements[id];
    if (audio) {
      try {
        console.log(`Atualizando volume do elemento HTML Audio para ${id}: ${volume}`);
        audio.volume = volume;
      } catch (error) {
        console.error(`Erro ao ajustar volume do elemento HTML Audio: ${id}`, error);
      }
    }
    
    // Sempre tente atualizar o volume no Web Audio API
    try {
      console.log(`Atualizando volume no Web Audio API para ${id}: ${volume}`);
      initAudioService(); // Garantir que o serviço de áudio esteja inicializado
      audioService.setTrackVolume(id, volume);
    } catch (error) {
      console.error(`Erro ao atualizar volume no Web Audio API: ${id}`, error);
    }
    
    // Se a faixa está em reprodução mas não temos um elemento de áudio,
    // podemos precisar criar um novo elemento
    if (track.isPlaying && !audio && track.src && 
        (track.src.startsWith('/audio/') || track.src.startsWith('./audio/'))) {
      console.log(`Criando novo elemento de áudio para ajuste de volume: ${id}`);
      createAndPlayAudio(track);
    }
  }, [audioElements, tracks, initAudioService, createAndPlayAudio]);

  const saveEnvironment = useCallback((name: string) => {
    const newEnvironment: Environment = {
      id: Date.now().toString(),
      name,
      tracks: tracks.filter(track => track.isPlaying),
      createdAt: Date.now(),
    };
    
    setEnvironments(prevEnvironments => [...prevEnvironments, newEnvironment]);
    setActiveEnvironment(newEnvironment);
  }, [tracks]);

  const loadEnvironment = useCallback((id: string) => {
    const environment = environments.find(env => env.id === id);
    if (!environment) return;
    
    // Parar todas as faixas atuais
    setTracks(prevTracks => 
      prevTracks.map(track => ({ ...track, isPlaying: false }))
    );
    
    // Atualizar as faixas com base no ambiente selecionado
    setTracks(prevTracks => {
      return prevTracks.map(track => {
        const envTrack = environment.tracks.find(t => t.id === track.id);
        if (envTrack) {
          return { ...track, isPlaying: true, volume: envTrack.volume };
        }
        return track;
      });
    });
    
    setActiveEnvironment(environment);
  }, [environments]);

  const deleteEnvironment = useCallback((id: string) => {
    setEnvironments(prevEnvironments => 
      prevEnvironments.filter(env => env.id !== id)
    );
    
    if (activeEnvironment?.id === id) {
      setActiveEnvironment(null);
    }
  }, [activeEnvironment]);

  // Parar todas as faixas
  const stopAllTracks = useCallback(() => {
    console.log('Parando todas as faixas');
    
    // Parar elementos de áudio HTML
    Object.values(audioElements).forEach(audio => {
      try {
        console.log('Pausando elemento de áudio HTML');
        audio.pause();
        // Redefinir o tempo de reprodução para garantir que pare completamente
        audio.currentTime = 0;
      } catch (error) {
        console.error('Erro ao pausar elemento de áudio:', error);
      }
    });
    
    try {
      // Parar sons do Web Audio API
      console.log('Parando sons do Web Audio API');
      audioService.stopAllTracks();
    } catch (error) {
      console.error('Erro ao parar sons do Web Audio API:', error);
    }
    
    // Atualizar estado
    console.log('Atualizando estado das faixas para não reproduzindo');
    setTracks(prevTracks => 
      prevTracks.map(track => ({ ...track, isPlaying: false }))
    );
    
    // Limpar o mapa de elementos de áudio
    setAudioElements({});
  }, [audioElements]);
  
  // Reproduzir todas as faixas
  const playAllTracks = useCallback(() => {
    initAudioService();
    
    // Primeiro pare todas as faixas para evitar duplicação de áudio
    audioService.stopAllTracks();
    
    // Limpar elementos de áudio existentes
    Object.values(audioElements).forEach(audio => {
      audio.pause();
    });
    
    // Depois ative todas as faixas
    setTracks(prevTracks => 
      prevTracks.map(track => ({ ...track, isPlaying: true }))
    );
  }, [initAudioService, audioElements]);
  
  // Alternar categoria (reproduzir/parar todas as faixas de uma categoria)
  const toggleCategory = useCallback((category: AudioCategory) => {
    console.log(`Alternando categoria: ${category}`);
    
    // Verificar se alguma faixa da categoria está tocando
    const categoryPlaying = tracks.some(track => 
      track.category === category && track.isPlaying
    );
    
    console.log(`Estado atual da categoria ${category}: ${categoryPlaying ? 'reproduzindo' : 'parado'}`);
    
    if (categoryPlaying) {
      console.log(`Parando todas as faixas da categoria: ${category}`);
      
      // Parar todas as faixas da categoria
      tracks.forEach(track => {
        if (track.category === category && track.isPlaying) {
          // Usar a função togglePlayTrack para garantir consistência
          togglePlayTrack(track.id);
        }
      });
    } else {
      console.log(`Iniciando todas as faixas da categoria: ${category}`);
      
      // Inicializar o serviço de áudio
      initAudioService();
      
      // Iniciar todas as faixas da categoria
      tracks.forEach(track => {
        if (track.category === category && !track.isPlaying) {
          // Usar a função togglePlayTrack para garantir consistência
          togglePlayTrack(track.id);
        }
      });
    }
  }, [tracks, initAudioService, togglePlayTrack]);


  return (
    <AudioContext.Provider
      value={{
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
        generateTrackId,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = (): AudioContextType => {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error('useAudio deve ser usado dentro de um AudioProvider');
  }
  return context;
};
