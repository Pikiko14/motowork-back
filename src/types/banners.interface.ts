export enum TypeBanner {
  home = "home",
  news = "news",
  used = "used",
  experencie = "experience",
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
}

export interface BannersInterface {
  name: string;
  link: string;
  type: TypeBanner;
  is_active: boolean;
  images: BannerImageInterface[];
}
