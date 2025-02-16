import { Request, Response } from "express";
import { matchedData } from "express-validator";
import { ResponseHandler } from "../utils/responseHandler";
import { BannersService } from "../services/banners.service";
import { BannersInterface } from "../types/banners.interface";
import { ResponseRequestInterface } from "../types/response.interface";
import { PaginationInterface, RequestExt } from "../types/req-ext.interface";

export class BannersController {
  public service;

  constructor() {
    this.service = new BannersService();
  }

  /**
   * Create banners
   * @param req Express request
   * @param res Express response
   * @returns Promise<void>
   */
  createBanners = async (
    req: RequestExt,
    res: Response
  ): Promise<void | ResponseRequestInterface> => {
    try {
      // get files
      const imagesTablet = req.files["images_tablet"]
        ? req.files["images_tablet"]
        : null;
      const imagesMobile = req.files["images_mobile"]
        ? req.files["images_mobile"]
        : null;
      const imagesDesktop = req.files["images_desktop"]
        ? req.files["images_desktop"]
        : null;

      // get body sanitize
      const body: BannersInterface = matchedData(req) as BannersInterface;

      // return response
      await this.service.createBanners(res, body, {
        imagesTablet,
        imagesDesktop,
        imagesMobile,
      });
    } catch (error: any) {
      ResponseHandler.handleInternalError(res, error, error.message ?? error);
    }
  };

  /**
   * List banners
   * @param { Request } req Express request
   * @param { Response } res Express response
   * @returns Promise<void>
   */
  listBanners = async (req: Request, res: Response) => {
    try {
      const query: PaginationInterface = matchedData(
        req
      ) as PaginationInterface;
      await this.service.listBanners(res, query);
    } catch (error: any) {
      ResponseHandler.handleInternalError(res, error, error.message);
    }
  };

  /**
   * Show banner
   * @param { Request } req Express request
   * @param { Response } res Express response
   * @returns Promise<void>
   */
  showBanner = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      await this.service.showBanner(res, id);
    } catch (error: any) {
      ResponseHandler.handleInternalError(res, error, error.message);
    }
  };

  /**
   * Delete banner
   * @param { Request } req Express request
   * @param { Response } res Express response
   * @returns Promise<void>
   */
  deleteBanner = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      await this.service.deleteBanner(res, id);
    } catch (error: any) {
      ResponseHandler.handleInternalError(res, error, error.message);
    }
  };

  /**
   * Update banner
   * @param { Request } req Express request
   * @param { Response } res Express response
   * @returns Promise<void>
   */
  updateBanner = async (req: RequestExt, res: Response) => {
    try {
      // get id and body
      const { id } = req.params;
      const body = matchedData(req) as BannersInterface;

      // get files
      const imagesTablet = req.files["images_tablet"]
        ? req.files["images_tablet"]
        : null;
      const imagesMobile = req.files["images_mobile"]
        ? req.files["images_mobile"]
        : null;
      const imagesDesktop = req.files["images_desktop"]
        ? req.files["images_desktop"]
        : null;

      // do update data
      await this.service.updateBanner(res, id, body, {
        imagesTablet,
        imagesDesktop,
        imagesMobile,
      });
    } catch (error: any) {
      ResponseHandler.handleInternalError(res, error, error.message);
    }
  };

  /**
   * List banners by type
   * @param { Request } req Express request
   * @param { Response } res Express response
   * @returns Promise<void>
   */
  filterBanner = async (req: Request, res: Response) => {
    try {
      const query: PaginationInterface = matchedData(
        req
      ) as PaginationInterface;
      await this.service.filterBanner(res, query);
    } catch (error: any) {
      ResponseHandler.handleInternalError(res, error, error.message);
    }
  }
}
