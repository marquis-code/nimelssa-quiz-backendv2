import express from "express";

import {
  createQuestion,
  getAllQuestions,
  createPastQuestion,
  getAllPastQuestions,
  getQuizStatistics,
  createQuizStatistics,
  getStatByMatric,
  createQuestionCategory,
  getAllCategories,
  deleteQuestionById,
  getQuestionById,
  updateQuestion,
  createComment,
  getAllComments,
} from "../controllers/quiz";
const router = express.Router();
router.post("/create-question", createQuestion);
router.get("/questions", getAllQuestions);
router.post("/past-question", createPastQuestion);
router.get("/past-questions", getAllPastQuestions);
router.get("/statistics", getQuizStatistics);
router.post("/create-statistics", createQuizStatistics);
router.get("/stat/:matric", getStatByMatric);
router.post("/category", createQuestionCategory);
router.get("/categories", getAllCategories);
router.delete("/questions/:id", deleteQuestionById);
export default router;