const mongoose = require("mongoose")

const connectDB = async () => {
    try {
        await mongoose.connect("mongodb+srv://vinittiwari32:gqedRfe2TTnq4PTv@cluster0.5hdmj.mongodb.net/devTinder_DB?retryWrites=true&w=majority")
    } catch (err) {
        console.log(`Error: ${err.message}`)
        process.exit(1)
    }
}

module.exports = connectDB

