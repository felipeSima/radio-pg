import { AudioCategory } from '../types/audio';

// Classe para gerenciar o Web Audio API
export class AudioService {
  private audioContext: AudioContext | null = null;
  private gainNodes: Record<string, GainNode> = {};
  private audioSources: Record<string, OscillatorNode> = {};
  private audioContextCreationTime: number = 0;

  // Inicializa o contexto de áudio (deve ser chamado após interação do usuário)
  public initAudio(): AudioContext {
    // Se o contexto já existe e está em estado suspenso, tente retomá-lo
    if (this.audioContext) {
      if (this.audioContext.state === 'suspended') {
        this.audioContext.resume();
      }
      return this.audioContext;
    }
    
    // Criar um novo contexto de áudio
    this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    this.audioContextCreationTime = Date.now();
    this.gainNodes = {}; // Limpar nós de ganho antigos
    this.audioSources = {}; // Limpar fontes de áudio antigas
    
    return this.audioContext;
  }

  // Obtém frequência base para cada categoria
  private getBaseFrequency(category: AudioCategory): number {
    const baseFreq: Record<AudioCategory, number> = {
      mystery: 150,
      wilderness: 220,
      combat: 330,
      social: 261
    };
    return baseFreq[category];
  }

  // Obtém frequência para uma faixa específica
  public getFrequencyForTrack(trackId: string): number {
    const [category, numberStr] = trackId.split('-');
    const number = parseInt(numberStr);
    return this.getBaseFrequency(category as AudioCategory) + (number * 20);
  }

  // Reproduz uma faixa
  public playTrack(trackId: string): void {
    // Garantir que temos um contexto de áudio válido
    if (!this.audioContext || this.audioContext.state === 'closed') {
      this.initAudio();
    } else if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }

    if (this.audioContext) {
      try {
        // Verificar se já existe um oscilador para esta faixa e pará-lo
        if (this.audioSources[trackId]) {
          this.stopTrack(trackId);
        }
        
        // Cria um nó de ganho se não existir ou se o contexto foi recriado
        if (!this.gainNodes[trackId]) {
          const gainNode = this.audioContext.createGain();
          gainNode.connect(this.audioContext.destination);
          gainNode.gain.value = 0.7; // Volume padrão
          this.gainNodes[trackId] = gainNode;
        }

        // Cria um oscilador
        const oscillator = this.audioContext.createOscillator();
        oscillator.type = 'sine';
        oscillator.frequency.value = this.getFrequencyForTrack(trackId);
        oscillator.connect(this.gainNodes[trackId]);
        oscillator.start();

        // Armazena o oscilador
        this.audioSources[trackId] = oscillator;
      } catch (error) {
        console.error('Erro ao reproduzir faixa:', error);
        
        // Se ocorrer um erro de contexto, recriar o contexto
        if (error instanceof DOMException && 
            (error.message.includes('different audio context') || 
             error.name === 'InvalidAccessError')) {
          console.log('Recriando contexto de áudio devido a erro de conexão');
          this.cleanup();
          this.initAudio();
          // Tentar novamente após recriar o contexto
          setTimeout(() => this.playTrack(trackId), 100);
        }
      }
    }
  }

  // Para uma faixa
  public stopTrack(trackId: string): void {
    try {
      if (this.audioSources[trackId]) {
        this.audioSources[trackId].stop();
        delete this.audioSources[trackId];
      }
    } catch (error) {
      console.error('Erro ao parar faixa:', error);
      // Limpar referência mesmo se houver erro
      delete this.audioSources[trackId];
    }
  }

  // Atualiza o volume de uma faixa
  public setTrackVolume(trackId: string, volume: number): void {
    if (this.gainNodes[trackId]) {
      this.gainNodes[trackId].gain.value = volume;
    }
  }

  // Para todas as faixas
  public stopAllTracks(): void {
    Object.keys(this.audioSources).forEach(trackId => {
      this.stopTrack(trackId);
    });
  }

  // Limpa recursos ao desmontar
  public cleanup(): void {
    try {
      this.stopAllTracks();
      
      // Limpar nós de ganho
      this.gainNodes = {};
      
      // Fechar o contexto de áudio
      if (this.audioContext && typeof this.audioContext.close === 'function') {
        this.audioContext.close();
        this.audioContext = null;
      }
    } catch (error) {
      console.error('Erro ao limpar recursos de áudio:', error);
      // Garantir que as referências sejam limpas mesmo em caso de erro
      this.audioSources = {};
      this.gainNodes = {};
      this.audioContext = null;
    }
  }
}

// Singleton para uso em toda a aplicação
export const audioService = new AudioService();
