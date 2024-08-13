import { Router } from "express";
import { upload } from "../utils/storage";
import sessionCheck from "../middlewares/sessions.middleware";
import { BannersController } from "../controllers/banners.controller";

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
router.post("/", sessionCheck, uploadFields, controller.createBanners);

// export router
export { router };
