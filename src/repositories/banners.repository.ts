import { Model } from "mongoose";
import BannersModel from "../models/banners.model";
import { BannersInterface } from "../types/banners.interface";
import { PaginationResponseInterface } from "../types/response.interface";

class BannersRepository {
  private readonly model: Model<BannersInterface>;

  constructor() {
    this.model = BannersModel;
  }

  /**
   * Save banner in bbdd
   * @param user User
   */
  public async create (user: BannersInterface): Promise<BannersInterface> {
    const banner = await this.model.create(user);
    return banner;
  }

  /**
   * paginate Companys
   * @param page
   * @param skip
   * @param search
   */
  public async paginate (query: any, skip: number, perPage: number): Promise<PaginationResponseInterface> {
    const banners = await this.model.find(query)
    .skip(skip)
    .limit(perPage);
    const totalCompanys = await this.model.find(query).countDocuments();
    return {
      data: banners,
      totalItems: totalCompanys
    }
  }

  /**
   * get banner by id
   * @param id
   */
  public async getById(id: string): Promise<BannersInterface | void | null> {
    return this.model.findById(id);
  }
}

export default BannersRepository;