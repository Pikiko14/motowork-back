import { Router } from "express";
import { upload } from "../utils/storage";
import sessionCheck from "../middlewares/sessions.middleware";
import perMissionMiddleware from "../middlewares/permission.middleware";
import { CategoriesController } from "../controllers/categories.controller";

// init router
const router = Router();

// instance controller
const controller = new CategoriesController();

/**
 * Create categories
 */
router.post(
  "/",
  sessionCheck,
  perMissionMiddleware("create-category"),
  upload.single("file"),
  controller.createCategories
);

// export router
export { router };
