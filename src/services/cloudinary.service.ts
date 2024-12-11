import {
  v2 as cloudinary,
  UploadApiResponse,
  UploadApiErrorResponse,
} from "cloudinary";

import configuration from "../../configuration/configuration";

cloudinary.config({
  cloud_name: configuration.get("CLOUDINARY_CLOUD_NAME"),
  api_key: configuration.get("CLOUDINARY_API_KEY"),
  api_secret: configuration.get("CLOUDINARY_API_SECRET"),
});

export class CloudinaryService {
  /**
   * Sube una imagen a Cloudinary.
   * @param fileBuffer - El buffer del archivo a subir.
   * @param folder - Carpeta en la que se guardará la imagen.
   * @returns Promesa con la respuesta de la API de Cloudinary.
   */
  async uploadImage(
    fileBuffer: Buffer,
    folder: string,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder }, (error: any, result: any) => {
          if (error) return reject(error);
          resolve(result);
        })
        .end(fileBuffer);
    });
  }

  /**
   * Elimina una imagen de Cloudinary usando su URL.
   * @param imageUrl - La URL completa de la imagen en Cloudinary.
   * @returns Promesa con el resultado de la eliminación.
   */
  async deleteImageByUrl(imageUrl: string): Promise<any> {
    // Extraer el public_id de la URL de Cloudinary
    const publicId = this.extractPublicId(imageUrl);

    if (!publicId) {
      return false;
    }

    const clearId = imageUrl.split(publicId);
    const publicIdCleared = clearId[1].substring(1).split('.')[0];

    return new Promise((resolve, reject) => {
      const result = cloudinary.api.delete_resources([publicIdCleared], {
        type: "upload",
        resource_type: "image",
      })
      resolve(result);
    })
  }

  /**
   * Sube múltiples archivos a Cloudinary.
   * @param fileBuffers - Array de Buffers de los archivos.
   * @param folder - Carpeta en la que se guardarán las imágenes.
   * @returns Promesa con las respuestas de la API de Cloudinary.
   */
  async uploadMultipleFiles(
    fileBuffers: Buffer[],
    folder: string
  ): Promise<any[]> {
    // Reutiliza uploadImage para manejar cada buffer individualmente
    const uploadPromises = fileBuffers.map((fileBuffer) =>
      this.uploadImage(fileBuffer, folder)
    );

    try {
      const results = await Promise.all(uploadPromises); // Ejecuta las subidas en paralelo
      return results;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Extrae el public_id de la URL de Cloudinary.
   * @param url - La URL de la imagen de Cloudinary.
   * @returns El public_id extraído.
   */
  private extractPublicId(url: string): string | null {
    const regex = /upload\/([^\/?]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  }
}
