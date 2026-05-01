import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePhotoUpload } from '@/hooks/usePhotoUpload';
import { validatePhoto, MAX_PHOTOS } from '@/utils/photoValidation';
import { useToast } from '@/components/ui/use-toast';

/**
 * PhotoUploader component for managing up to 4 photos
 * @param {Object} props
 * @param {number} props.maxPhotos - Maximum number of photos allowed (default 4)
 * @param {Function} props.onPhotosChange - Callback when photos change (receives array of URLs)
 * @param {string[]} props.initialPhotos - Initial photos to display
 * @param {string} props.folder - Supabase Storage folder path
 */
const PhotoUploader = ({
  maxPhotos = MAX_PHOTOS,
  onPhotosChange,
  initialPhotos = [],
  folder = 'general'
}) => {
  const [photos, setPhotos] = useState(initialPhotos);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);
  const { uploadPhotos, deletePhoto, isLoading } = usePhotoUpload(folder);
  const { toast } = useToast();

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    await handleFiles(files);
  };

  const handleFileInput = async (e) => {
    const files = Array.from(e.target.files);
    await handleFiles(files);
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFiles = async (files) => {
    const remainingSlots = maxPhotos - photos.length;
    
    if (files.length > remainingSlots) {
      toast({
        variant: "destructive",
        title: "Demasiadas fotos",
        description: `Solo puedes agregar ${remainingSlots} foto(s) más.`,
      });
      return;
    }

    // Validate all files before uploading
    for (const file of files) {
      const validation = validatePhoto(file, photos.length);
      if (!validation.valid) {
        toast({
          variant: "destructive",
          title: "Error de validación",
          description: validation.error,
        });
        return;
      }
    }

    // Upload photos
    const uploadedUrls = await uploadPhotos(files, photos.length);

    if (uploadedUrls.length > 0) {
      const newPhotos = [...photos, ...uploadedUrls];
      setPhotos(newPhotos);
      onPhotosChange?.(newPhotos);
      
      toast({
        title: "Fotos subidas",
        description: `${uploadedUrls.length} foto(s) subida(s) exitosamente.`,
      });
    }
  };

  const handleDeletePhoto = async (index) => {
    const photoUrl = photos[index];
    
    const success = await deletePhoto(photoUrl);
    
    if (success) {
      const newPhotos = photos.filter((_, i) => i !== index);
      setPhotos(newPhotos);
      onPhotosChange?.(newPhotos);
      
      toast({
        title: "Foto eliminada",
        description: "La foto ha sido eliminada exitosamente.",
      });
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo eliminar la foto.",
      });
    }
  };

  const handleAddClick = () => {
    fileInputRef.current?.click();
  };

  const canAddMore = photos.length < maxPhotos;

  return (
    <div className="space-y-4">
      {/* Photo Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {photos.map((photoUrl, index) => (
          <div
            key={index}
            className="relative aspect-square rounded-lg overflow-hidden border-2 border-gray-200 bg-gray-50 group"
          >
            <img
              src={photoUrl}
              alt={`Foto ${index + 1}`}
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={() => handleDeletePhoto(index)}
              disabled={isLoading}
              className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}

        {/* Add Photo Button */}
        {canAddMore && (
          <button
            type="button"
            onClick={handleAddClick}
            disabled={isLoading}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`aspect-square rounded-lg border-2 border-dashed flex flex-col items-center justify-center gap-2 transition-all ${
              dragActive
                ? 'border-[#C8A94B] bg-[#C8A94B]/10'
                : 'border-gray-300 hover:border-[#C8A94B] hover:bg-gray-50'
            } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
                <span className="text-sm text-gray-500 font-medium">Subiendo...</span>
              </>
            ) : (
              <>
                <Upload className="w-8 h-8 text-gray-400" />
                <span className="text-sm text-gray-500 font-medium">Agregar foto</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        multiple
        onChange={handleFileInput}
        className="hidden"
      />

      {/* Info Text */}
      <div className="flex items-start gap-2 text-sm text-gray-600">
        <ImageIcon className="w-4 h-4 mt-0.5 flex-shrink-0" />
        <div>
          <p className="font-medium">
            {photos.length} de {maxPhotos} fotos
          </p>
          <p className="text-xs mt-1">
            Formatos: JPG, PNG, WebP • Tamaño máximo: 5MB por foto
          </p>
        </div>
      </div>
    </div>
  );
};

export default PhotoUploader;