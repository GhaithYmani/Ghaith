import React, { useState, useCallback } from 'react';
import { Scene, SceneStatus } from './types';
import { transformImage } from './services/geminiService';
import { fileToBase64 } from './utils/fileUtils';
import ImageUploader from './components/ImageUploader';
import SceneGrid from './components/SceneGrid';

const initialScenes: Scene[] = [
  {
    id: 1,
    title: 'Very Wide Angle',
    prompt: "Recreate this image as a cinematic very wide-angle shot, capturing more of the surrounding environment.",
    imageUrl: null,
    status: 'pending',
  },
  {
    id: 2,
    title: 'Bird\'s Eye View',
    prompt: "Recreate this image from a bird's-eye view, as if taken from directly above.",
    imageUrl: null,
    status: 'pending',
  },
  {
    id: 3,
    title: 'POV Shot',
    prompt: "Recreate this image from a first-person point-of-view (POV) of the main subject. If there's no clear subject, imagine a person standing there and capture their perspective.",
    imageUrl: null,
    status: 'pending',
  },
  {
    id: 4,
    title: 'Extreme Close-Up',
    prompt: "Recreate this image as a cinematic extreme close-up shot, focusing on a compelling detail of the main subject or an interesting object in the scene.",
    imageUrl: null,
    status: 'pending',
  },
  {
    id: 5,
    title: 'Profile Shot',
    prompt: "Recreate this image from a side profile angle. If the original image is already a profile shot, change it to a dynamic three-quarter angle instead.",
    imageUrl: null,
    status: 'pending',
  },
  {
    id: 6,
    title: 'Low Angle Shot',
    prompt: "Recreate this image as a cinematic medium shot captured from a low angle, looking up to make the subject appear more imposing or dramatic.",
    imageUrl: null,
    status: 'pending',
  },
];


const App: React.FC = () => {
  const [originalImageFile, setOriginalImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [scenes, setScenes] = useState<Scene[]>(initialScenes);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageSelect = (file: File) => {
    setOriginalImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setScenes(initialScenes); // Reset scenes when a new image is uploaded
    setError(null);
  };

  const handleGenerateClick = useCallback(async () => {
    if (!originalImageFile) {
      setError("Please upload an image first.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setScenes(prev => prev.map(s => ({ ...s, status: 'loading', imageUrl: null })));

    try {
      const base64Image = await fileToBase64(originalImageFile);
      const mimeType = originalImageFile.type;

      const generationPromises = initialScenes.map(scene =>
        transformImage(base64Image, mimeType, scene.prompt)
      );

      const results = await Promise.allSettled(generationPromises);

      const newScenes = initialScenes.map((scene, index) => {
        const result = results[index];
        if (result.status === 'fulfilled' && result.value) {
          return {
            ...scene,
            imageUrl: `data:image/png;base64,${result.value}`,
            status: 'done' as SceneStatus,
          };
        } else {
          console.error(`Failed to generate '${scene.title}':`, result.status === 'rejected' ? result.reason : 'Empty response');
          return {
            ...scene,
            imageUrl: null,
            status: 'error' as SceneStatus,
          };
        }
      });
      
      setScenes(newScenes);

    } catch (e) {
      console.error("An unexpected error occurred:", e);
      setError("An unexpected error occurred during image processing. Please try again.");
      setScenes(prev => prev.map(s => ({ ...s, status: 'error', imageUrl: null })));
    } finally {
      setIsLoading(false);
    }
  }, [originalImageFile]);

  return (
    <div className="min-h-screen bg-gray-900 font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-8 md:mb-12">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
            Cinematic Scene Transformer
          </h1>
          <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
            Upload an image to transform it into six unique, AI-generated cinematic shots.
          </p>
        </header>

        <main>
          <div className="flex flex-col lg:flex-row items-start justify-center gap-8 mb-8">
            <div className="w-full lg:w-1/3 xl:w-1/4 flex-shrink-0">
              <ImageUploader onImageSelect={handleImageSelect} imagePreviewUrl={imagePreview} />
            </div>
            <div className="flex flex-col items-center justify-center lg:items-start text-center lg:text-left h-full lg:pt-10">
              <button
                onClick={handleGenerateClick}
                disabled={isLoading || !originalImageFile}
                className="w-64 text-lg font-semibold px-8 py-4 bg-cyan-500 text-white rounded-lg shadow-lg hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-opacity-75 transition-all duration-300 disabled:bg-gray-600 disabled:cursor-not-allowed disabled:shadow-none"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating...
                  </div>
                ) : (
                  'Get Your Scenes'
                )}
              </button>
               {error && <p className="mt-4 text-red-400">{error}</p>}
            </div>
          </div>
          
          <SceneGrid scenes={scenes} />
        </main>
      </div>
    </div>
  );
};

export default App;