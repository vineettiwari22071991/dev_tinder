const express = require('express');
const profileRouter = express.Router();
const { userAuth } = require('../middlewares/auth');
const { validationEditProfileData, validatedPassword } = require('../utils/validation');
const { passwordHashing } = require("../utils/commonHelper");
const User = require("../models/user");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
    try {
        res.json({
            statusCode: 200,
            message: "Profile fetched successfully",
            data: req.user
        })
    } catch (err) {
        res.status(400).json({
            statusCode: 400,
            message: "Error: " + err.message
        })
    }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
    try {
        validationEditProfileData(req)
        const updates = Object.keys(req.body)
        const user = req.user
        if (!user) {
            throw new Error("User not found")
        }
        updates.forEach((field) => user[field] = req.body[field])
        await req.user.save()
        res.json({
            statusCode: 200,
            message: "Profile updated successfully",
            data: req.user
        })

    } catch (err) {
        res.status(400).json({
            statusCode: 400,
            message: "Error: " + err.message
        })
    }

})

profileRouter.patch("/profile/forgotPassword", async (req, res) => {
    try {
        const user = await User.findOne({ emailId: req.body.emailId })
        if (!user) throw new Error("User not found")
        validatedPassword(req)
        const passwordHash = await passwordHashing(req.body.newPassword)
        user.password = passwordHash
        await user.save()
        res.json({
            statusCode: 200,
            message: "Password updated successfully",
            data: req.user
        })

    } catch (err) {
        res.status(400).json({
            statusCode: 400,
            message: "Error: " + err.message
        })
    }
})



module.exports = profileRouter;