const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");

app.post("/signup", async(req, res) => {
    const userObj = new User({
        firstName: "Virat",
        lastName: "Kohli",
        emailId: "viratkohli@gmail.com",
        password: "A889026a"
    })

    await userObj.save();
    res.send("User Added Successfully....")
})

connectDB() 
    .then(() => {
        console.log("database connection established....");
    })
    .catch(() => {
        console.error("Database cannot be connected!!");
    })

app.listen(3016, () => {
    console.log("Server is successfully listening on port 3016...");
});