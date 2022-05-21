const mongoose = require('mongoose');

const questionSetSchema = new mongoose.Schema({

    totalMarks: {
        type: Number,
        required: true,
    },
    title: {
        type: String,
        required: true
    },
    miniTitle: {
        type: String,
        required: true
    },
    paperTime: {
        type: String,
        required: true
    },
    questionType: [
        {
            type: {
                type: String,
                required: true
            },
            mark: {
                type: Number,
                required: true
            },
            qustionCount: {
                type: Number,
                required: true
            },
            weightage: {
                type: Number,
                required: true
            }
        }
    ],
    paperDate: {
        type: Number,
        required: true,
        default: new Date()
    },
    questionPaperImage: {
        type: String,
        required: true
    },
    creator: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true
    },
    questionPaperImage: {
        type: String,
        required: true
    },
    questionSetCode: {
        type: String,
        required: [true, "This Code is Already used"],
        unique: true,
    },
});


module.exports = mongoose.model("QuestionSet", questionSetSchema);