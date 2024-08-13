import { Request, Response } from "express";
import { ResponseHandler } from "../utils/responseHandler";
import { matchedData } from "express-validator";

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
  createBanners = async (req: Request, res: Response) => {
    try {
      // get files
      
      res.send(req.body).status(200);
    } catch (error: any) {
      ResponseHandler.handleInternalError(res, error, error.message);
    }
  };
}
