import { Router } from "express";
import { getJobsController, updateJobController } from "../controllers/jobController.js";

const router = Router();

router.get("/", getJobsController);
router.patch("/:id", updateJobController);

export default router;
