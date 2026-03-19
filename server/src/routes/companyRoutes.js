import { Router } from "express";
import {
  createCompanyController,
  getCompanyBySlugController,
  listCompaniesController,
  updateCompanyController
} from "../controllers/companyController.js";
import { addJobController } from "../controllers/jobController.js";

const router = Router();

router.get("/", listCompaniesController);
router.post("/", createCompanyController);
router.get("/:slug", getCompanyBySlugController);
router.patch("/:slug", updateCompanyController);
router.post("/:slug/jobs", addJobController);

export default router;
