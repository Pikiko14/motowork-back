import { Request, Response } from "express";
import { ResponseHandler } from "../utils/responseHandler";
import { matchedData } from "express-validator";
import { RequestExt } from "../types/req-ext.interface";
import { BannersInterface } from "../types/banners.interface";

export class BannersController {
  public service;

  constructor() {
    this.service = "";
  }

  /**
   * Create banners
   * @param req Express request
   * @param res Express response
   * @returns Promise<void>
   */
  createBanners = async (req: RequestExt, res: Response) => {
    try {
      // get files
      const imagesTablet = req.files['images_tablet'] ? req.files['images_tablet'] : null;
      const imagesMobile = req.files['images_mobile'] ? req.files['images_mobile'] : null;
      const imagesDesktop = req.files['images_desktop'] ? req.files['images_desktop'] : null;

      // get body sanitize
      const body: BannersInterface = matchedData(req) as BannersInterface;

      // return response
      res.send(req.body).status(200);
    } catch (error: any) {
      ResponseHandler.handleInternalError(res, error, error.message);
    }
  };
}
