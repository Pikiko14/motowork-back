import { Response } from "express";
import { Utils } from "../utils/utils";
import { CloudinaryService } from "./cloudinary.service";
import { ResponseHandler } from "../utils/responseHandler";
import { PaginationInterface } from "../types/req-ext.interface";
import { CategoriesInterface } from "../types/categories.interface";
import CategoriesRepository from "../repositories/categories.repository";

export class CategoriesService extends CategoriesRepository {
  private utils: Utils;
  public path: String;
  public folder: string = "categories";
  public cloudinaryService: CloudinaryService;

  constructor(
  ) {
    super();
    this.utils = new Utils();
    this.path = "/categories/";
    this.cloudinaryService = new CloudinaryService();
  }

  /**
   * Create category
   * @param { Response } res Express response
   * @param { CategoriesInterface } body CategoriesInterface
   * @param { Express.Multer.File } file Express.Multer.File
   */
  public async createCategory(
    res: Response,
    body: CategoriesInterface,
    file: Express.Multer.File
  ): Promise<void | ResponseHandler> {
    try {
      // validate file
      const category = (await this.create(body)) as CategoriesInterface;

      // set file
      if (file) {
        const imgBuffer = await this.utils.generateBuffer(file.path);
        const fileResponse = await this.cloudinaryService.uploadImage(imgBuffer, this.folder);
        category.icon = fileResponse.secure_url;
        await this.utils.deleteItemFromStorage(`${this.path}${file ? file.filename : ""}`);
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

  /**
   * List categories
   * @param { Response } res Express response
   * @param { PaginationInterface } query query of list
   * @return { Promise<void | ResponseRequestInterface> }
   */
  public async getCategories(
    res: Response,
    query: PaginationInterface
  ): Promise<void | ResponseHandler> {
    try {
        // validamos la data de la paginacion
      const page: number = (query.page as number) || 1;
      const perPage: number = (query.perPage as number) || 7;
      const skip = (page - 1) * perPage;

      // Iniciar busqueda
      let queryObj: any = {};
      if (query.search) {
        const searchRegex = new RegExp(query.search as string, "i");
        queryObj = {
          $or: [
            { name: searchRegex },
          ],
        };
      }

      // validate is active
      if (query.is_active) {
        queryObj.is_active = query.is_active;
      }

      // type category
      if (query.type) {
        queryObj.type = query.type;
      }

      // do query
      const categories = await this.paginate(queryObj, skip, perPage, query.sortBy, query.order);

      // return data
      return ResponseHandler.successResponse(
        res,
        {
          categories: categories.data,
          totalItems: categories.totalItems,
          totalPages: categories.totalPages,
        },
        "Listado de categorías."
      );

    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  /**
   * Show categories
   * @param { Response } res Express response
   * @param { string } id query of list
   * @return { Promise<void | ResponseRequestInterface> }
   */
  public async showCategory(
    res: Response,
    id: string
  ): Promise<void | ResponseHandler> {
    try {
      // get category
      const category = await this.findOneByQuery({ _id: id });

      // return data
      return ResponseHandler.successResponse(
        res,
        category,
        "Información de la categoría."
      );

    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  /**
   * Delete categories
   * @param { Response } res Express response
   * @param { string } id query of list
   * @return { Promise<void | ResponseRequestInterface> }
   */
  public async deleteCategory(
    res: Response,
    id: string
  ): Promise<void | ResponseHandler> {
    try {
      // get category
      const category = await this.delete(id);

      // return data
      return ResponseHandler.successResponse(
        res,
        category,
        "Categoría eliminada correctamente."
      );

    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  /**
   * Update category
   * @param { Response } res Express response
   * @param { string } id query of list
   * @param { CategoriesInterface } body CategoriesInterface
   * @param { Express.Multer.File } file Express.Multer.File
   */
  public async updateCategories(
    res: Response,
    id: string,
    body: CategoriesInterface,
    file: Express.Multer.File
  ) {
    try {
      // validate file
      const category = await this.update(id, body) as CategoriesInterface;

      // set file
      if (file) {
        // delete old icon
        if (category.icon) {
          await this.cloudinaryService.deleteImageByUrl(category.icon);
        }
        const imgBuffer = await this.utils.generateBuffer(file.path);
        const fileResponse = await this.cloudinaryService.uploadImage(imgBuffer, this.folder);

        // save new icon
        category.icon = fileResponse.secure_url;
        await this.utils.deleteItemFromStorage(`${this.path}${file ? file.filename : ""}`);
        await this.update(category._id, category);
      }

      // return response
      return ResponseHandler.successResponse(
        res,
        category,
        "Categoría modificada correctamente."
      );
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  /**
   * Change category status
   * @param { Response } res Express response
   * @param { string } id query of list
   * @param { CategoriesInterface } body CategoriesInterface
   * @param { Express.Multer.File } file Express.Multer.File
   */
  public async changeCategoryStatus(
    res: Response,
    id: string
  ) {
    try {
      // validate file
      const category = await this.findOneByQuery({ _id: id });

      // update status
      if (category) {
        category.is_active = !category.is_active;
        await this.update(category._id, category);
      }

      // return response
      return ResponseHandler.successResponse(
        res,
        category,
        "Estado cambiado correctamente."
      );
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
}
