export type SceneStatus = 'pending' | 'loading' | 'done' | 'error';

export interface Scene {
  id: number;
  title: string;
  prompt: string;
  imageUrl: string | null;
  status: SceneStatus;
}