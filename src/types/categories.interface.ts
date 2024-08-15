export interface CategoriesInterface {
  _id?: string;
  name: string;
  icon: string;
  is_active?: boolean;
  type: TypeCategory;
}

export enum TypeCategory {
  vehicle = "vehicle",
  product = "product",
}
