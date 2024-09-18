 const adminAuth =  (req, res, next) => {
    console.log("Admin auth is getting checked!")
    const token = "xyz"
    const isAdminAuthorized = token === "xyz";
    if (isAdminAuthorized) {
        next()
    } else {
        res.send("Admin is not authorized")
    }
}

const userAuth =  (req, res, next) => {
    console.log("User auth is getting checked!")
    const token = "xyz"
    const isUserAuthorized = token === "xyz";
    if (isUserAuthorized) {
        next()
    } else {
        res.send("User is not authorized")
    }
}


module.exports = {
    adminAuth,
    userAuth
}