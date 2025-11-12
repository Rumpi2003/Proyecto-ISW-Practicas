import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import {
  createSurvey,
  listSurveys,
  submitSurveyResponse
} from "../controllers/survey.controller.js";

const router = Router();
router.post("/", authMiddleware, createSurvey);
router.get("/", authMiddleware, listSurveys);
router.post("/:id/responses", authMiddleware, submitSurveyResponse);

export default router;