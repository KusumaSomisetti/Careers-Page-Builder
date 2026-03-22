import multer from "multer";
import { Router } from "express";
import {
  getCareerPageEditorController,
  getCareerPageShareLinkController,
  getPublicCareerPageController,
  publishCareerPageController,
  updateCareerPageDraftController,
  uploadCareerPageAssetController
} from "../controllers/careerPageController.js";

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 }
});

router.get("/companies/:slug/career-page", getCareerPageEditorController);
router.patch("/companies/:slug/career-page", updateCareerPageDraftController);
router.post("/companies/:slug/career-page/publish", publishCareerPageController);
router.post("/companies/:slug/career-page/assets", upload.single("file"), uploadCareerPageAssetController);
router.get("/companies/:slug/career-page/share-link", getCareerPageShareLinkController);
router.get("/careers/:slug", getPublicCareerPageController);

export default router;
