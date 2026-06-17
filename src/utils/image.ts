import { Platform } from 'react-native';

/**
 * Compresses a base64 image data URL on the web using HTML5 Canvas.
 * Resizes the image so that neither its width nor its height exceeds the specified maximums.
 * Converts to JPEG format with the specified quality.
 */
export const compressImage = (
  dataUrl: string,
  maxWidth = 1024,
  maxHeight = 1024,
  quality = 0.7
): Promise<string> => {
  if (Platform.OS !== 'web') {
    return Promise.resolve(dataUrl);
  }

  // If it's not a data URL or not an image data URL, return it as is
  if (!dataUrl.startsWith('data:image/')) {
    return Promise.resolve(dataUrl);
  }

  return new Promise((resolve) => {
    const img = new window.Image();
    img.src = dataUrl;
    
    img.onload = () => {
      let width = img.width;
      let height = img.height;

      // Calculate new dimensions while maintaining aspect ratio
      if (width > height) {
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Draw image with new dimensions
        ctx.drawImage(img, 0, 0, width, height);
        // Get the compressed JPEG data URL
        resolve(canvas.toDataURL('image/jpeg', quality));
      } else {
        resolve(dataUrl);
      }
    };

    img.onerror = () => {
      resolve(dataUrl);
    };
  });
};
