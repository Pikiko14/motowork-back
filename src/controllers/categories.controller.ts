import { Request, Response } from "express";
import { matchedData } from "express-validator";
import { ResponseHandler } from "../utils/responseHandler";
import { BannersService } from "../services/banners.service";
import { ResponseRequestInterface } from "../types/response.interface";
import { PaginationInterface, RequestExt } from "../types/req-ext.interface";

export class CategoriesController {
  public service;

  constructor() {
    this.service = new BannersService();
  }

  /**
   * Create categories
   * @param req Express request
   * @param res Express response
   * @returns Promise<void>
   */
  createCategories = async (
    req: RequestExt,
    res: Response
  ): Promise<void | ResponseRequestInterface> => {
    try {
        res.send({ hola: 'hola' }).status(200);
    } catch (error: any) {
      ResponseHandler.handleInternalError(res, error, error.message);
    }
  };
}
