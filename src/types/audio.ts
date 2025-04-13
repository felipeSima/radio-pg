export type AudioCategory = 'mystery' | 'wilderness' | 'combat' | 'social';

export interface AudioTrack {
  id: string;
  title: string;
  category: AudioCategory;
  src: string;
  volume: number;
  isPlaying: boolean;
}

export interface Environment {
  id: string;
  name: string;
  tracks: AudioTrack[];
  createdAt: number;
}
