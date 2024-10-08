import { Schema, model, Types } from "mongoose";
import {
  CategoriesInterface,
  TypeCategory,
} from "../types/categories.interface";
import { Utils } from "../utils/utils";

const utils = new Utils();

const CategoriesSchema = new Schema<CategoriesInterface>(
  {
    name: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      required: false,
      default: "",
    },
    is_active: {
      type: Boolean,
      required: false,
      default: true,
    },
    type: {
      type: String,
      enum: Object.values(TypeCategory),
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

CategoriesSchema.index({ type: 1 }); // Índice para el campo type

// Middleware para eliminar imágenes antes de borrar un documento
CategoriesSchema.pre(
  "findOneAndDelete",
  { document: true, query: true },
  async function (next: any) {
    const category: CategoriesInterface = await this.model
      .findOne(this.getQuery())
      .exec();
    try {
      await utils.deleteItemFromStorage(category.icon);
      next();
    } catch (error) {
      next(error);
    }
  }
);

const CategoriesModel = model<CategoriesInterface>(
  "categories",
  CategoriesSchema
);

export default CategoriesModel;
