const express = require('express');
const authRouter = express.Router();
const User = require('../models/user');
const { validationSignUp, validationLogin } = require("../utils/validation");
const { passwordHashing } = require("../utils/commonHelper");

authRouter.post("/signup", async (req, res) => {
    try {
        const { firstName, lastName, emailId, password } = req.body
        const passwordHash = await passwordHashing(password)
        validationSignUp(req)
        const userObj = new User({
            firstName,
            lastName,
            emailId,
            password: passwordHash
        })
        await userObj.save()
        res.json({
            statusCode: 200,
            message: "User created successfully",
            data: userObj
        })
    } catch (err) {
        res.status(400).json({
            statusCode: 400,
            message: "Error: " + err.message
        })
    }
})

authRouter.post("/login", async (req, res) => {
    try {
        const { emailId, password } = req.body;
        validationLogin(req)
        const user = await User.findOne({ emailId: emailId })
        if (!user) {
            throw new Error("Invalid Credentials")
        } else {
            const isMatch = await user.validatePassword(password)
            if (!isMatch) {
                throw new Error("Invalid Credentials")
            } else {
                const token = await user.getJWT()
                res.cookie("token", token, {
                    expires : new Date(Date.now() + 8 * 360000) 
                })
                res.json({
                    statusCode: 200,
                    message: "Login Successfully",
                    data: user
                })
            }
        }

    } catch (err) {
        res.status(400).json({
            statusCode: 400,
            message: "Error: " + err.message
        })
    }
})

authRouter.get("/logout", async (req, res) => {
    try {
        res.cookie("token", null, {
            expires: new Date(Date.now())
        })
        res.json({
            statusCode: 200,
            message: "Logout Successfully",
            data: null
        })
    } catch (err) {
        res.status(400).json({
            statusCode: 400,
            message: "Error: " + err.message
        })
    }
})

module.exports = authRouter