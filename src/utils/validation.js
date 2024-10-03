const validator = require('validator')
const User = require('../models/user')

const validationSignUp = (req) => {

    const { firstName, lastName, emailId, password, skills } = req.body;

    if (!firstName || !lastName || !emailId || !password) {
        throw new Error("All fields are required")
    } else if (firstName.length < 4 && firstName.length > 50) {
        throw new Error("First Name should be between 4 to 50 characters")
    } else if (!validator.isEmail(emailId)) {
        throw new Error("Invalid Email")
    } else if (!validator.isStrongPassword(password)) {
        throw new Error("Enter Strong Password")
    } else if (skills && Array.isArray(skills) && skills?.length > 10) {
        throw new Error("You cannot add more than 10 skills.");
    }

}

const validationLogin = (req) => {

    const { emailId, password } = req.body;

    if (!emailId || !password) {
        throw new Error("All fields are required")
    } else if (!validator.isEmail(emailId)) {
        throw new Error("Invalid Email")
    }

}

const validationEditProfileData = (req) => {
    const allowedFields = ['firstName', 'lastName', 'about', 'photoUrl', 'gender', 'age', 'skills']
    const updates = Object.keys(req.body)
    const isEditAllowed = updates.every((field) => allowedFields.includes(field))
    if (!isEditAllowed) {
        throw new Error("Invalid Updates")
    }
}

const validatedPassword = (req) => {
    const { password, newPassword, confirmPassword } = req.body;
    if (!password || !newPassword || !confirmPassword) {
        throw new Error("All fields are required")
    } else if (newPassword !== confirmPassword) {
        throw new Error("Passwords do not match")
    } else if (!validator.isStrongPassword(newPassword)) {
        throw new Error("Enter Strong Password")
    }
}

const validatedConnectionRequest = (loginUser, params) => {
    const allowwedStatus = ['ignore', 'interested']
    const fromUserId = loginUser._id;
    const toUserId = params.toUserId;
    const status =  params.status

    if (!fromUserId || !toUserId) {
        throw new Error("User Id are not provided")
    }
    
    if (!status) {
        throw new Error("Status is not provided")
    }

    const checkStatus = allowwedStatus.includes(status)
    if (!checkStatus) {
        throw new Error("Invalid status")
    }

    return { fromUserId, toUserId, status }
}

module.exports = {
    validationSignUp,
    validationLogin,
    validationEditProfileData,
    validatedPassword,
    validatedConnectionRequest
}