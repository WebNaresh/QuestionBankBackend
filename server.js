const app = require("./app");
const dotenv = require("dotenv");

// config
dotenv.config({ path: "./config/config.env" });

// connecting to databse
const connectDatabase = require("./config/database");
connectDatabase();


// Uncaught Exception Error
process.on("uncaughtException", err => {
    console.log(`Erro:${err.message}`);
    console.log(`shutting down the server due to Uncaught Promise Rejction`);

    Server.close(() => {
        process.exit(1);
    });
});

// connecting to server 
const Server = app.listen(process.env.PORT, () => {
    console.log(`Server is working on http://localhost:${process.env.PORT}`);
});

// Unhadled Promise Rejection
// process.on("unhandledRejection", err => {
//     console.log(`Erro:${err.message}`);
//     console.log(`shutting down the server due to Unhandled Promise Rejction`);

//     Server.close(() => {
//         process.exit(1);
//     });
// });
