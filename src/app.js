const express = require('express');
const connectDB = require("./config/database")
const cookieParser = require('cookie-parser');
const app = express();
const authRouter = require('./routes/authApp');
const profileRouter = require('./routes/profile');
const requestRouter = require('./routes/request');

app.use(express.json())
app.use(cookieParser())


app.use('/', authRouter)
app.use('/', profileRouter)
app.use('/', requestRouter)



connectDB().
    then(() => {
        console.log("Database connection established")
        app.listen(3000, () => {
            console.log("Server is running on port 3000")
        })
    }).catch((err) => {
        console.log("Database cannot be connected")
    })

