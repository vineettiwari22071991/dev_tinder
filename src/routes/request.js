const express = require('express');
const requestRouter = express.Router();
const { userAuth } = require('../middlewares/auth');
const ConnectionRequest = require('../models/connectRequest');
const { validatedConnectionRequest } = require('../utils/validation');
const User = require('../models/user');

requestRouter.get("/request/send/:status/:toUserId", userAuth, async (req, res) => {
    try {
        const { fromUserId, toUserId, status } = validatedConnectionRequest(req.user, req.params)

        const findUser = await User.findOne({ _id: toUserId })

        if (!findUser) {
            return res.status(400).json({
                message: "User not found"
            })
        }

        const checkConnectionRequest = await ConnectionRequest.findOne({
            $or: [
                { fromUserId, toUserId },
                { fromUserId: toUserId, toUserId: fromUserId }
            ],
        }
        )
        if (checkConnectionRequest) {
             return res.status(400).json({
                message: "Request already sent"
            })
        }
        const connectionRequest = new ConnectionRequest({
            fromUserId: fromUserId,
            toUserId: toUserId,
            status: status
        })

        const data = await connectionRequest.save();
        res.json({
            status: 200,
            message: status === 'interested' ? "Connnection request successfully" : "Profile ignored" ,
            data: data
        })


    } catch (err) {
        res.status(400).send("ERROR: " + err.message)
    }
})


module.exports = requestRouter;