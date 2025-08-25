export interface MediaFile {
  id: string;
  name: string;
  type: 'image' | 'video';
  url: string;
  folderId: string;
  createdAt: number;
}

export interface Folder {
  id: string;
  name: string;
  createdAt: number;
}

export interface AppState {
  currentFolderId: string;
  viewMode: 'folders' | 'gallery';
  currentPage: number;
}