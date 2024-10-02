const express = require('express');
const requestRouter = express.Router();
const { userAuth } = require('../middlewares/auth');

requestRouter.get("/sendConnectionRequest", userAuth, async (req, res) => {
    try {
        const user = req.user
        res.send(`${user.firstName} has send connetion request`)

    } catch (err) {
        res.status(400).send("ERROR: " + err.message)
    }
})


module.exports = requestRouter;