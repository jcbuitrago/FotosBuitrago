import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { FolderGrid } from './components/FolderGrid';
import { MediaGallery } from './components/MediaGallery';
import { UploadArea } from './components/UploadArea';
import { FolderModal } from './components/FolderModal';
import { MediaFile, Folder, AppState } from './types';
import { apiService } from './services/api';

function App() {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [appState, setAppState] = useState<AppState>({
    currentFolderId: '',
    viewMode: 'folders',
    currentPage: 1
  });
  const [totalPages, setTotalPages] = useState(1);
  const [showUploadArea, setShowUploadArea] = useState(false);
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentFolderName, setCurrentFolderName] = useState('');

  // Load folders on component mount
  useEffect(() => {
    loadFolders();
  }, []);

  // Load media files when folder changes
  useEffect(() => {
    if (appState.currentFolderId && appState.viewMode === 'gallery') {
      loadMediaFiles(appState.currentFolderId, appState.currentPage);
    }
  }, [appState.currentFolderId, appState.currentPage, appState.viewMode]);

  const loadFolders = async () => {
    setLoading(true);
    try {
      const response = await apiService.getFolders();
      if (response.success && response.data) {
        setFolders(response.data);
      } else {
        console.error('Error loading folders:', response.error);
        // Fallback to demo data for development
        setFolders([
          { id: '1', name: 'Vacaciones Caribe', createdAt: Date.now() - 86400000 },
          { id: '2', name: 'Familia y Amigos', createdAt: Date.now() - 172800000 },
          { id: '3', name: 'Naturaleza Costa Rica', createdAt: Date.now() - 259200000 }
        ]);
      }
    } catch (error) {
      console.error('Error loading folders:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMediaFiles = async (folderId: string, page: number = 1) => {
    setLoading(true);
    try {
      const response = await apiService.getMediaFiles(folderId, page, 20);
      if (response.success && response.data) {
        setMediaFiles(response.data.files || []);
        setTotalPages(response.data.totalPages || 1);
      } else {
        console.error('Error loading media files:', response.error);
        // Fallback to demo data for development
        setMediaFiles([
          {
            id: '1',
            name: 'beach-sunset.jpg',
            type: 'image',
            url: 'https://images.pexels.com/photos/1287145/pexels-photo-1287145.jpeg?auto=compress&cs=tinysrgb&w=800',
            folderId,
            createdAt: Date.now()
          },
          {
            id: '2',
            name: 'tropical-beach.jpg',
            type: 'image',
            url: 'https://images.pexels.com/photos/1032650/pexels-photo-1032650.jpeg?auto=compress&cs=tinysrgb&w=800',
            folderId,
            createdAt: Date.now()
          },
          {
            id: '3',
            name: 'palm-trees.jpg',
            type: 'image',
            url: 'https://images.pexels.com/photos/1630047/pexels-photo-1630047.jpeg?auto=compress&cs=tinysrgb&w=800',
            folderId,
            createdAt: Date.now()
          }
        ]);
        setTotalPages(1);
      }
    } catch (error) {
      console.error('Error loading media files:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateFolder = async (name: string) => {
    try {
      const response = await apiService.createFolder(name);
      if (response.success && response.data) {
        setFolders(prev => [...prev, response.data]);
      } else {
        console.error('Error creating folder:', response.error);
        // Fallback for development
        const newFolder: Folder = {
          id: Date.now().toString(),
          name,
          createdAt: Date.now()
        };
        setFolders(prev => [...prev, newFolder]);
      }
    } catch (error) {
      console.error('Error creating folder:', error);
    }
  };

  const handleDeleteFolder = async (folderId: string) => {
    try {
      const response = await apiService.deleteFolder(folderId);
      if (response.success) {
        setFolders(prev => prev.filter(folder => folder.id !== folderId));
      } else {
        console.error('Error deleting folder:', response.error);
      }
    } catch (error) {
      console.error('Error deleting folder:', error);
    }
  };

  const handleFolderClick = (folderId: string) => {
    const folder = folders.find(f => f.id === folderId);
    setCurrentFolderName(folder?.name || '');
    setAppState({
      currentFolderId: folderId,
      viewMode: 'gallery',
      currentPage: 1
    });
  };

  const handleBackToFolders = () => {
    setAppState({
      currentFolderId: '',
      viewMode: 'folders',
      currentPage: 1
    });
    setMediaFiles([]);
  };

  const handleUpload = async (files: FileList) => {
    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const response = await apiService.uploadFile(appState.currentFolderId, file);
        if (response.success && response.data) {
          return response.data;
        } else {
          console.error('Error uploading file:', response.error);
          return null;
        }
      });

      const results = await Promise.all(uploadPromises);
      const successfulUploads = results.filter(Boolean);

      if (successfulUploads.length > 0) {
        // Reload media files to show new uploads
        if (appState.currentFolderId && appState.viewMode === 'gallery') {
          loadMediaFiles(appState.currentFolderId, appState.currentPage);
        }
      }

      setShowUploadArea(false);
    } catch (error) {
      console.error('Error uploading files:', error);
    }
  };

  const handleDeleteFile = async (fileId: string) => {
    try {
      const response = await apiService.deleteFile(fileId);
      if (response.success) {
        setMediaFiles(prev => prev.filter(file => file.id !== fileId));
      } else {
        console.error('Error deleting file:', response.error);
      }
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  };

  const handlePageChange = (page: number) => {
    setAppState(prev => ({ ...prev, currentPage: page }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50">
      <Header
        onCreateFolder={() => setShowFolderModal(true)}
        onUploadClick={() => setShowUploadArea(true)}
        onHomeClick={handleBackToFolders}
        currentFolder={appState.viewMode === 'gallery' ? currentFolderName : undefined}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {appState.viewMode === 'folders' ? (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Bienvenido a Fotos Buitrago
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Organiza y guarda todos tus recuerdos del Caribe. 
                Crea carpetas para diferentes momentos y sube tus fotos y videos favoritos.
              </p>
            </div>
            
            {loading ? (
              <div className="flex justify-center items-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
              </div>
            ) : (
              <FolderGrid
                folders={folders}
                onFolderClick={handleFolderClick}
                onFolderDelete={handleDeleteFolder}
              />
            )}
          </div>
        ) : (
          <MediaGallery
            mediaFiles={mediaFiles}
            currentPage={appState.currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            onDeleteFile={handleDeleteFile}
            onBackToFolders={handleBackToFolders}
            folderName={currentFolderName}
            loading={loading}
          />
        )}
      </main>

      <UploadArea
        onUpload={handleUpload}
        folderId={appState.currentFolderId}
        isVisible={showUploadArea}
        onClose={() => setShowUploadArea(false)}
      />

      <FolderModal
        isVisible={showFolderModal}
        onClose={() => setShowFolderModal(false)}
        onCreateFolder={handleCreateFolder}
      />
    </div>
  );
}

export default App;