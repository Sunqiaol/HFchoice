import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { app } from '../firebase';
import { FIREBASE_CONFIG } from '../constants';

export const sanitizeCodigo = (codigo) => {
  return codigo.replace(/[^a-zA-Z0-9-_.]/g, '');
};

export const sanitizeCodigoForFilename = (codigo) => {
  // For Firebase Storage, we need to handle dots specially
  // Replace dots with underscores to avoid URL issues
  return codigo.replace(/[^a-zA-Z0-9-_]/g, '_');
};

export const getImageUrl = (codigo) => {
  // Try the sanitized version first (without dots)
  const sanitizedCodigo = sanitizeCodigoForFilename(codigo);
  return `${FIREBASE_CONFIG.STORAGE_URL}${encodeURIComponent(sanitizedCodigo)}.jpg?alt=media`;
};

// Alternative function to try different naming strategies
export const getImageUrlWithFallback = (codigo) => {
  // This will be used by components to try multiple image URL formats
  const strategies = [
    // Strategy 1: Replace dots with underscores
    codigo.replace(/[^a-zA-Z0-9-_]/g, '_'),
    // Strategy 2: Remove all special characters
    codigo.replace(/[^a-zA-Z0-9-_]/g, ''),
    // Strategy 3: URL encode the original
    encodeURIComponent(codigo)
  ];
  
  return strategies.map(sanitized => 
    `${FIREBASE_CONFIG.STORAGE_URL}${sanitized}.jpg?alt=media`
  );
};

export const uploadImageToStorage = async (file, codigo) => {
  const storage = getStorage(app);
  // Use the filename-safe version for uploads
  const sanitizedCodigo = sanitizeCodigoForFilename(codigo);
  const imageRef = ref(storage, `image/${sanitizedCodigo}.jpg`);
  
  const snapshot = await uploadBytes(imageRef, file);
  const downloadURL = await getDownloadURL(imageRef);
  
  return { success: true, url: downloadURL };
};

export const deleteImageFromStorage = async (codigo) => {
  const storage = getStorage(app);
  // Use the filename-safe version for deletes
  const sanitizedCodigo = sanitizeCodigoForFilename(codigo);
  const imageRef = ref(storage, `image/${sanitizedCodigo}.jpg`);
  
  await deleteObject(imageRef);
  return { success: true };
};