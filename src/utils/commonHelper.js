
const bcrypt = require('bcrypt');
const saltRounds = 10;
const passwordHashing = async (passwordInput) => {
    const passwordHash = await bcrypt.hash(passwordInput, saltRounds);
    return passwordHash;
}



module.exports = {
    passwordHashing
}
