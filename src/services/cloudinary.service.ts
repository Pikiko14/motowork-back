import {
  v2 as cloudinary,
  UploadApiResponse,
  UploadApiErrorResponse,
} from "cloudinary";

import configuration from "../../configuration/configuration";

export class CloudinaryService {
  cloudinary: any;

  constructor() {
    this.cloudinary = cloudinary.config({
      cloud_name: configuration.get("CLOUDINARY_CLOUD_NAME"),
      api_key: configuration.get("CLOUDINARY_API_KEY"),
      api_secret: configuration.get("CLOUDINARY_API_SECRET"),
    });
  }

  /**
   * Sube una imagen a Cloudinary.
   * @param fileBuffer - El buffer del archivo a subir.
   * @param folder - Carpeta en la que se guardará la imagen.
   * @returns Promesa con la respuesta de la API de Cloudinary.
   */
  async uploadImage(
    fileBuffer: Buffer,
    folder: string = "categories"
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      this.cloudinary.uploader
        .upload_stream({ folder }, (error: any, result: any) => {
          if (error) return reject(error);
          resolve(result);
        })
        .end(fileBuffer);
    });
  }
}
