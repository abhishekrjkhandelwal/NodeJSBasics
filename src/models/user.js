const mongoose = require("mongoose");
const jwt  = require("jsonwebtoken");
const bcrypt = require("bcrypt")

const userSchema = mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true,
            minLength: 4,
            maxLength: 50
        },
        lastName: {
            type: String
        },
        emailId: {
            type: String,
            required: true,
            lowercase: true,
            unique: true,
            trim: true,
            validate(value) {
                if(!validate.isEmail(value)) {
                    throw new Error("Invalid email address " + value)
                }
            }
        },
        password: {
            type: String
        },
        age: {
            type: Number,
            min: 18
        },
        gender: {
            type: String,
            enum: {
                values: ["male", "female", "other"],
                message:  `{VALUE} is incorrect`
            },
            validate(value) {
                if(!["male", "female", "others"].includes(value)) {
                    throw new Error("Gender data is not valid")
                }
            },
        },
        about: {
            type: String,
            default: "This is a default of the user!"
        },
        photoUrl: {
            type: String
        },
        skills: {
            type: [String]
        }
}, {
    timestamps: true
})

userSchema.methods.getJWT = async function() {
    const user = this;
    const token = await jwt.sign({"_id": user._id}, "DEV@Tinder$789", {expiresIn: "7d"});
    return token;
}

userSchema.methods.validatePassword = async function (passwordInputByUser) {
    const user = this;
    const passwordHash = user.password;

    const isPasswordValid = await bcrypt.compare(passwordInputByUser, passwordHash);
    return isPasswordValid;    
}

const userModel = mongoose.model("User", userSchema)

module.exports = userModel;