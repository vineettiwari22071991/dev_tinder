const express = require('express');
const connectDB = require("./config/database")
const User = require("./models/user")

const app = express();

app.use(express.json())

app.post("/signup", (req, res) => {
    const userObj = new User(req.body)
    try {
        userObj.save().then(() => {
            res.send("User created successfully")
        })
    } catch(err) {
        res.status(400).send("Error while saving a record: " + err.message)
    }
    
})

app.get("/getAllUser", async (req, res)=> {
    try {
        await User.find({}).then(((user) => {
            res.send(user)
          }))
    } catch(err) {
        res.status(400).send("Error while fetching a record: " + err.message)
    }
   
})

app.get("/getUserByEmail", async(req, res)=> {
    try{
        const user = await User.findOne({emailId: req.body.emailId})
        if(user){
            res.send(user)
        } else {
            res.status(404).send("User not found")
        }

    }catch(err){
        res.status(400).send("Error while fetching a record: " + err.message)
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

