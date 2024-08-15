import { Router } from "express";
import { upload } from "../utils/storage";
import sessionCheck from "../middlewares/sessions.middleware";
import { PaginationValidator } from "../validators/request.validator";
import { BannersController } from "../controllers/banners.controller";
import {
  BannerIdValidator,
  BannersCreationValidator,
} from "../validators/banners.validator";
import perMissionMiddleware from "../middlewares/permission.middleware";

// init router
const router = Router();

// instance controller
const controller = new BannersController();

// files
const uploadFields = upload.fields([
  { name: "images_desktop", maxCount: 1 },
  { name: "images_tablet", maxCount: 1 },
  { name: "images_mobile", maxCount: 1 },
]);

/**
 * Do creation of banners
 */
router.post(
  "/",
  sessionCheck,
  perMissionMiddleware("create-banners"),
  uploadFields,
  BannersCreationValidator,
  controller.createBanners
);

/**
 * Return list of banners banners
 */
router.get(
  "/",
  sessionCheck,
  perMissionMiddleware("list-banners"),
  PaginationValidator,
  controller.listBanners
);

/**
 * Show banner data
 */
router.get(
  "/:id",
  sessionCheck,
  perMissionMiddleware("list-banners"),
  BannerIdValidator,
  controller.showBanner
);

/**
 * Delete banner data
 */
router.delete(
  "/:id",
  sessionCheck,
  perMissionMiddleware("delete-banners"),
  BannerIdValidator,
  controller.deleteBanner
);

/**
 * Update banner data
 */
router.put(
  "/:id",
  sessionCheck,
  BannerIdValidator,
  uploadFields,
  BannersCreationValidator,
  controller.updateBanner
);

// export router
export { router };
