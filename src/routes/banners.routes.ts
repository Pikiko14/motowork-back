import { Router } from "express";
import { upload } from "../utils/storage";
import sessionCheck from "../middlewares/sessions.middleware";
import { PaginationValidator } from "../validators/request.validator";
import { BannersController } from "../controllers/banners.controller";
import { BannersCreationValidator } from "../validators/banners.validator";

// init router
const router = Router();

// instance controller
const controller = new BannersController();

/**
 * Do creation of banners
 */
const uploadFields = upload.fields([
  { name: "images_desktop", maxCount: 1 },
  { name: "images_tablet", maxCount: 1 },
  { name: "images_mobile", maxCount: 1 },
]);
router.post(
  "/",
  sessionCheck,
  uploadFields,
  BannersCreationValidator,
  controller.createBanners
);

/**
 * Return list of banners banners
 */
router.get('/', sessionCheck, PaginationValidator, controller.listBanners);

// export router
export { router };
