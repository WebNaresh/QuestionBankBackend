const mongoose = require("mongoose");

const connectDatabase = () => {

    mongoose.connect(process.env.DBURI).then((data) => {
        console.log(`Mongodb connected with server: ${data.connection.host}`);
    });
};

module.exports = connectDatabase;