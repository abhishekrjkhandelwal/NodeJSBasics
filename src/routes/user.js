const express = require("express");
const userRouter = express.Router();

const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest")
const USER_SAFE_DATA = "firstName lastName photoUrl age gender about skills"

const User = require("../models/user")

// Get all the pending connection request for the loggedIn user. 
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

userRouter.get("/feed", userAuth, async (req, res) => {
    try {
        /**
         * User should see all the user cards except
         * 0. his own card
         * 1. his connections
         * 2. ignored people
         * 3. already sent the connection request
         */

        const loggedInUser = req.user;

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        limit = limit > 50 ? 50 : limit;

        //Find all connection requests (sent + received)
        const connectionRequest = await ConnectionRequest.find({
            $or: [{ fromUserId: loggedInUser._id, toUserId: loggedInUser._id }]
        }).select("fromUserId toUserId")

        const hideUsersFromFeed = new Set();
        connectionRequest.forEach((req) => {
            hideUsersFromFeed.add(req.fromUserId.toString());
            hideUsersFromFeed.add(req.toUserId.toString())
        });

        console.log(connectionRequest, skip, limit);

        const users = await User.find({
            $and : [
                {_id: { $nin : Array.from(hideUsersFromFeed)}},
                {_id: { $ne: loggedInUser._id}}            
            ]           
        }).select(USER_SAFE_DATA).skip(skip).limit(limit);

        res.send(users)
    } catch(err) {
        res.status(400).send({"message": err.message})
    }
})

module.exports = userRouter;