import express from "express";
import { Comment } from "../models/comment";
// const upload = require("../middleware/multer");
import { Quiz } from "../models/quiz";
import { PastQuestions } from "../models/pastQuestions";
import { QuestionCategory } from "../models/questionCategory";
import { QuizStatistics } from "../models/quisStatistics";

export const createQuestion = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const {
    question,
    optionA,
    optionB,
    optionC,
    optionD,
    answer,
    category,
    imageUrl,
  } = req.body;
  if (
    !question ||
    !optionA ||
    !optionB ||
    !optionC ||
    !optionD ||
    !answer ||
    !category
  ) {
    res.status(400).json({ errorMessage: "Request data is incomplete" });
  }
  try {
    const data = {
      question,
      optionA,
      optionB,
      optionC,
      optionD,
      answer,
      category,
      imageUrl,
    };
    const newQuestion = await Quiz.create(data);
    newQuestion.save();
    res
      .status(201)
      .json({
        successMessage: "New Question was sucessfully saved to database",
      });
  } catch (error) {
    res.status(500).json({ errorMessage: "Sorry!!! Internal server Error" });
  }
};

export const getAllQuestions = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const allQuestions = await Quiz.find()
      .limit(30)
      .populate("category", "category");
    return res.status(201).json(allQuestions);
  } catch (error) {
    return res
      .status(500)
      .json({ errorMessage: "Something went wrong, Please try again." });
  }
};

export const createPastQuestion = async (
  req: express.Request,
  res: express.Response
) => {
  const { question, answer, category } = req.body;

  try {
    const pastData = { question, answer, category };

    const newPastQuestion = await PastQuestions.create(pastData);

    newPastQuestion.save();

    return res
      .status(201)
      .json("Past Question was successfully saved to database");
  } catch (error) {
    res
      .status(500)
      .json({ errorMessage: "Something went wrong, Please try again." });
  }
};

export const getAllPastQuestions = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const allPastQuestions = await PastQuestions.find();
    return res.status(201).json(allPastQuestions);
  } catch (error) {
    return res
      .status(500)
      .json({ errorMessage: "Something went wrong, Please try again." });
  }
};

export const getQuizStatistics = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const allQuestions = await QuizStatistics.find({}).sort({ date: -1 });
    return res.status(200).json(allQuestions);
  } catch (error) {
    res
      .status(500)
      .json({ errorMessage: "Something went wrong, Please try again." });
  }
};

export const createQuizStatistics = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const {
    score,
    minutes,
    seconds,
    numberOfQuestions,
    numberOfAnsweredQuestions,
    correctAnswers,
    wrongAnswers,
    fiftyFiftyUsed,
    hintsUsed,
    matric,
    answeredQuestions,
  } = req.body;

  const new_Statistics = new QuizStatistics({
    score,
    numberOfQuestions,
    numberOfAnsweredQuestions,
    correctAnswers,
    wrongAnswers,
    fiftyFiftyUsed,
    hintsUsed,
    matric,
    answeredQuestions,
    minutes,
    seconds,
  });
  new_Statistics
    .save()
    .then(() => {
      console.log(new_Statistics);
      res
        .status(200)
        .json({ successMessage: "Quiz statistics has been saved!!" });
    })
    .catch(() => {
      return res
        .status(500)
        .json({
          errorMessage:
            "OOPS!!!, Something went wrong while saving Quiz statistics. Please try again",
        });
    });
};

export const getStatByMatric = async (
  req: express.Request,
  res: express.Response
) => {
  const userMatric = req.params.matric;
  try {
    if (!userMatric) {
      return res.status(404).json({ errorMessage: `User does not exist` });
    }

    const stat = await QuizStatistics.find({
      matric: { $eq: userMatric },
    }).sort({ date: -1 });
    res.status(200).json(stat);
  } catch (error) {
    return res
      .status(500)
      .json({ errorMessage: "OOPS!!!, Something went wrong7" });
  }
};

export const createQuestionCategory = async (
  req: express.Request,
  res: express.Response
) => {
  const { category } = req.body;
  try {
    let existingCategory = await QuestionCategory.findOne({ category });
    if (existingCategory) {
      return res
        .status(400)
        .json({ errorMessage: `${category} Category already exist` });
    }

    let newCategory = new QuestionCategory();
    newCategory.category = category;
    await newCategory.save();
    return res
      .status(200)
      .json({
        successMessage: `${category} Category was successfully created`,
      });
  } catch (error) {
    return res
      .status(500)
      .json({ errorMessage: "Something went wrong, Please try again." });
  }
};

export const getAllCategories = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const allCategories = await QuestionCategory.find().limit(30);
    return res.status(200).json(allCategories);
  } catch (error) {
    res
      .status(500)
      .json({ errorMessage: "Something went wrong, Please try again." });
  }
};

export const deleteQuestionById = async (
  req: express.Request,
  res: express.Response
) => {
  const _id = req.params.id;
  try {
    const deletedSpot = await Quiz.deleteOne({ _id }).exec();

    if (deletedSpot.deletedCount === 0) {
      return res
        .status(404)
        .json({ errorMessage: `Spot question With ID ${_id} does not Exist` });
    } else {
      res
        .status(200)
        .json({
          successMessage: `Spot question With ID ${_id} Was Successfully Deleted`,
        });
    }
  } catch (error) {
    res
      .status(500)
      .json({ errorMessage: "Something went wrong while fetching user" });
  }
};

export const getQuestionById = async (
  req: express.Request,
  res: express.Response
) => {
  const _id = req.params.id;
  try {
    const question = await Quiz.findOne({ _id });
    if (!question) {
      return res
        .status(404)
        .json({ errorMessage: `Spot question With ID ${_id} Does Not Exist` });
    } else {
      return res.status(200).json(question);
    }
  } catch (error) {
    res
      .status(500)
      .json({ errorMessage: "Something went wrong, Please try again." });
  }
};

export const updateQuestion = async (
  req: express.Request,
  res: express.Response
) => {
  const { question, optionA, optionB, optionC, optionD, answer, category } =
    req.body;
  const _id = req.params.id;

  try {
    let questions = await Quiz.findOne({ _id });

    if (!questions) {
      return res
        .status(200)
        .json(
          `Question with ID ${_id} was not found; a new question was created`
        );
    } else {
      questions.category = category;
      questions.question = question;
      questions.optionA = optionA;
      questions.optionB = optionB;
      questions.optionC = optionC;
      questions.optionD = optionD;
      questions.answer = answer;
      await questions.save();
      return res
        .status(200)
        .json({ successMessage: `Question data was successfully updated` });
    }
  } catch (error) {
    return res.status(500).json({ errorMessage: "Something went wrong" });
  }
};

export const createComment = async (
  req: express.Request,
  res: express.Response
) => {
  const { comment, username, matric, level } = req.body;

  try {
    const data = { username, matric, level, comment };
    const newComment = await Comment.create(data);
    newComment.save();
    res
      .status(201)
      .json({
        successMessage:
          "Comment was successfully recieved we'll review it and revert back to you.",
      });
  } catch (error) {
    res.status(500).json({ errorMessage: "Sorry!!! Internal server Error" });
  }
};

export const getAllComments = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const allComments = await Comment.find({}).sort({ date: -1 });
    return res.status(200).json(allComments);
  } catch (error) {
    res
      .status(500)
      .json({ errorMessage: "Something went wrong, Please try again." });
  }
};
