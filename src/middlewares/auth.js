const jwt = require("jsonwebtoken");
const User = require("../models/user")

const userAuth = async (req, res, next) => {
    // Read the token from the request cookies
    // Validate the token
    // Find the user
    console.log("8====================================>")
    try {
        const { token } = req.cookies;
        const decodedObj = await jwt.verify(token, "DEV@Tinder$789");
        
        const { _id } = decodedObj;
        const user = await User.findById(_id);
        
        console.log(user)
        if(!user) {
            throw new Error("User not found")
        }    
        req.user = user;
        next();
    } catch(err) {
        console.log("Error===========================================>", err)
        res.status(400).send("ERROR : " + err.message)
    }
}

module.exports = {
    userAuth
}