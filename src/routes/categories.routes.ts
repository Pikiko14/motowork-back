import { Router } from "express";
import { upload } from "../utils/storage";
import sessionCheck from "../middlewares/sessions.middleware";
import perMissionMiddleware from "../middlewares/permission.middleware";
import { CategoriesController } from "../controllers/categories.controller";
import { CategoriesCreationValidator } from "../validators/categories.validator";
import { PaginationValidator } from "../validators/request.validator";

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
  CategoriesCreationValidator,
  controller.createCategories
);

/**
 * Get categories
 */
router.get(
  "/",
  sessionCheck,
  perMissionMiddleware("list-category"),
  PaginationValidator,
  controller.getCategories
);

// export router
export { router };
