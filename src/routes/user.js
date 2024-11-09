const express = require("express");
const userRouter = express.Router();

const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest")

//Get all the pending connection request for the loggedIn user. 
userRouter.get("/user/requests/recevied", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;

        const connectionRequests = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: "interested"
        }).populate("fromUserId", ["firstName", "lastName"]);

        res.json({
            message: "Data fetched successfully",
            data: connectionRequests
        });
    } catch(err) {
        req.statusCode(400).send("ERROR :" + err.message)
    }
})

userRouter.get("/user/connections", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const connectionRequests = await ConnectionRequest.find({
            $or: [
                {  toUserId: loggedInUser._id, status: "interested"},
                {  fromUserId: loggedInUser._id, status: "interested"}
            ]
        })

        res.json({ data: connectionRequests})
    } catch(err) {
        res.status(400).send({message: err.message})
    }
})

module.exports = userRouter;
