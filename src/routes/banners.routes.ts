import { Router } from "express";
import sessionCheck from "../middlewares/sessions.middleware";
import { BannersController } from "../controllers/banners.controller";

// init router
const router = Router();

// instance controller
const controller = new BannersController();

/**
 * Do creationg of banners
 */
router.post("/", sessionCheck, controller.createBanners);

// export router
export { router };
