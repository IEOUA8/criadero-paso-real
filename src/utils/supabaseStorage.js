import { supabase } from '@/lib/customSupabaseClient';

/**
 * Supabase Storage utility functions for photo management
 */

const STORAGE_BUCKET = 'animal-photos';

/**
 * Uploads a photo to Supabase Storage and returns the public URL
 * @param {File} file - The file to upload
 * @param {string} folder - The folder path (e.g., 'productos', 'vientres', 'reproductores')
 * @returns {Promise<{url: string|null, error: string|null}>}
 */
export const uploadPhotoToStorage = async (file, folder = 'general') => {
  try {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const fileExt = file.name.split('.').pop();
    const fileName = `${timestamp}_${randomString}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Error uploading photo:', error);
      return { url: null, error: error.message };
    }

    const publicUrl = getPublicPhotoUrl(data.path);
    return { url: publicUrl, error: null };
  } catch (error) {
    console.error('Unexpected error uploading photo:', error);
    return { url: null, error: error.message };
  }
};

/**
 * Deletes a photo from Supabase Storage
 * @param {string} photoUrl - The public URL of the photo to delete
 * @returns {Promise<{success: boolean, error: string|null}>}
 */
export const deletePhotoFromStorage = async (photoUrl) => {
  try {
    const filePath = extractFilePathFromUrl(photoUrl);
    
    if (!filePath) {
      return { success: false, error: 'Invalid photo URL' };
    }

    const { error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .remove([filePath]);

    if (error) {
      console.error('Error deleting photo:', error);
      return { success: false, error: error.message };
    }

    return { success: true, error: null };
  } catch (error) {
    console.error('Unexpected error deleting photo:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Generates a public URL for a file path in Supabase Storage
 * @param {string} filePath - The file path in storage
 * @returns {string} - The public URL
 */
export const getPublicPhotoUrl = (filePath) => {
  const { data } = supabase.storage
    .from(STORAGE_BUCKET)
    .getPublicUrl(filePath);

  return data.publicUrl;
};

/**
 * Extracts the file path from a Supabase Storage public URL
 * @param {string} url - The public URL
 * @returns {string|null} - The file path or null if invalid
 */
const extractFilePathFromUrl = (url) => {
  try {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split(`/${STORAGE_BUCKET}/`);
    return pathParts.length > 1 ? pathParts[1] : null;
  } catch (error) {
    console.error('Error extracting file path from URL:', error);
    return null;
  }
};

/**
 * Ensures the storage bucket exists (call once on app init)
 * @returns {Promise<{success: boolean, error: string|null}>}
 */
export const ensureStorageBucket = async () => {
  try {
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();

    if (listError) {
      console.error('Error listing buckets:', listError);
      return { success: false, error: listError.message };
    }

    const bucketExists = buckets.some(bucket => bucket.name === STORAGE_BUCKET);

    if (!bucketExists) {
      const { error: createError } = await supabase.storage.createBucket(STORAGE_BUCKET, {
        public: true,
        fileSizeLimit: 5242880, // 5MB
        allowedMimeTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
      });

      if (createError) {
        console.error('Error creating bucket:', createError);
        return { success: false, error: createError.message };
      }
    }

    return { success: true, error: null };
  } catch (error) {
    console.error('Unexpected error ensuring storage bucket:', error);
    return { success: false, error: error.message };
  }
};