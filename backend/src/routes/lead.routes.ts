import { Router } from "express";

import {
  createLeadController,
  getLeadController,
  listLeadsController,
  statsController
} from "../controllers/lead.controller.js";

const router = Router();

router.get("/stats", statsController);

router.get("/", listLeadsController);

router.get("/:id", getLeadController);

router.post("/", createLeadController);

export default router;