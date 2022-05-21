const Question = require("../models/QuestionModel");
const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/cathchAsyncError");
const ApiFearures = require("../utils/apiFeatures");
const { QuestionPaperInfo, User } = require("../models/UserModel");
const checkAnswer = require("../utils/checkAnswer");
var ObjectId = require('mongodb').ObjectID;


// Create Question---Admin
exports.createQuestion = catchAsyncErrors(
    async (req, res, next) => {
        req.body.creator = req.user.id;
        const question = await Question.create(req.body);
        res.status(201).json({
            success: true,
            question
        });
    }
);
// Update Question ---Admin
exports.updateQuestion = catchAsyncErrors(
    async (req, res, next) => {

        let question = await Question.findById(req.params.id);
        if (!question) {
            return next(new ErrorHandler("Question not found", 404));
        }
        question = await Question.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true, useFindAndModify: false });
        res.status(201).json({
            success: true,
            question
        });
    }
);
// delete Question ---Admin
exports.deleteQuestion = catchAsyncErrors(
    async (req, res, next) => {

        let question = await Question.findById(req.params.id);
        if (!question) {
            return next(new ErrorHandler("Question not found", 404));
        }
        question = await Question.deleteOne();
        res.status(201).json({
            success: true,
            question,
            message: "Question is deleted successfully"
        });
    }
);
// get single Question ---Admin
exports.singleQuestion = catchAsyncErrors(
    async (req, res, next) => {

        let question = await Question.findById(req.params.id);
        if (!question) {
            return next(new ErrorHandler("Question not found", 404));
        }
        res.status(201).json({
            success: true,
            question,

        });
    }
);

exports.getAllQuestion = catchAsyncErrors(
    async (req, res) => {
        const apiFeatures = new ApiFearures(Question.find(), req.query).search().filter();
        let questions = await apiFeatures.query;
        let questions1 = typeof questions;
        count = questions.length;
        res.status(200).json({ questions, count });

    }
);

exports.answerCheck = catchAsyncErrors(
    async (req, res, next) => {
        const { userAnswer, mark, questionSetId, userId } = req.body;
        const { id } = req.params;
        let pushIt = await User.findById(userId);
        if (!pushIt) {
            return next(new ErrorHandler("User not found", 404));
        }
        let question = await Question.find({ _id: id });
        if (!question) {
            return next(new ErrorHandler("Question not found", 404));
        }
        const teacherAnswer = question[0].answers[0].answer.toLowerCase();
        let answer = userAnswer.toLowerCase();
        const ok = await checkAnswer(answer, pushIt, teacherAnswer, id, questionSetId, mark);
        pushIt.save();
        res.status(200).json({ pushIt, success: true });

    }
);