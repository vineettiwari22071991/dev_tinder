const express = require("express")
const { userAuth } = require("../middlewares/auth")
const userRouter = express.Router()
const ConnectionRequest = require("../models/connectRequest")
const User = require("../models/user")

const USER_SAFE_DATA = ["firstName", "lastName", "age", "gender",
    "photoUrl", "about", "skills"]

userRouter.get("/user/requests/received", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user
        const connectionRequests = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: "interested"
        }).populate("fromUserId", ["firstName", "lastName", "age", "gender",
            "photoUrl", "about", "skills"])

        if (connectionRequests.length === 0) {
            return res.status(200).json({
                statusCode: 200,
                message: "No connection requests found",
                data: connectionRequests
            })
        }

        res.status(200).json({
            statusCode: 200,
            message: "Connection requests found",
            data: connectionRequests
        })

    } catch (err) {
        res.status(400).json({
            statusCode: 400,
            message: "Error: " + err.message
        })
    }
})

userRouter.get("/user/connections", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user
        const connectionRequests = await ConnectionRequest.find({
            $or: [
                { fromUserId: loggedInUser._id },
                { toUserId: loggedInUser._id }
            ],
            status: "accepted"
        }).populate("fromUserId", USER_SAFE_DATA)
            .populate("toUserId", USER_SAFE_DATA)
        if (connectionRequests.length === 0) {
            return res.status(200).json({
                statusCode: 200,
                message: "No connections found",
                data: connectionRequests
            })
        }
        const data = connectionRequests.map((row) => row.fromUserId.toString() === loggedInUser._id.toString() ? row.toUserId : row.fromUserId)
        res.status(200).json({
            statusCode: 200,
            message: "Connections found",
            data: data
        })

    } catch (err) {
        res.status(400).json({
            statusCode: 400,
            message: "Error: " + err.message
        })
    }
})

userRouter.get("/user/feed", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user
        const page = parseInt(req.query.page) || 1
        let limit = parseInt(req.query.limit) || 10
         
        limit = limit > 50 ? 50 : limit

        const skip = (page - 1) * limit

        const connectionRequests = await ConnectionRequest.find({
            $or: [
                { fromUserId: loggedInUser._id },
                { toUserId: loggedInUser._id }
            ]
        }).select("fromUserId toUserId")

        const hideUsersFromFeed = new Set()
        connectionRequests.forEach((row) => {
            hideUsersFromFeed.add(row.fromUserId.toString())
            hideUsersFromFeed.add(row.toUserId.toString())
        })

        const users = await User.find({
            $and: [{
                _id: {
                    $nin: Array.from(hideUsersFromFeed)
                },
                _id: {
                    $ne: loggedInUser._id
                }
            }

            ]
        }).select(USER_SAFE_DATA).skip(skip).limit(limit)

        if(users.length === 0) {
            return res.status(200).json({
                statusCode: 200,
                message: "No users found",
                data: users
            })
        }

        res.status(200).json({
            statusCode: 200,
            message: "Users found",
            data: users
        })


    } catch (err) {
        res.status(400).json({
            statusCode: 400,
            message: "Error: " + err.message
        })
    }
})


module.exports = userRouter