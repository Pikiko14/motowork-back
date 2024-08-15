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
        throw new Error(
          "Debes ingresar todas las imagenes necesarias del banner: (images_tablet, images_mobile, images_desktop)"
        );
      }

      // set images desktop
      images.push({
        path: `${this.path}${
          imagesDesktop[0] ? imagesDesktop[0].filename : ""
        }`,
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

      // validate if exist one banner active and desactivate by type
      if (body.is_active) await this.disableIsActive(body.type);

      // save images on banner
      body.images = images;
      const banner: BannersInterface = (await this.create(
        body
      )) as BannersInterface;

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
   * @param { PaginationInterface } query query of list
   * @return { ResponseRequestInterface | void }
   */
  public async listBanners(res: Response, query: PaginationInterface) {
    try {
      // validamos la data de la paginacion
      const page: number = (query.page as number) || 1;
      const perPage: number = (query.perPage as number) || 12;
      const skip = (page - 1) * perPage;

      // Iniciar busqueda
      let queryObj: any = {};
      if (query.search) {
        const searchRegex = new RegExp(query.search as string, "i");
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
          totalItems: banners.totalItems,
          totalPages: banners.totalPages,
        },
        "Listado de banners."
      );
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  /**
   * Show banner
   * @param { Response } res Express response
   * @param { string } id
   * @returns Promise<void>
   */
  public async showBanner(res: Response, id: string): Promise<void | ResponseRequestInterface> {
    try {
      const banner = await this.getById(id);

      // return response
      return ResponseHandler.successResponse(
        res,
        banner,
        "Información del banner."
      );
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  /**
   * Delete banner
   * @param { Response } res Express response
   * @param { string } id
   * @returns Promise<void>
   */
  public async deleteBanner(res: Response, id: string): Promise<void | ResponseRequestInterface> {
    try {
      const banner = await this.delete(id);

      // return response
      return ResponseHandler.successResponse(
        res,
        banner,
        "Información del banner."
      );
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  /**
   * Update banner
   * @param { Response } res Express response
   * @param { string } id Id banner to update
   * @param { BannersInterface } body Data to update
   * @returns Promise<void>
   */
  public async updateBanner(
    res: Response,
    id: string,
    body: BannersInterface,
    files: {
      imagesTablet: Express.Multer.File[];
      imagesMobile: Express.Multer.File[];
      imagesDesktop: Express.Multer.File[];
    }
  ): Promise<void | ResponseRequestInterface> {
    try {
      // get banner by id
      const banner = await this.getById(id);

      // get preview images
      const images: BannerImageInterface[] = banner?.images || [];

      // validate files and process
      const { imagesTablet, imagesDesktop, imagesMobile } = files;

      // validate image desktop
      if (imagesDesktop) {
        // validate preview data
        const previewImageDesktop = images.find(
          (item: BannerImageInterface) => {
            return item.type === TypeImageBanner.desktop;
          }
        );
        const previewImageDesktopIndex = images.findIndex(
          (item: BannerImageInterface) => {
            return item.type === TypeImageBanner.desktop;
          }
        );

        // delete preview data
        if (previewImageDesktopIndex !== -1)
          images.splice(previewImageDesktopIndex, 1);

        // delete item from storage
        if (previewImageDesktop)
          await this.utils.deleteItemFromStorage(previewImageDesktop.path);

        // set images desktop
        images.push({
          path: `${this.path}${
            imagesDesktop[0] ? imagesDesktop[0].filename : ""
          }`,
          type: TypeImageBanner.desktop,
        });
      }

      // validate image table
      if (imagesTablet) {
        // validate preview data
        const previewImageDesktop = images.find(
          (item: BannerImageInterface) => {
            return item.type === TypeImageBanner.tablet;
          }
        );
        const previewImageDesktopIndex = images.findIndex(
          (item: BannerImageInterface) => {
            return item.type === TypeImageBanner.tablet;
          }
        );

        // delete preview data
        if (previewImageDesktopIndex !== -1)
          images.splice(previewImageDesktopIndex, 1);

        // delete item from storage
        if (previewImageDesktop)
          await this.utils.deleteItemFromStorage(previewImageDesktop.path);

        // set images desktop
        images.push({
          path: `${this.path}${
            imagesTablet[0] ? imagesTablet[0].filename : ""
          }`,
          type: TypeImageBanner.tablet,
        });
      }

      // validate image mobile
      if (imagesMobile) {
        // validate preview data
        const previewImageDesktop = images.find(
          (item: BannerImageInterface) => {
            return item.type === TypeImageBanner.mobile;
          }
        );
        const previewImageDesktopIndex = images.findIndex(
          (item: BannerImageInterface) => {
            return item.type === TypeImageBanner.mobile;
          }
        );

        // delete preview data
        if (previewImageDesktopIndex !== -1)
          images.splice(previewImageDesktopIndex, 1);

        // delete item from storage
        if (previewImageDesktop)
          await this.utils.deleteItemFromStorage(previewImageDesktop.path);

        // set images desktop
        images.push({
          path: `${this.path}${
            imagesMobile[0] ? imagesMobile[0].filename : ""
          }`,
          type: TypeImageBanner.mobile,
        });
      }

      // validate if exist one banner active and desactivate by type
      if (body.is_active) await this.disableIsActive(body.type);

      // set images
      body.images = images;

      // save data
      const bannerData = await this.update(id, body);

      // return response
      return ResponseHandler.successResponse(
        res,
        bannerData,
        "Información del banner."
      );
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  /**
   * Disable is_active
   * @param { string } type
   */
  public async disableIsActive(type: string): Promise<void> {
    try {
      const banner = await this.findOneByQuery({ type, is_active: true });
      if (banner) {
        banner.is_active = false;
        await banner.save();
      }
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
}
