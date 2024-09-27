const express = require('express');
const connectDB = require("./config/database")
const User = require("./models/user")
const { validationSignUp, validationLogin } = require("./utils/validation")
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const { userAuth } = require("./middlewares/auth");
const { passwordHashing } = require("./utils/commonHelper")

const app = express();

app.use(express.json())
app.use(cookieParser())

app.post("/signup", async (req, res) => {
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
        res.send("User created successfully")
    } catch (err) {
        res.status(400).send("Error while creating a record: " + err.message)
    }
})

app.post("/login", async (req, res) => {
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
                res.send("Login Successfully")
            }
        }

    } catch (err) {
        res.status(400).send("Error while login: " + err.message)
    }
})

app.get("/profile", userAuth, async (req, res) => {
    try {
        res.send(req.user)
    } catch (err) {
        res.status(400).send("ERROR " + err.message)
    }
});

app.get("/sendConnectionRequest", userAuth, async (req, res) => {
    try{
        const user = req.user
        res.send(`${user.firstName} has send connetion request`)

    }catch(err){
        res.status(400).send("ERROR: " + err.message)
    }
})

connectDB().
    then(() => {
        console.log("Database connection established")
        app.listen(3000, () => {
            console.log("Server is running on port 3000")
        })
    }).catch((err) => {
        console.log("Database cannot be connected")
    })

