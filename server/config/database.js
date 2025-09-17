const mongoose = require("mongoose");
require("dotenv").config();

exports.dbConnect = async() => {
    mongoose.connect(process.env.MONGODB_URL)
    .then(() => {
        console.log("Database connection successfull")
    })
    .catch((error) => {
        console.log("DATABASE connection issues ");
        console.log(error);
        process.exit(1);
    })
}