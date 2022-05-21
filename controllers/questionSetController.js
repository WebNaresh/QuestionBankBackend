const QuestionSet = require("../models/questionSetModel");
const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/cathchAsyncError");


// Create QuestionSet---Admin
exports.createQuestionSet = catchAsyncErrors(
    async (req, res, next) => {
        req.body.creator = req.user.id;
        const question = await QuestionSet.create(req.body);
        console.log(question);
        res.status(201).json({
            success: true,
            question
        });
    }
);
// Find QuestionSet---Admin
exports.findUserQuestionSet = catchAsyncErrors(
    async (req, res, next) => {
        // return next(new ErrorHandler("Question not found", 404));
        const teacher = req.user;

        let question = await QuestionSet.find({ teacher });
        totalResult = await QuestionSet.count();
        if (!question) {
            return next(new ErrorHandler("Question Set not found", 404));
        }

        res.status(201).json({
            totalResult,
            success: true,
            question,

        });
    }
);

// find question set via id
exports.findUserQuestionSet_code = catchAsyncErrors(
    async (req, res, next) => {
        const code = req.params.id;
        console.log(code);
        totalResult = await QuestionSet.count();
        let questions = await QuestionSet.find({ questionSetCode: code });
        if (!questions) {
            return next(new ErrorHandler("Question Set not found", 404));
        }
        let totalResult = (await questions).length;
        console.log(totalResult);

        res.status(200).json({
            totalResult,
            success: true,
            questions
        });
    }

);


exports.findQuestionSet = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let questionSet = await QuestionSet.find({ _id: id });
    if (!questionSet) {
        return next(new ErrorHandler("Question Set not found", 404));
    }
    res.status(201).json({
        questionSet,
        success: true
    });

});