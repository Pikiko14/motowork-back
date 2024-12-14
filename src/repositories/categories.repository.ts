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
  public async create(
    category: CategoriesInterface
  ): Promise<CategoriesInterface> {
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
   * Paginate Companies
   * @param query - Query object for filtering results
   * @param skip - Number of documents to skip
   * @param perPage - Number of documents per page
   * @param sortBy - Field to sort by (default: "name")
   * @param order - Sort order (1 for ascending, -1 for descending, default: "1")
   */
  public async paginate(
    query: Record<string, any>,
    skip: number,
    perPage: number,
    sortBy: string = "name",
    order: any = "-1",
    fields: string[] = []
  ): Promise<PaginationResponseInterface> {
    try {
      // Parse sort order to ensure it is a number

      const validSortFields = ["name", "createdAt"];
      if (!validSortFields.includes(sortBy)) {
        throw new Error(`Invalid sort field. Allowed fields are: ${validSortFields.join(", ")}`);
      }

      // Fetch paginated data
      const categories = await this.model
        .find(query)
        .sort({ [sortBy]: order })
        .select(fields.length > 0 ? fields.join(' ') : '')
        .skip(skip)
        .limit(perPage);

      // Get total count of matching documents
      const totalCategories = await this.model.countDocuments(query);

      // Calculate total pages
      const totalPages = Math.ceil(totalCategories / perPage);

      return {
        data: categories,
        totalPages,
        totalItems: totalCategories,
      };
    } catch (error: any) {
      throw new Error(`Pagination failed: ${error.message}`);
    }
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
