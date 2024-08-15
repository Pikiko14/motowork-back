import { Model } from "mongoose";
import CategoriesModel from "../models/categories.model";
import { CategoriesInterface } from "../types/categories.interface";

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
}

export default CategoriesRepository;
