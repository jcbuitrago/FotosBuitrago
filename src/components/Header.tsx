import React from 'react';
import { Palmtree, FolderPlus, Upload, Home } from 'lucide-react';

interface HeaderProps {
  onCreateFolder: () => void;
  onUploadClick: () => void;
  onHomeClick: () => void;
  currentFolder?: string;
}

export function Header({ onCreateFolder, onUploadClick, onHomeClick, currentFolder }: HeaderProps) {
  return (
    <header className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 p-2 rounded-full">
              <Palmtree className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Fotos Buitrago</h1>
              <p className="text-emerald-100 text-sm">Memorias del Caribe</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            {currentFolder && (
              <button
                onClick={onHomeClick}
                className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-full transition-all duration-200"
              >
                <Home className="w-4 h-4" />
                <span className="hidden sm:inline">Inicio</span>
              </button>
            )}
            <button
              onClick={onCreateFolder}
              className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-full transition-all duration-200"
            >
              <FolderPlus className="w-4 h-4" />
              <span className="hidden sm:inline">Nueva Carpeta</span>
            </button>
            <button
              onClick={onUploadClick}
              className="flex items-center space-x-2 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-full transition-all duration-200 shadow-lg"
            >
              <Upload className="w-4 h-4" />
              <span className="hidden sm:inline">Subir</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}