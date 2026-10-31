/**
 * Image processing utilities for CV photo upload
 */

/**
 * Processes an image file from the user's computer:
 * 1. Reads file as Data URL.
 * 2. Crops centered square (1:1 aspect ratio).
 * 3. Resizes to max 500x500 pixels.
 * 4. Encodes as JPEG Base64 data URI (0.95) for maximum sharpness and flawless PDF export.
 */
export const processImageFile = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith("image/")) {
      reject(new Error("El archivo seleccionado no es una imagen válida."));
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Error al leer el archivo."));
    reader.onload = (e) => {
      const src = e.target?.result as string;
      if (!src) {
        reject(new Error("No se pudo leer el contenido de la imagen."));
        return;
      }

      const img = new Image();
      img.onerror = () => reject(new Error("No se pudo decodificar la imagen seleccionada."));
      img.onload = () => {
        try {
          const w = img.naturalWidth || img.width;
          const h = img.naturalHeight || img.height;

          if (w === 0 || h === 0) {
            reject(new Error("Dimensiones de imagen inválidas."));
            return;
          }

          // Center crop 1:1 square
          const minDim = Math.min(w, h);
          const sx = (w - minDim) / 2;
          const sy = (h - minDim) / 2;

          // Cap at max 500x500
          const targetSize = Math.min(500, minDim);

          const canvas = document.createElement("canvas");
          canvas.width = targetSize;
          canvas.height = targetSize;

          const ctx = canvas.getContext("2d");
          if (!ctx) {
            reject(new Error("No se pudo inicializar el contexto de renderizado de imagen."));
            return;
          }

          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = "high";

          ctx.drawImage(img, sx, sy, minDim, minDim, 0, 0, targetSize, targetSize);

          const base64 = canvas.toDataURL("image/jpeg", 0.95);
          resolve(base64);
        } catch (err) {
          reject(err);
        }
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
  });
};
