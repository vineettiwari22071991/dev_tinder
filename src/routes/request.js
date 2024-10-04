const express = require('express');
const requestRouter = express.Router();
const { userAuth } = require('../middlewares/auth');
const ConnectionRequest = require('../models/connectRequest');
const { validatedConnectionRequest } = require('../utils/validation');
const User = require('../models/user');

requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
    try {
        const { fromUserId, toUserId, status } = validatedConnectionRequest(req.user, req.params)

        const findUser = await User.findOne({ _id: toUserId })

        if (!findUser) {
            return res.status(400).json({
                statusCode: 400,
                message: "User not found",
                data: null
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
                statusCode: 400,
                message: "Request already sent",
                data: null
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
        res.status(400).json({
            statusCode: 400,
            message: "Error: " + err.message
        })
    }
})

requestRouter.post("/request/review/:status/:requestId", userAuth, async (req, res) => {
    try{
        const loggedInUser = req.user
        const { status, requestId } = req.params
        const allowedStatus = ['accepted', 'rejected']
        if(!allowedStatus.includes(status)){
            return res.status(400).json(({
                statusCode: 400,
                message: "Invalid status"
            }))
        }

        const connectionRequest = await ConnectionRequest.findOne({
            _id: requestId,
            toUserId: loggedInUser._id,
            status: 'interested'
        })
       
        if(!connectionRequest){
            return res.status(400).json({
                statusCode: 400,
                message: "Connection request not found"
            })
        } 

        connectionRequest.status = status
        const data = await connectionRequest.save()
        res.json({
            status: 200,
            message: status === 'accepted' ? "Connection request accepted" : "Connection request rejected",
            data: data
        })

    }catch(err) {
        res.status(400).json({
            statusCode: 400,
            message: "Error: " + err.message
        })
    }
})


module.exports = requestRouter;