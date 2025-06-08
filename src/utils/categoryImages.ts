/**
 * Utility functions for handling category images
 */

// Category image mappings
const categoryImages: Record<string, string> = {
  'Plastics': '/images/marketplace/categories/plastics.jpg',
  'Metals': '/images/marketplace/categories/metals.jpg',
  'Paper': '/images/marketplace/categories/paper.jpg',
  'Glass': '/images/marketplace/categories/glass.jpg',
  'Textiles': '/images/marketplace/categories/textiles.jpg',
  'Wood': '/images/marketplace/categories/wood.jpg',
  'Electronics': '/images/marketplace/categories/electronics.jpg',
  'Chemicals': '/images/marketplace/categories/chemicals.jpg',
  'Construction': '/images/marketplace/categories/construction.jpg',
  'Rubber': '/images/marketplace/categories/rubber.jpg',
  'Organic': '/images/marketplace/categories/organic.jpg',
  'Other': '/images/marketplace/categories/other.jpg'
};

/**
 * Get the image URL for a specific category
 * @param category The category name
 * @returns The image URL for the category or a default fallback
 */
export const getCategoryImage = (category: string): string => {
  return categoryImages[category] || '/images/marketplace/categories/plastics.jpg';
};

/**
 * Get all available category images
 * @returns Record of all category images
 */
export const getAllCategoryImages = (): Record<string, string> => {
  return { ...categoryImages };
};

/**
 * Check if a category has a specific image
 * @param category The category name
 * @returns Whether the category has a specific image or uses fallback
 */
export const hasCategoryImage = (category: string): boolean => {
  return category in categoryImages;
};

/**
 * Get the fallback category image
 * @returns The default fallback image URL
 */
export const getFallbackCategoryImage = (): string => {
  return '/images/marketplace/categories/plastics.jpg';
}; 