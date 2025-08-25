// API service for AWS S3 and API Gateway integration
const API_BASE_URL = 'YOUR_API_GATEWAY_ENDPOINT'; // Replace with your API Gateway URL

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface UploadResponse {
  fileId: string;
  url: string;
  fileName: string;
}

class ApiService {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  // Folder operations
  async getFolders(): Promise<ApiResponse<any[]>> {
    try {
      const response = await fetch(`${this.baseUrl}/folders`);
      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      return { success: false, error: 'Error fetching folders' };
    }
  }

  async createFolder(name: string): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${this.baseUrl}/folders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
      });
      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      return { success: false, error: 'Error creating folder' };
    }
  }

  async deleteFolder(folderId: string): Promise<ApiResponse<void>> {
    try {
      await fetch(`${this.baseUrl}/folders/${folderId}`, {
        method: 'DELETE'
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Error deleting folder' };
    }
  }

  // Media operations
  async getMediaFiles(folderId: string, page: number = 1, limit: number = 20): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${this.baseUrl}/folders/${folderId}/media?page=${page}&limit=${limit}`);
      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      return { success: false, error: 'Error fetching media files' };
    }
  }

  async uploadFile(folderId: string, file: File): Promise<ApiResponse<UploadResponse>> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folderId', folderId);

      const response = await fetch(`${this.baseUrl}/upload`, {
        method: 'POST',
        body: formData
      });
      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      return { success: false, error: 'Error uploading file' };
    }
  }

  async deleteFile(fileId: string): Promise<ApiResponse<void>> {
    try {
      await fetch(`${this.baseUrl}/media/${fileId}`, {
        method: 'DELETE'
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Error deleting file' };
    }
  }

  async getPresignedUrl(fileName: string, fileType: string): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${this.baseUrl}/upload/presigned`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileName, fileType })
      });
      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      return { success: false, error: 'Error getting presigned URL' };
    }
  }
}

export const apiService = new ApiService(API_BASE_URL);