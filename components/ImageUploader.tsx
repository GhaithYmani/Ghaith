import React, { useRef } from 'react';
import UploadIcon from './icons/UploadIcon';

interface ImageUploaderProps {
  onImageSelect: (file: File) => void;
  imagePreviewUrl: string | null;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelect, imagePreviewUrl }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageSelect(file);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const file = event.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
        onImageSelect(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLLabelElement>) => {
      event.preventDefault();
      event.stopPropagation();
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full">
        <label
            htmlFor="image-upload"
            onClick={handleClick}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="cursor-pointer group aspect-square w-full bg-gray-800 border-2 border-dashed border-gray-600 rounded-lg flex flex-col items-center justify-center text-center p-4 transition-all duration-300 hover:border-cyan-500 hover:bg-gray-700"
        >
            <input
                id="image-upload"
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
            />
            {imagePreviewUrl ? (
                <img src={imagePreviewUrl} alt="Preview" className="max-h-full max-w-full object-contain rounded-md" />
            ) : (
                <div className="text-gray-400 flex flex-col items-center">
                    <UploadIcon className="w-12 h-12 mb-4 text-gray-500 group-hover:text-cyan-500 transition-colors" />
                    <span className="font-semibold">Click to upload or drag & drop</span>
                    <span className="text-sm">PNG, JPG, WEBP, etc.</span>
                </div>
            )}
        </label>
    </div>
  );
};

export default ImageUploader;