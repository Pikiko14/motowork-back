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
      ResponseHandler.handleInternalError(res, error, error.message);
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
      const query: PaginationInterface = matchedData(req) as PaginationInterface;
      await this.service.listBanners(res, query);
    } catch (error: any) {
      ResponseHandler.handleInternalError(res, error, error.message);
    }
  }
}
