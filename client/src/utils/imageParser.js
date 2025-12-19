/**
 * Safely parse product images from database
 * Handles: JSON strings, arrays, single URLs, null/undefined
 */
export const parseProductImages = (images) => {
  if (!images) return [];
  
  // If already an array, return it
  if (Array.isArray(images)) {
    return images;
  }
  
  // If it's a string, try to parse it
  if (typeof images === 'string') {
    // Check if it looks like a JSON array/object
    const trimmed = images.trim();
    if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
      try {
        const parsed = JSON.parse(images);
        // If parsed result is an array, return it
        if (Array.isArray(parsed)) {
          return parsed;
        }
        // If it's an object, try to extract array from it
        if (typeof parsed === 'object' && parsed !== null) {
          return Object.values(parsed).filter(v => typeof v === 'string');
        }
        // If it's a single string, wrap in array
        return [parsed];
      } catch (e) {
        // If JSON parsing fails, treat as single URL string
        return [images];
      }
    } else {
      // It's a plain string URL, return as array
      return [images];
    }
  }
  
  // Fallback: return empty array
  return [];
};




