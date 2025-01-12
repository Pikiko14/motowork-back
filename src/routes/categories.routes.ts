import { Router } from "express";
import { upload } from "../utils/storage";
import sessionCheck from "../middlewares/sessions.middleware";
import perMissionMiddleware from "../middlewares/permission.middleware";
import { CategoriesController } from "../controllers/categories.controller";
import { CategoriesCreationValidator, CategoryIdValidator } from "../validators/categories.validator";
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

/**
 * Show categories
 */
router.get(
  "/:id",
  sessionCheck,
  perMissionMiddleware("list-category"),
  CategoryIdValidator,
  controller.showCategory
);

/**
 * Delete categories
 */
router.delete(
  "/:id",
  sessionCheck,
  perMissionMiddleware("delete-category"),
  CategoryIdValidator,
  controller.deleteCategory
);

/**
 * Update categories
 */
router.put(
  "/:id",
  sessionCheck,
  perMissionMiddleware("update-category"),
  CategoryIdValidator,
  upload.single("file"),
  CategoriesCreationValidator,
  controller.updateCategories
);

/**
 * Update categories
 */
router.put(
  "/:id/change-status",
  sessionCheck,
  perMissionMiddleware("update-category"),
  CategoryIdValidator,
  controller.changeCategoryStatus
);

/**
 * Get categories
 */
router.get(
  "/list/from-web",
  PaginationValidator,
  controller.getCategories
);

// export router
export { router };
