import React from 'react';
import { Scene } from '../types';
import SceneCard from './SceneCard';

interface SceneGridProps {
  scenes: Scene[];
}

const SceneGrid: React.FC<SceneGridProps> = ({ scenes }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {scenes.map((scene) => (
        <SceneCard key={scene.id} scene={scene} />
      ))}
    </div>
  );
};

export default SceneGrid;