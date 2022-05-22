const express = require("express");
const cors = require("cors");
const app = express();
const cookieParser = require('cookie-parser');
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "*",

}));

const errorMiddleware = require("./middleware/error");



// Route Imports
const question = require("./routes/questionRoute");
const user = require("./routes/userRoutes");
const questionSet = require("./routes/questionSetRoute");


app.use("/api/v1", question);
app.use("/api/v1", user);
app.use("/api/v1", questionSet);
app.get("/", (req, res) => {
    res.send("This is home page.");
});

// Middleware for Errors
app.use(errorMiddleware);

module.exports = app;

