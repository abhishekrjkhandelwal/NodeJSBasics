const mongoose = require("mongoose");


const connectDB = async () => {
    await mongoose.connect(
        "mongodb+srv://devTinder:A8890261606a@devtinder.hosyj.mongodb.net/devTinder"
    );
}

module.exports = connectDB;