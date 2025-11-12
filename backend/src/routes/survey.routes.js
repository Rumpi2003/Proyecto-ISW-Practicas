import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import {
  createSurvey,
  listSurveys,
  submitSurveyResponse,
  getSurvey
} from "../controllers/survey.controller.js";

const router = Router();
router.post("/", authMiddleware, createSurvey);
router.get("/", authMiddleware, listSurveys);
router.post("/:id/responses", authMiddleware, submitSurveyResponse);
router.get("/:id", getSurvey);

export default router;