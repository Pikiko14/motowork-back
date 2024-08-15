import { Response } from "express";
import { Utils } from "../utils/utils";
import { ResponseHandler } from "../utils/responseHandler";
import { CategoriesInterface } from "../types/categories.interface";
import CategoriesRepository from "../repositories/categories.repository";

export class CategoriesService extends CategoriesRepository {
  private utils: Utils;
  public path: String;

  constructor() {
    super();
    this.utils = new Utils();
    this.path = "/categories/";
  }

  /**
   * Create category
   */
  public async createCategory(
    res: Response,
    body: CategoriesInterface,
    file: Express.Multer.File
  ) {
    try {
      // validate file
      const category = await this.create(body) as CategoriesInterface;

      // set file
      if (file) {
        category.icon = `${this.path}${file ? file.filename : ""}`;
        await this.update(category._id, category);
      }

      // return response
      return ResponseHandler.successResponse(
        res,
        category,
        "Categoría creada correctamente."
      );
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
}
