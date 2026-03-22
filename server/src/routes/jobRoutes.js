import { Router } from "express";
import { deleteJobController, getJobsController, updateJobController } from "../controllers/jobController.js";

const router = Router();

router.get("/", getJobsController);
router.patch("/:id", updateJobController);
router.delete("/:id", deleteJobController);

export default router;
