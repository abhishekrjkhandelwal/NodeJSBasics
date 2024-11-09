const express = require("express");

const authRouter = express.Router();

const { validationSignUpData } = require("../utils/validation");
const User = require("../models/user");
const bcrypt  = require("bcrypt")

authRouter.post("/signup", async(req, res) => {
    try {
        //Validation of data 
        validationSignUpData(req)
                
        //Encrypt the password
        const {firstName, lastName, emailId, password} = req.body; 
        console.log("password", password)
        const passwordHash = await bcrypt.hash(password, 10)
        console.log(passwordHash)

        console.log(req.body, User)
        const userObj = new User({
            firstName, 
            lastName,
            emailId,
            password: passwordHash
        })
        await userObj.save();        
        res.send("User Added Successfully....")
    } catch(err) {
        res.status(400).send("ERROR : " + err.message);
    }
})

authRouter.post("/login", async(req, res) => {
    try {
        const {emailId, password} = req.body;
        console.log(emailId, password, User)  
        const user = await User.findOne({emailId : emailId});
        console.log(user)
        if(!user) {
            throw new Error("EmailID not present in DB");
        }

        const isPasswordValid = await user.validatePassword(password);

        if(isPasswordValid) {
            //Add the token to cookie and send the response back to the user.
            const token = await user.getJWT();
            res.cookie("token", token);
            res.send("Login Successfull!!");
        } else {
            throw new Error("Invalid Credentials")
        }
    } catch(err) {
        res.status(400).send("Error : " + err.message);
    }
})

authRouter.post("/logout", async(req, res) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
    }).send();
})

module.exports = authRouter;