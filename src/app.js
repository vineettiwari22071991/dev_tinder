const express = require('express');

const app = express();

app.use("/admin", (req, res, next) => {
    console.log("Admin auth is getting checked!")
    const token = "xyz"
    const isAdminAuthorized = token === "xyz";
    if (isAdminAuthorized) {
        next()
    } else {
        res.send("Admin is not authorized")
    }
})

app.use("/admin/getAllData", (req, res) => {
    res.send("Get All Admin Data")
})

app.use("/admin/deleteUser", (req, res) => {
    res.send("Delete User")
})


app.use("/test", (req, res) => {
    res.send("Hello Test")
})


app.use("/", (req, res) => {
    res.send("Hello World")
})

app.listen(3000, () => {
    console.log("Server is running on port 3000")
})