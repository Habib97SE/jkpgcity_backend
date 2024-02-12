class Validate {
    static isEmail(email) {
        const regex = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
        return new RegExp(regex).test(email);
    }

    static isValidId(id) {
        return parseInt(id) > 0;
    }

    static isPassword(password) {
        return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/.test(password);
    }

    static isName(name) {
        const regex = "^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$"
        return new RegExp(regex).test(name);
    }

    static isPhone(phone) {
        return /^\d{10}$/.test(phone);
    }

    static isNumber(number) {
        return /^\d+$/.test(number);
    }

    static newUser(user) {
        if (!this.isEmail(user.email)) {
            return {
                status: 400,
                message: 'Invalid email'
            };
        }
        if (!this.isPassword(user.password)) {
            return {
                status: 400,
                message: 'Invalid password'
            };
        }
        if (!this.isName(user.firstName)) {
            return {
                status: 400,
                message: 'Invalid first name'
            };
        }
        if (!this.isName(user.lastName)) {
            return {
                status: 400,
                message: 'Invalid last name'
            };
        }
        return true;
    }

    static newVenue(venue) {
        if (!this.isNumber(venue.venueCategoryId)) {
            return false;
        }
        if (!this.name(venue.name)) {
            return false;
        }
        if (!this.isPhone(venue.phone)) {
            return false;
        }
        if (!this.isEmail(venue.email)) {
            return false;
        }
        return true;
    }
}

module.exports = Validate;