import { Request, Response } from "express";
import { matchedData } from "express-validator";
import { ResponseHandler } from "../utils/responseHandler";
import { CategoriesService } from "../services/categories.service";
import { CategoriesInterface } from "./../types/categories.interface";
import { ResponseRequestInterface } from "../types/response.interface";
import { PaginationInterface, RequestExt } from "../types/req-ext.interface";

export class CategoriesController {
  public service;

  constructor() {
    this.service = new CategoriesService();
  }

  /**
   * Create categories
   * @param req Express request
   * @param res Express response
   * @returns Promise<void>
   */
  createCategories = async (
    req: Request,
    res: Response
  ): Promise<void | ResponseRequestInterface> => {
    try {
      // get body
      const body = matchedData(req) as CategoriesInterface;

      // store category
      return await this.service.createCategory(
        res,
        body,
        req.file as Express.Multer.File
      );
    } catch (error: any) {
      ResponseHandler.handleInternalError(res, error, error.message ?? error);
    }
  };
}
