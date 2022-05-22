const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: [true, "Please Enter Question First"],
        unique: true,
        default: Date.now()
    },
    options: [
        {
            option: {
                type: String,
                required: [true, "Please Enter Option"]
            }
        }
    ],
    answers: [
        {
            answer: {
                type: String,
                required: [true, "Please Enter Answer"]
            }
        }
    ],
    booleanAnswer: {
        type: Boolean,
        required: [true, "Please Enter True or False"]
    },
    howManyWord: {
        type: Number,
        required: [true, "Please Enter Words Count"]
    },
    questionType: {
        type: String,
        required: [true, "please Enter QuestionType"]
    },
    matching: [
        {
            match: {
                type: String,
                required: [true, "Please Enter Matching"]
            }
        }
    ],
    creator: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true
    },
    questionDate: {
        type: Number,
        required: true,
        default: new Date()
    },
    title: {
        type: String,
        required: true
    },
    miniTitle: {
        type: String,
        required: true
    },
    questionSetCode: {
        type: String,
        required: [true, "Please Enter question set code"],
    },
});

module.exports = mongoose.model("Question", questionSchema);

// True/False
// Multiple Choice
// Short Answer/Essay Question
// Fill-in-the-blank
// Matching