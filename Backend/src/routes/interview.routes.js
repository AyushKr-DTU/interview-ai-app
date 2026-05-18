const express = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const interviewRouter = express.Router();
const interviewController = require("../controllers/interview.controller");
const upload = require("../middlewares/file.middleware");

/**
 * @route {POST} /api/interview/
 * @desc Generate new interview report for a candidate on basis of user self description, resume pdf and job description 
 * @access Private  
 */
interviewRouter.post("/", authMiddleware.authUser, upload.single("resume"), interviewController.generateInterviewReportController);

/**
 * @route {GET} /api/interview/report/:interviewId
 * @desc Get interview report by interviewId
 * @access Private
 */
interviewRouter.get("/report/:interviewId", authMiddleware.authUser, interviewController.getInterviewReportByIdController);

/**
 * @route {GET} /api/interview/
 * @desc Get all interview reports for a candidate
 * @access Private
 */
interviewRouter.get("/", authMiddleware.authUser, interviewController.getAllInterviewReportsController);

/**
 * @route {GET} /api/interview/resume/pdf/:interviewReportId
 * @desc Generate resume pdf for a candidate on basis of user self description, resume pdf and job description
 * @access Private
 */
interviewRouter.post("/resume/pdf/:interviewReportId", authMiddleware.authUser, interviewController.generateResumePdfController);

module.exports = interviewRouter;    