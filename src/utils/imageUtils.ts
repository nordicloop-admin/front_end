/**
 * Utility functions for handling image URLs
 */

// Get the base API URL without the /api suffix for media files
const getMediaBaseUrl = (): string => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://nordic-loop-platform.onrender.com/api';
  // Remove /api from the end if it exists
  return apiUrl.replace(/\/api$/, '');
};

/**
 * Helper function to get full image URL from backend path
 * @param imagePath The image path from the backend
 * @returns Full URL for the image
 */
export const getFullImageUrl = (imagePath: string | null | undefined): string => {
  if (!imagePath) return '';
  
  const baseUrl = getMediaBaseUrl();
  
  // If it's already a full URL, return as is
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  
  // If it starts with /media/, construct the full URL
  if (imagePath.startsWith('/media/')) {
    return `${baseUrl}${imagePath}`;
  }
  
  // If it's just a filename, assume it's in the material_images directory
  if (!imagePath.startsWith('/')) {
    return `${baseUrl}/media/material_images/${imagePath}`;
  }
  
  return `${baseUrl}${imagePath}`;
}; 