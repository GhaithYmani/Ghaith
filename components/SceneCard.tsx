import React from 'react';
import { Scene } from '../types';
import Loader from './Loader';
import DownloadIcon from './icons/DownloadIcon';
import ErrorIcon from './icons/ErrorIcon';

interface SceneCardProps {
  scene: Scene;
}

const SceneCard: React.FC<SceneCardProps> = ({ scene }) => {
  const { title, status, imageUrl } = scene;

  const renderContent = () => {
    switch (status) {
      case 'loading':
        return <Loader />;
      case 'done':
        return (
          <>
            {imageUrl && <img src={imageUrl} alt={title} className="w-full h-full object-cover" />}
            <div className="absolute inset-0 bg-black bg-opacity-60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4">
              <a
                href={imageUrl ?? '#'}
                download={`${title.replace(/\s+/g, '_')}.png`}
                className="flex items-center gap-2 bg-cyan-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-cyan-600 transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <DownloadIcon className="w-5 h-5" />
                Download
              </a>
            </div>
          </>
        );
      case 'error':
        return (
          <div className="flex flex-col items-center justify-center text-red-400">
            <ErrorIcon className="w-12 h-12 mb-2" />
            <p className="font-semibold">Generation Failed</p>
          </div>
        );
      case 'pending':
      default:
        return (
            <div className="flex items-center justify-center text-gray-500">
                <p>Waiting for generation...</p>
            </div>
        );
    }
  };

  return (
    <div className="relative group aspect-square bg-gray-800 rounded-lg overflow-hidden border border-gray-700 flex flex-col shadow-lg">
      <div className="flex-grow flex items-center justify-center">
        {renderContent()}
      </div>
      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-2 text-center">
        <h3 className="font-semibold text-white truncate">{title}</h3>
      </div>
    </div>
  );
};

export default SceneCard;