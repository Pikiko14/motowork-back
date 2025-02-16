import { Response } from "express";
import { TaskQueue } from "../queues/cloudinary.queue";
import { RedisImplement } from "./cache/redis.services";
import { CloudinaryService } from "./cloudinary.service";
import { ResponseHandler } from "../utils/responseHandler";
import { PaginationInterface } from "../types/req-ext.interface";
import { CategoriesInterface } from "../types/categories.interface";
import CategoriesRepository from "../repositories/categories.repository";

export class CategoriesService extends CategoriesRepository {
  public path: string;
  public queue: any;
  public cloudinaryService: CloudinaryService;
  public folder = "categories";

  constructor() {
    super();
    this.path = "/categories/";
    this.queue = new TaskQueue("cloudinary_base_microservice");
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
        // await this.update(category._id, category);
        await this.queue.addJob(
          { taskType: "uploadFile", payload: { file, entity: category, folder: this.folder, path: this.path } },
          { attempts: 3, backoff: 5000 }
        );
      }

      // clear cache
      await this.clearCacheInstances();

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
      // validate in cache
      const redisCache = RedisImplement.getInstance();
      const cacheKey = `categories:${JSON.stringify(query)}`;
      const cachedData = await redisCache.getItem(cacheKey);
      if (cachedData) {
        return ResponseHandler.successResponse(
          res,
          cachedData,
          "Listado de categorías (desde caché)."
        );
      }

      // validamos la data de la paginacion
      const page: number = (query.page as number) || 1;
      const perPage: number = (query.perPage as number) || 7;
      const skip = (page - 1) * perPage;

      // Iniciar busqueda
      let queryObj: any = {};
      if (query.search) {
        const searchRegex = new RegExp(query.search as string, "i");
        queryObj = {
          $or: [{ name: searchRegex }],
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
      const fields = query.fields ? query.fields.split(',') : [];
      const categories = await this.paginate(
        queryObj,
        skip,
        perPage,
        query.sortBy,
        query.order,
        fields
      );

      // Guardar la respuesta en Redis por 10 minutos
      await redisCache.setItem(
        cacheKey,
        {
          categories: categories.data,
          totalItems: categories.totalItems,
          totalPages: categories.totalPages,
        },
        600
      );

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

      // clear cache
      await this.clearCacheInstances();

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
      const category = (await this.update(id, body)) as CategoriesInterface;

      // set file
      if (file) {
        // delete old icon
        if (category.icon) {
          await this.queue.addJob(
            { taskType: 'deleteFile', payload: { icon: category.icon, folder: this.folder } },
            {
              attempts: 3,
              backoff: 5000,
            }
          );
        }
        // upload file icon
        await this.queue.addJob(
          { taskType: "uploadFile", payload: { file, entity: category, folder: this.folder, path: this.path } },
          { attempts: 3, backoff: 5000 }
        );
      }

      // clear cache
      await this.clearCacheInstances();

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
  public async changeCategoryStatus(res: Response, id: string) {
    try {
      // validate file
      const category = await this.findOneByQuery({ _id: id });

      // update status
      if (category) {
        category.is_active = !category.is_active;
        await this.update(category._id, category);
      }

      // clear cache
      await this.clearCacheInstances();

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

  // clear cache instances
  public async clearCacheInstances() {
    const redisCache = RedisImplement.getInstance();
    const keys = await redisCache.getKeys("categories:*");
    if (keys.length > 0) {
      await redisCache.deleteKeys(keys);
      console.log(`🗑️ Cache de categorías limpiado`);
    }
  }
}
