/**
 * Photo validation utility functions
 * Validates photo format, size, and count
 */

const ALLOWED_FORMATS = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes
const MAX_PHOTO_COUNT = 4;

/**
 * Validates if the photo format is allowed
 * @param {File} file - The file to validate
 * @returns {boolean} - True if format is valid
 */
export const validatePhotoFormat = (file) => {
  return ALLOWED_FORMATS.includes(file.type);
};

/**
 * Validates if the photo size is within limits
 * @param {File} file - The file to validate
 * @returns {boolean} - True if size is valid
 */
export const validatePhotoSize = (file) => {
  return file.size <= MAX_FILE_SIZE;
};

/**
 * Validates if the photo count is within limits
 * @param {number} currentCount - Current number of photos
 * @returns {boolean} - True if count is valid
 */
export const validatePhotoCount = (currentCount) => {
  return currentCount < MAX_PHOTO_COUNT;
};

/**
 * Gets user-friendly error message for validation failures
 * @param {string} errorType - Type of error ('format', 'size', 'count')
 * @param {File} file - Optional file that failed validation
 * @returns {string} - User-friendly error message
 */
export const getPhotoError = (errorType, file = null) => {
  switch (errorType) {
    case 'format':
      return `El formato del archivo ${file?.name || ''} no es válido. Solo se permiten JPG, PNG y WebP.`;
    case 'size':
      const sizeMB = file ? (file.size / (1024 * 1024)).toFixed(2) : 0;
      return `El archivo ${file?.name || ''} (${sizeMB}MB) supera el tamaño máximo de 5MB.`;
    case 'count':
      return `Solo puedes subir un máximo de ${MAX_PHOTO_COUNT} fotos.`;
    case 'upload':
      return 'Error al subir la foto. Por favor, intenta de nuevo.';
    case 'delete':
      return 'Error al eliminar la foto. Por favor, intenta de nuevo.';
    default:
      return 'Error desconocido al procesar la foto.';
  }
};

/**
 * Validates a file against all constraints
 * @param {File} file - The file to validate
 * @param {number} currentPhotoCount - Current number of photos
 * @returns {{ valid: boolean, error: string|null }}
 */
export const validatePhoto = (file, currentPhotoCount = 0) => {
  if (!validatePhotoCount(currentPhotoCount)) {
    return { valid: false, error: getPhotoError('count') };
  }

  if (!validatePhotoFormat(file)) {
    return { valid: false, error: getPhotoError('format', file) };
  }

  if (!validatePhotoSize(file)) {
    return { valid: false, error: getPhotoError('size', file) };
  }

  return { valid: true, error: null };
};

export const MAX_PHOTOS = MAX_PHOTO_COUNT;