const bcrypt = require('bcrypt');


class Encrypt {
    static generateSalt() {
        return bcrypt.genSaltSync(16);
    }

    /**
     *  Hashes a password using bcrypt and a salt generated from the email and password.
     * @param {string} email : The email of the user
     * @param {string} password : The password of the user
     * @param {string} salt : The salt to be used to hash the password
     * @returns : The hashed password
     */
    static hashPassword(email, password, salt) {
        if (salt === undefined) {
            salt = this.generateSalt();
        }
        if (salt === null) {
            salt = this.generateSalt();
        }
        if (salt === '') {
            salt = this.generateSalt();
        }
        if (password === "" || email === "") {
            return null;
        }
        return bcrypt.hashSync(email + password, salt);
    }
}

module.exports = Encrypt;