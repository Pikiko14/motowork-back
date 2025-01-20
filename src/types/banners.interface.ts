export enum TypeBanner {
  home = "home",
  news = "news",
  used = "used",
  experencie = "experience",
  us = "us",
  accesories = "accesories",
  vehicles = "vehicles",
}

export enum TypeImageBanner {
  desktop = "desktop",
  tablet = "tablet",
  mobile = "mobile",
}

export interface BannerImageInterface {
  _id?: string;
  path: string;
  type: TypeImageBanner;
  src?: string;
}

export interface BannersInterface {
  name: string;
  link: string;
  type: TypeBanner;
  is_active: boolean | string;
  images: BannerImageInterface[];
}
