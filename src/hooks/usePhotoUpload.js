import { useState } from 'react';
import { uploadPhotoToStorage, deletePhotoFromStorage } from '@/utils/supabaseStorage';
import { validatePhoto } from '@/utils/photoValidation';

/**
 * Custom hook for photo upload to Supabase Storage
 * @param {string} folder - The folder path in storage (e.g., 'productos', 'vientres', 'reproductores')
 * @returns {{uploadPhotos: Function, deletePhoto: Function, isLoading: boolean, error: string|null, uploadedUrls: string[]}}
 */
export const usePhotoUpload = (folder = 'general') => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadedUrls, setUploadedUrls] = useState([]);

  /**
   * Uploads multiple photos sequentially
   * @param {File[]} files - Array of files to upload
   * @param {number} currentPhotoCount - Current number of photos already uploaded
   * @returns {Promise<string[]>} - Array of uploaded photo URLs
   */
  const uploadPhotos = async (files, currentPhotoCount = 0) => {
    setIsLoading(true);
    setError(null);
    const urls = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Validate photo
        const validation = validatePhoto(file, currentPhotoCount + i);
        if (!validation.valid) {
          setError(validation.error);
          setIsLoading(false);
          return urls;
        }

        // Upload photo
        const { url, error: uploadError } = await uploadPhotoToStorage(file, folder);
        
        if (uploadError) {
          setError(`Error al subir ${file.name}: ${uploadError}`);
          setIsLoading(false);
          return urls;
        }

        if (url) {
          urls.push(url);
        }
      }

      setUploadedUrls(urls);
      setIsLoading(false);
      return urls;
    } catch (err) {
      console.error('Unexpected error uploading photos:', err);
      setError('Error inesperado al subir las fotos');
      setIsLoading(false);
      return urls;
    }
  };

  /**
   * Deletes a photo from storage
   * @param {string} photoUrl - The public URL of the photo to delete
   * @returns {Promise<boolean>} - True if deletion was successful
   */
  const deletePhoto = async (photoUrl) => {
    setIsLoading(true);
    setError(null);

    try {
      const { success, error: deleteError } = await deletePhotoFromStorage(photoUrl);

      if (deleteError) {
        setError(`Error al eliminar la foto: ${deleteError}`);
        setIsLoading(false);
        return false;
      }

      setIsLoading(false);
      return success;
    } catch (err) {
      console.error('Unexpected error deleting photo:', err);
      setError('Error inesperado al eliminar la foto');
      setIsLoading(false);
      return false;
    }
  };

  return {
    uploadPhotos,
    deletePhoto,
    isLoading,
    error,
    uploadedUrls
  };
};