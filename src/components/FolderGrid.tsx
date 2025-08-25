import React from 'react';
import { Folder, Calendar, FolderOpen, Trash2 } from 'lucide-react';
import { Folder as FolderType } from '../types';

interface FolderGridProps {
  folders: FolderType[];
  onFolderClick: (folderId: string) => void;
  onFolderDelete: (folderId: string) => void;
}

export function FolderGrid({ folders, onFolderClick, onFolderDelete }: FolderGridProps) {
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleDeleteClick = (e: React.MouseEvent, folderId: string) => {
    e.stopPropagation();
    if (window.confirm('¿Estás seguro de que quieres eliminar esta carpeta?')) {
      onFolderDelete(folderId);
    }
  };

  if (folders.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="bg-gradient-to-br from-teal-100 to-cyan-100 w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center">
          <FolderOpen className="w-12 h-12 text-teal-600" />
        </div>
        <p className="text-gray-600 text-lg font-medium mb-2">No hay carpetas creadas</p>
        <p className="text-gray-500">Haz clic en "Nueva Carpeta" para empezar a organizar tus recuerdos</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
      {folders.map((folder) => (
        <div
          key={folder.id}
          className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl cursor-pointer transform hover:scale-105 transition-all duration-300 border border-gray-100 overflow-hidden"
        >
          {/* Background decoration */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 opacity-50"></div>
          
          {/* Delete button */}
          <button
            onClick={(e) => handleDeleteClick(e, folder.id)}
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-full transition-all duration-200 z-10"
          >
            <Trash2 className="w-3 h-3" />
          </button>

          <div 
            onClick={() => onFolderClick(folder.id)}
            className="relative flex flex-col items-center space-y-4"
          >
            <div className="bg-gradient-to-br from-amber-400 via-orange-500 to-red-500 p-4 rounded-2xl shadow-lg transform group-hover:rotate-3 transition-transform duration-300">
              <Folder className="w-10 h-10 text-white" />
            </div>
            
            <div className="text-center">
              <h3 className="font-bold text-gray-800 text-sm mb-1 line-clamp-2 leading-tight">
                {folder.name}
              </h3>
              <div className="flex items-center justify-center text-xs text-gray-500 space-x-1">
                <Calendar className="w-3 h-3" />
                <span>{formatDate(folder.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}