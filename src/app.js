const express = require('express');
const connectDB = require("./config/database")
const User = require("./models/user")
const { validationSignUp } = require("./utils/validation")
const bcrypt = require('bcrypt');

const app = express();

app.use(express.json())

app.post("/signup", async (req, res) => {
    try {
        const {firstName, lastName, emailId, password} = req.body
        const passwordHash = await bcrypt.hash(password, 10)
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

app.get("/getAllUser", async (req, res) => {
    try {
        await User.find({}).then(((user) => {
            res.send(user)
        }))
    } catch (err) {
        res.status(400).send("Error while fetching a record: " + err.message)
    }

})

app.get("/getUserByEmail", async (req, res) => {
    try {
        const user = await User.findOne({ emailId: req.body.emailId })
        if (user) {
            res.send(user)
        } else {
            res.status(404).send("User not found")
        }

    } catch (err) {
        res.status(400).send("Error while fetching a record: " + err.message)
    }
})

app.delete("/userDeleteById", async (res, req) => {
    try {
        const user = await User.findByIdAndDelete(req.body.userId)
        if (user) {
            res.send("User Delete Sucessfully")
        } else {
            res.status(404).send("User not found")
        }
    } catch (err) {
        res.status(400).send("Error while deleting a record: " + err.message)
    }
})

app.patch("/user/:userId", async (req, res) => {
    const data = req.body
    const userId = req.params?.userId
    const ALLOWED_UPDATES = ["userId", "photoUrl", "skills", "gender", "about", "age"]


    try {
        const isUpdateAllowed = Object.keys(data).every((key) => {
            ALLOWED_UPDATES.includes(key)

        })
        if (!isUpdateAllowed) {
            throw new Error("Invalid update")
        }

        if (data?.skills && Array.isArray(data?.skills) && data?.skills?.length > 10) {
            throw new Error("You cannot add more than 10 skills.")
        }
        const user = await User.findByIdAndUpdate(userId, data, {
            returnDocument: "after",
            runValidators: true
        })
        res.send("User updated successfully")

    } catch (err) {
        res.status(400).send("Error while updating a record: " + err.message)
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

