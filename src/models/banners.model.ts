import { Schema, model, Types } from "mongoose";
import {
  TypeBanner,
  BannerImageInterface,
  BannersInterface,
  TypeImageBanner,
} from "../types/banners.interface";
import { TaskQueue } from '../queues/cloudinary.queue';

const folder = "banners";
const path = "/banners/";

const BannerImageSchema = new Schema<BannerImageInterface>({
  path: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: Object.values(TypeImageBanner), // Validación de tipo de imagen
    required: true,
  },
});

const BannersSchema = new Schema<BannersInterface>(
  {
    name: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: Object.values(TypeBanner), // Validación de tipo de banner
      required: true,
    },
    is_active: {
      type: Boolean,
      required: true,
      default: false,
    },
    images: [BannerImageSchema],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

BannersSchema.index({ type: 1 }); // Índice para el campo type

// Middleware para eliminar imágenes antes de borrar un documento
BannersSchema.pre(
  "findOneAndDelete",
  { document: true, query: true },
  async function (next: any) {
    const banner: BannersInterface = await this.model
      .findOne(this.getQuery())
      .exec();
    try {
      for (const image of banner.images) {
        const queue = new TaskQueue("cloudinary_base_microservice");
        await queue.addJob(
          { taskType: 'deleteFile', payload: { icon: image.path, folder, path } },
          {
            attempts: 3,
            backoff: 5000,
          }
        );
      }
      next();
    } catch (error) {
      next(error);
    }
  }
);

const BannersModel = model<BannersInterface>("banners", BannersSchema);

export default BannersModel;
