import React, { useState } from 'react';
import { Play, Trash2, Download, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { MediaFile } from '../types';

interface MediaGalleryProps {
  mediaFiles: MediaFile[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onDeleteFile: (fileId: string) => void;
  onBackToFolders: () => void;
  folderName: string;
  loading?: boolean;
}

export function MediaGallery({ 
  mediaFiles, 
  currentPage, 
  totalPages, 
  onPageChange, 
  onDeleteFile, 
  onBackToFolders,
  folderName,
  loading = false
}: MediaGalleryProps) {
  const [selectedMedia, setSelectedMedia] = useState<MediaFile | null>(null);

  const handleDeleteClick = (e: React.MouseEvent, fileId: string) => {
    e.stopPropagation();
    if (window.confirm('¿Estás seguro de que quieres eliminar este archivo?')) {
      onDeleteFile(fileId);
    }
  };

  const handleDownload = (url: string, fileName: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBackToFolders}
          className="flex items-center space-x-2 text-teal-600 hover:text-teal-800 font-medium transition-colors duration-200"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Volver a carpetas</span>
        </button>
        <h2 className="text-2xl font-bold text-gray-800">{folderName}</h2>
        <div></div>
      </div>

      {/* Media Grid */}
      {mediaFiles.length === 0 ? (
        <div className="text-center py-16">
          <div className="bg-gradient-to-br from-teal-100 to-cyan-100 w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center">
            <Play className="w-12 h-12 text-teal-600" />
          </div>
          <p className="text-gray-600 text-lg font-medium mb-2">No hay archivos en esta carpeta</p>
          <p className="text-gray-500">Sube algunas fotos o videos para empezar</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {mediaFiles.map((file) => (
              <div
                key={file.id}
                className="group relative aspect-square bg-gray-100 rounded-xl overflow-hidden cursor-pointer shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                onClick={() => setSelectedMedia(file)}
              >
                {file.type === 'image' ? (
                  <img
                    src={file.url}
                    alt={file.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                    <Play className="w-12 h-12 text-white" />
                  </div>
                )}

                {/* Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownload(file.url, file.name);
                      }}
                      className="bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-800 p-2 rounded-full transition-all duration-200"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => handleDeleteClick(e, file.id)}
                      className="bg-red-500 bg-opacity-90 hover:bg-opacity-100 text-white p-2 rounded-full transition-all duration-200"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* File type indicator */}
                {file.type === 'video' && (
                  <div className="absolute top-2 left-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs font-medium">
                    VIDEO
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center space-x-2 mt-8">
              <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex items-center space-x-1 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Anterior</span>
              </button>

              <div className="flex space-x-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={`px-3 py-2 rounded-lg font-medium transition-colors duration-200 ${
                      page === currentPage
                        ? 'bg-teal-600 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="flex items-center space-x-1 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                <span>Siguiente</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </>
      )}

      {/* Media Viewer Modal */}
      {selectedMedia && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={() => setSelectedMedia(null)}
              className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {selectedMedia.type === 'image' ? (
              <img
                src={selectedMedia.url}
                alt={selectedMedia.name}
                className="max-w-full max-h-full object-contain rounded-lg"
              />
            ) : (
              <video
                src={selectedMedia.url}
                controls
                className="max-w-full max-h-full rounded-lg"
              />
            )}

            <div className="absolute bottom-4 left-4 text-white bg-black bg-opacity-50 px-3 py-2 rounded-lg">
              <p className="font-medium">{selectedMedia.name}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}