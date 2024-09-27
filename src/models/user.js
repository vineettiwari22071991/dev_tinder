const mongoose = require('mongoose')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');


const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50
    },
    lastName: {
        type: String
    },
    emailId: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Invalid email address " + value)
            }
        }
    },
    password: {
        type: String,
        required: true,
        validate(value) {
            if (!validator.isStrongPassword(value)) {
                throw new Error("Enter Strong Password ")
            }
        }
    },
    age: {
        type: Number,
        min: 18,
        max: 120
    },
    gender: {
        type: String,
        validate(value) {
            if (!["male", "female", "others"].includes(value.toLowerCase())) {
                throw new Error("Invalid gender value")
            }
        }
    },
    photoUrl: {
        type: String,
        default: "https://i.pinimg.com/474x/0a/a8/58/0aa8581c2cb0aa948d63ce3ddad90c81.jpg",
        validate(value) {
            if (!validator.isURL(value)) {
                throw new Error("Invalid Photo URL " + value)
            }
        }
    },
    about: {
        type: String,
        default: "This is a default aboutof the user"
    },
    skills: {
        type: [String],
        validate(value) {
            if (value.length > 10) {
                throw new Error("You cannot add more than 10 skills.")
            }
        }
    }
},
    {
        timestamps: true
    }
);

userSchema.methods.getJWT = async function () {
    const user = this
    const token = await jwt.sign({ userId: user._id }, "DEVTINDER@2209", {
        expiresIn: "7d"
    })
    return token
}

userSchema.methods.validatePassword = async function (passwordInputByUser) {
    const user = this
    const passwordHash = user.password
    const isMatch = await bcrypt.compare(passwordInputByUser, passwordHash)
    return isMatch
}

module.exports = mongoose.model("User", userSchema)