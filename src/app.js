const express = require('express');

const app = express();
const { adminAuth, userAuth } = require("./middlewares/auth")

app.use("/admin", adminAuth)

app.use("/admin/getAllData", (req, res) => {
    res.send("Get All Admin Data")
})

app.use("/admin/deleteUser", (req, res) => {
    res.send("Delete User")
})

app.use("/user", userAuth, (req, res) => {
    res.send("Get All User Data")
})

app.use("/", (req, res) => {
    res.send("Hello World")
})

app.listen(3000, () => {
    console.log("Server is running on port 3000")
})