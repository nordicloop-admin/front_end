/**
 * Utility functions for handling image URLs
 */

// Get the backend base URL without the /api suffix for media files
const getBackendBaseUrl = (): string => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
  // Remove /api from the end if it exists
  return apiUrl.replace(/\/api$/, '');
};

/**
 * Helper function to get full image URL from backend path
 * @param imagePath The image path from the backend (can be relative or absolute)
 * @returns Full URL for the image or empty string if no path provided
 */
export const getFullImageUrl = (imagePath: string | null | undefined): string => {
  if (!imagePath) return '';
  
  const backendUrl = getBackendBaseUrl();
  
  // If it's already a full URL, return as is
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  
  // If it starts with /media/, construct the full URL
  if (imagePath.startsWith('/media/')) {
    return `${backendUrl}${imagePath}`;
  }
  
  // If it starts with media/ (no leading slash), add the leading slash
  if (imagePath.startsWith('media/')) {
    return `${backendUrl}/${imagePath}`;
  }
  
  // If it's just a filename, assume it's in the material_images directory
  if (!imagePath.startsWith('/')) {
    return `${backendUrl}/media/${imagePath}`;
  }
  
  // For any other case, append to backend URL
  return `${backendUrl}${imagePath}`;
};

/**
 * Helper function specifically for material images
 * @param imagePath The material image path from the backend
 * @returns Full URL for the material image
 */
export const getMaterialImageUrl = (imagePath: string | null | undefined): string => {
  if (!imagePath) return '';
  
  const backendUrl = getBackendBaseUrl();
  
  // If it's already a full URL, return as is
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  
  // If it already contains the full media path, use it
  if (imagePath.includes('/media/')) {
    return imagePath.startsWith('/') ? `${backendUrl}${imagePath}` : `${backendUrl}/${imagePath}`;
  }
  
  // For just filenames, construct the full material images path
  const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
  return `${backendUrl}/media/material_images/${cleanPath}`;
};

/**
 * Helper function for profile/user images
 * @param imagePath The profile image path from the backend
 * @returns Full URL for the profile image
 */
export const getProfileImageUrl = (imagePath: string | null | undefined): string => {
  if (!imagePath) return '';
  
  const backendUrl = getBackendBaseUrl();
  
  // If it's already a full URL, return as is
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  
  // If it already contains the full media path, use it
  if (imagePath.includes('/media/')) {
    return imagePath.startsWith('/') ? `${backendUrl}${imagePath}` : `${backendUrl}/${imagePath}`;
  }
  
  // For just filenames, construct the full profile images path
  const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
  return `${backendUrl}/media/profile_images/${cleanPath}`;
};

/**
 * Helper function to construct media URL for any type of file
 * @param mediaPath The media file path (should include the media subdirectory)
 * @returns Full URL for the media file
 */
export const getMediaUrl = (mediaPath: string | null | undefined): string => {
  if (!mediaPath) return '';
  
  const backendUrl = getBackendBaseUrl();
  
  // If it's already a full URL, return as is
  if (mediaPath.startsWith('http')) {
    return mediaPath;
  }
  
  // Ensure the path starts with /media/
  let fullPath = mediaPath;
  if (!fullPath.startsWith('/media/')) {
    if (fullPath.startsWith('media/')) {
      fullPath = `/${fullPath}`;
    } else if (fullPath.startsWith('/')) {
      fullPath = `/media${fullPath}`;
    } else {
      fullPath = `/media/${fullPath}`;
    }
  }
  
  return `${backendUrl}${fullPath}`;
};

/**
 * Get the backend base URL (useful for other services)
 * @returns The backend base URL without /api suffix
 */
export const getBackendUrl = (): string => {
  return getBackendBaseUrl();
};

/**
 * Check if an image URL is valid and accessible
 * @param imageUrl The image URL to check
 * @returns Promise that resolves to true if image is accessible
 */
export const isImageAccessible = async (imageUrl: string): Promise<boolean> => {
  if (!imageUrl) return false;
  
  try {
    const response = await fetch(imageUrl, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
};

/**
 * Get a fallback image URL if the provided image is not accessible
 * @param imageUrl The primary image URL
 * @param fallbackUrl The fallback image URL
 * @returns Promise that resolves to the accessible image URL
 */
export const getAccessibleImageUrl = async (
  imageUrl: string, 
  fallbackUrl: string = '/images/placeholder.jpg'
): Promise<string> => {
  if (!imageUrl) return fallbackUrl;
  
  const isAccessible = await isImageAccessible(imageUrl);
  return isAccessible ? imageUrl : fallbackUrl;
}; 