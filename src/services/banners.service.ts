import { Response } from "express";
import { Utils } from "../utils/utils";
import { ResponseHandler } from "../utils/responseHandler";
import {
  BannerImageInterface,
  BannersInterface,
  TypeImageBanner,
} from "../types/banners.interface";
import BannersRepository from "../repositories/banners.repository";
import { ResponseRequestInterface } from "../types/response.interface";
import { PaginationInterface } from "../types/req-ext.interface";

export class BannersService extends BannersRepository {
  private utils: Utils;
  public path: String;

  constructor() {
    super();
    this.path = "/banners/";
    this.utils = new Utils();
  }

  /**
   * create new banners
   * @param { Response } res Express response
   * @param { BannersInterface } body body request
   * @param { any } files array of files uploaded
   * @return { ResponseRequestInterface }
   */
  public async createBanners(
    res: Response,
    body: BannersInterface,
    files: {
      imagesTablet: Express.Multer.File[];
      imagesMobile: Express.Multer.File[];
      imagesDesktop: Express.Multer.File[];
    }
  ): Promise<void | ResponseRequestInterface> {
    try {
      // init images array and get destructuration of files
      const images: BannerImageInterface[] = [];
      const { imagesTablet, imagesDesktop, imagesMobile } = files;
      if (!imagesTablet || !imagesDesktop || !imagesMobile) {
        throw new Error("Debes ingresar todas las imagenes necesarias del banner");
      }

      // set images desktop
      images.push({
        path: `${this.path}${imagesDesktop[0] ? imagesDesktop[0].filename : ""}`,
        type: TypeImageBanner.desktop,
      });

      // set image mobile
      images.push({
        path: `${this.path}${imagesMobile[0] ? imagesMobile[0].filename : ""}`,
        type: TypeImageBanner.mobile,
      });

      // set image table
      images.push({
        path: `${this.path}${imagesTablet[0] ? imagesTablet[0].filename : ""}`,
        type: TypeImageBanner.tablet,
      });

      // save images on banner
      body.images = images;
      const banner: BannersInterface = await this.create(body) as BannersInterface;

      // return response
      return ResponseHandler.createdResponse(
        res,
        banner,
        "Banner creado correctamente."
      );
    } catch (error: any) {
      throw error.message;
    }
  }

  /**
   * List banners
   * @param { Response } res
   * @param query query of list
   * @return { ResponseRequestInterface | void }
   */
  public async listBanners(res: Response, query: PaginationInterface) {
    try {
      // validamos la data de la paginacion
      const page: number = query.page as number || 1;
      const perPage: number = query.perPage as number || 12;
      const skip = (page - 1) * perPage;

      // Iniciar busqueda
      let queryObj: any = {};
      if (query.search) {
        const searchRegex = new RegExp(query.search as string, 'i');
        queryObj = {
          $or: [
            { name: searchRegex },
            { link: searchRegex },
            { type: searchRegex },
          ],
        };
      }

      // validate is active
      if (query.is_active) {
        queryObj.is_active = query.is_active;
      }

      // do query
      const banners = await this.paginate(queryObj, skip, perPage);

      // return data
      return ResponseHandler.successResponse(
        res,
        {
          banners: banners.data,
          totalItems: banners.totalItems
        },
        "Banner creado correctamente."
      );
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
}
