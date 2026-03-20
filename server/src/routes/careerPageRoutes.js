import { Router } from "express";
import {
  getCareerPageEditorController,
  getCareerPageShareLinkController,
  getPublicCareerPageController,
  publishCareerPageController,
  updateCareerPageDraftController
} from "../controllers/careerPageController.js";

const router = Router();

router.get("/companies/:slug/career-page", getCareerPageEditorController);
router.patch("/companies/:slug/career-page", updateCareerPageDraftController);
router.post("/companies/:slug/career-page/publish", publishCareerPageController);
router.get("/companies/:slug/career-page/share-link", getCareerPageShareLinkController);
router.get("/careers/:slug", getPublicCareerPageController);

export default router;
