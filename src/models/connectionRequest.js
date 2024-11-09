const mongoose = require("mongoose");

const ConnectionRequestSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", //Reference to the user collection
        required: true
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId
    },
    status: {
        type: String,
        required: true,
        enum: {
            values: ["ignore", "interested", "accepted", "rejected"],
            message:   `{VALUE} is incorrect status type`
        }
    }
}, {
    timeseries: true,
})

ConnectionRequestSchema.pre("save", function(next) {
    const connectionRequest = this;
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
        throw new Error("Cannot send connection request to yourself");
    }
    next();
})

ConnectionRequestSchema.index({ fromUserId: 1});

const ConnectionRequestModel = new mongoose.model(
    "connectionRequest",
    ConnectionRequestSchema
)

module.exports = ConnectionRequestModel;