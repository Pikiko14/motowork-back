import { Schema, model } from "mongoose";
import {
  TypeBanner,
  BannerImageInterface,
  BannersInterface,
  TypeImageBanner,
} from "../interfaces/banners.interface";

const BannersSchema = new Schema<BannersInterface>(
  {
    name: {
      type: String,
      default: "",
      required: true,
    },
    link: {
      type: String,
      default: "",
      required: true,
    },
    type: {
      type: String,
      default: TypeBanner.home,
      required: true,
    },
    images: [
      {
        path: {
          type: String,
          default: "",
          required: true,
        },
        type: {
          type: String,
          default: TypeImageBanner.desktop,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const BannersModel = model("banners", BannersSchema);

export default BannersModel;
