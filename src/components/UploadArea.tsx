import React, { useCallback, useState } from 'react';
import { Upload, X, FileImage, FileVideo, Loader } from 'lucide-react';

interface UploadAreaProps {
  onUpload: (files: FileList) => Promise<void>;
  folderId: string;
  isVisible: boolean;
  onClose: () => void;
}

export function UploadArea({ onUpload, folderId, isVisible, onClose }: UploadAreaProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string[]>([]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      setUploading(true);
      try {
        await onUpload(files);
      } finally {
        setUploading(false);
        setUploadProgress([]);
      }
    }
  }, [onUpload]);

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setUploading(true);
      try {
        await onUpload(files);
      } finally {
        setUploading(false);
        setUploadProgress([]);
      }
    }
  }, [onUpload]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-8 max-w-lg w-full shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-800">Subir Archivos</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {uploading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Subiendo archivos...</p>
            <p className="text-sm text-gray-500 mt-2">Por favor espera mientras se procesan los archivos</p>
          </div>
        ) : (
          <>
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
                isDragOver
                  ? 'border-teal-500 bg-teal-50'
                  : 'border-gray-300 hover:border-teal-400 hover:bg-teal-50/50'
              }`}
            >
              <div className="space-y-4">
                <div className="flex justify-center space-x-4">
                  <div className="bg-gradient-to-br from-teal-500 to-cyan-600 p-3 rounded-full">
                    <Upload className="w-8 h-8 text-white" />
                  </div>
                  <div className="bg-gradient-to-br from-orange-500 to-red-500 p-3 rounded-full">
                    <FileImage className="w-8 h-8 text-white" />
                  </div>
                  <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-3 rounded-full">
                    <FileVideo className="w-8 h-8 text-white" />
                  </div>
                </div>

                <div>
                  <p className="text-xl font-semibold text-gray-700 mb-2">
                    {isDragOver ? 'Suelta los archivos aquí' : 'Arrastra y suelta tus archivos'}
                  </p>
                  <p className="text-gray-500 mb-4">
                    Soporta fotos (JPG, PNG, WEBP) y videos (MP4, MOV, AVI)
                  </p>
                </div>

                <div className="flex items-center justify-center space-x-4">
                  <div className="flex-1 h-px bg-gray-300"></div>
                  <span className="text-gray-500 font-medium">O</span>
                  <div className="flex-1 h-px bg-gray-300"></div>
                </div>

                <label className="inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-semibold py-3 px-6 rounded-xl cursor-pointer transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105">
                  <Upload className="w-5 h-5" />
                  <span>Seleccionar Archivos</span>
                  <input
                    type="file"
                    multiple
                    accept="image/*,video/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                Máximo 10 archivos por vez • Hasta 100MB por archivo
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}