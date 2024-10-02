const jwt = require("jsonwebtoken")
const User = require("../models/user")

const userAuth = async (req, res, next) => {
    try {
        const { token } = req.cookies;

        if (!token) {
            throw new Error("Please login")
        }
        const decodedObj = await jwt.verify(token, "DEVTINDER@2209")

        if (!decodedObj) {
            throw new Error("Invalid Token")
        }

        const { userId } = decodedObj;

        const user = await User.findById(userId)
        if (!user) {
            throw new Error("User not found")
        } else {
            req.user = user;
            next()
        }

    } catch (err) {
        res.status(401).send("ERROR: " + err.message)

    }


}

const checkUserEmail = async (req, res, next) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email })
        if (!user) {
            throw new Error("User not found")
        } else {
            req.user = user;
            next()
        }
    } catch(err){
        res.status(400).send("ERROR " + err.message)
    }
}


module.exports = {
    userAuth
}