export interface CategoriesInterface {
  _id?: string;
  name: string;
  icon: string;
  is_active?: boolean;
  type: TypeCategory;
  count_news?: number;
  count_used?: number;
}

export enum TypeCategory {
  vehicle = "vehicle",
  product = "product",
}
