const validator = require('validator')

const validationSignUp = (req) => {

    const {firstName, lastName, emailId, password, skills} = req.body;

    if(!firstName || !lastName || !emailId || !password) {
        throw new Error("All fields are required")
    } else if(firstName.length < 4 && firstName.length > 50) {
        throw new Error("First Name should be between 4 to 50 characters")
    } else if(!validator.isEmail(emailId)) {
        throw new Error("Invalid Email")
    } else if(!validator.isStrongPassword(password)) {
        throw new Error("Enter Strong Password")
    }else if (skills && Array.isArray(skills) && skills?.length > 10) {
        throw new Error("You cannot add more than 10 skills.");
    }

}

const validationLogin = (req) => {

    const {emailId, password} = req.body;

    if(!emailId || !password) {
        throw new Error("All fields are required")
    } else if(!validator.isEmail(emailId)) {
        throw new Error("Invalid Email")
    }

}

module.exports = {
    validationSignUp,
    validationLogin
}