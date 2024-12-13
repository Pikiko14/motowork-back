import { Schema, model, Types } from "mongoose";
import {
  CategoriesInterface,
  TypeCategory,
} from "../types/categories.interface";
import { TaskQueue } from '../queues/cloudinary.queue';

const folder = 'categories';
const path = '/categories/';

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

// propiedades virtuales para calcular los count_news
CategoriesSchema.virtual("count_news").get(function () {
  const count = 10;
  return count;
});


CategoriesSchema.virtual("count_used").get(function () {
  const count = 5; //await SomeOtherModel.countDocuments({ categoryId: this._id, condition: "used" })
  return count;
});


CategoriesSchema.set("toObject", { virtuals: true });
CategoriesSchema.set("toJSON", { virtuals: true });

// Middleware para eliminar imágenes antes de borrar un documento
CategoriesSchema.pre(
  "findOneAndDelete",
  { document: true, query: true },
  async function (next: any) {
    const category: CategoriesInterface = await this.model
      .findOne(this.getQuery())
      .exec();
    try {
      if (category.icon) {
        const queue = new TaskQueue("cloudinary_base_microservice");
        await queue.addJob(
          { taskType: 'deleteFile', payload: { icon: category.icon, folder, path } },
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

const CategoriesModel = model<CategoriesInterface>(
  "categories",
  CategoriesSchema
);

export default CategoriesModel;
