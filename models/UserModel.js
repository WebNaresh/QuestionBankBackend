const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require('crypto');



const questionPaperInfoSchema = new mongoose.Schema(
    [
        {
            mark: {
                type: Number,
                required: true,
                default: 0
            },
            questionPaperSetId: {
                type: mongoose.Schema.ObjectId,
                ref: "QuestionSetModel",
                required: true,
            },
            nonAttempted: [
                {
                    type: mongoose.Schema.ObjectId,
                    ref: "QuestionModel",
                }],
            attempted: [
                {
                    type: mongoose.Schema.ObjectId,
                    ref: "QuestionModel",
                }]
        }
    ]
);

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please Enter Your Name"],
        maxlength: [30, "Name cannot be Exceed 30 characters"],
        minlength: [4, "Name should be have more than 4 characters"]
    },
    email: {
        type: String,
        required: [true, "Please Enter Your Email"],
        unique: true,
        validate: [validator.isEmail, "Please Enter a valid Email"]
    },
    password: {
        type: String,
        required: [true, "Please Enter Your Password"],
        minlength: [8, "Password should be greater than 8 characters"],
        select: false
    },
    avatar: {
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    },
    role: {
        type: String,
        default: "user"
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    account_Info: {
        type: Date,
        select: false,
        default: new Date()
    },
    questionPaperMarkInfo: [questionPaperInfoSchema]
});

// Hashing a password

userSchema.pre("save", async function (next) {

    if (!this.isModified("password")) {
        next();
    }

    this.password = await bcrypt.hash(this.password, 10);
});

// JWT Token
userSchema.methods.getJWTToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });
};

// Compare Password
userSchema.methods.comparePassword = async function (enteredPassword) {
    console.log(this.password);
    console.log(enteredPassword);
    return await bcrypt.compare(enteredPassword, this.password);
};

// Generating Password Reset Token
userSchema.methods.getResetPasswordToken = function () {

    // Generating Token
    const resetToken = crypto.randomBytes(20).toString("hex");

    // Hashing and adding resetPasswordToken to userSchema

    this.resetPasswordToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");
    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

    return resetToken;
};


const User = mongoose.model("User", userSchema);
const QuestionPaperInfo = mongoose.model("QuestionPaperInfo", questionPaperInfoSchema);

module.exports = {
    User, QuestionPaperInfo
};