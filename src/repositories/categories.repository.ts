import { Model } from "mongoose";
import CategoriesModel from "../models/categories.model";
import { CategoriesInterface } from "../types/categories.interface";
import { PaginationResponseInterface } from "../types/response.interface";

class CategoriesRepository {
  private readonly model: Model<CategoriesInterface>;

  constructor() {
    this.model = CategoriesModel;
  }

  /**
   * Find model by query
   * @param query 
   * @returns 
   */
  public async findOneByQuery(query: any): Promise<CategoriesInterface | null> {
    return await this.model.findOne(query);
  }

  /**
   * Save category in bbdd
   * @param user User
   */
  public async create(category: CategoriesInterface): Promise<CategoriesInterface> {
    const categoryBd = await this.model.create(category);
    return categoryBd;
  }

  /**
   * Update category data
   * @param id
   * @param body
   */
  public async update(
    id: string | undefined,
    body: CategoriesInterface
  ): Promise<CategoriesInterface | void | null> {
    return await this.model.findByIdAndUpdate(id, body, { new: true });
  }

   /**
   * Paginate Companys
   * @param page
   * @param skip
   * @param search
   */
   public async paginate(
    query: any,
    skip: number,
    perPage: number
  ): Promise<PaginationResponseInterface> {
    const categories = await this.model.find(query).skip(skip).limit(perPage);
    const totalCategories = await this.model.find(query).countDocuments();
    const totalPages = Math.ceil(totalCategories / perPage);
    return {
      data: categories,
      totalPages,
      totalItems: totalCategories,
    };
  }

  /**
   * Delete category by id
   * @param id
   */
  public async delete(id: string): Promise<CategoriesInterface | void | null> {
    return this.model.findByIdAndDelete(id);
  }
}

export default CategoriesRepository;
