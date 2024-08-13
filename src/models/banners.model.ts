import { Schema, model, Types } from "mongoose";
import {
  TypeBanner,
  BannerImageInterface,
  BannersInterface,
  TypeImageBanner,
} from "../interfaces/banners.interface";

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
    images: [BannerImageSchema],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

BannersSchema.index({ type: 1 }); // Índice para el campo type

const BannersModel = model("banners", BannersSchema);

export default BannersModel;
