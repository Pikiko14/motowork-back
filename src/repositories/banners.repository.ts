import { Model } from "mongoose";
import BannersModel from "../models/banners.model";
import { BannersInterface } from "../types/banners.interface";

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
}

export default BannersRepository;
