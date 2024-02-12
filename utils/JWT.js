const jsonWebToken = require('jsonwebtoken');
const bcrypt = require('bcrypt');

class JWT {

    /**
     *
     * 1. userId: The user id
     * 2. email: The user email
     * 3. role: The user role
     * 4. fullName: The user full name
     * 5. iss: The issuer of the token
     * 6. sub: The subject of the token
     * 7. exp: The expiration time of the token
     * 8. iat: The time the token was issued
     * 9. jti: The unique identifier of the token
     * @param user {Object} The user object
     */
    static async generateAccessToken(user) {
        console.dir(user);
        try {
            const payload = {
                user: {
                    userId: user.userId,
                    email: user.email,
                    role: user.role,
                    fullName: user.fullName
                },
                iss: 'https://www.jkpgcity.com',
                sub: 'auth',
                iat: Math.floor(Date.now() / 1000),
                exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24), // 24 hours (1 day)
                jti: await JWT.generateUniqueIdentifier(user.email)
            };
            const secretAccessToken = process.env.JWT_ACCESS_TOKEN_SECRET;

            return await jsonWebToken.sign(payload, secretAccessToken);
        } catch (error) {
            console.error('Error generating access token:', error);
            return false;
        }
    }

    static async generateRefreshToken(user) {
        try {
            const payload = {
                user: {
                    userId: user.userId,
                    email: user.email,
                    role: user.roleId,
                    fullName: `${user.firstName} ${user.lastName}`
                },
                iss: 'https://www.jkpgcity.com',
                sub: 'auth',
                iat: Math.floor(Date.now() / 1000),
                exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 7), // 7 days
                jti: await JWT.generateUniqueIdentifier(user.email + 'refresh')
            };
            const secretAccessToken = process.env.JWT_ACCESS_TOKEN_SECRET;
            return await jsonWebToken.sign(payload, secretAccessToken);
        } catch (error) {
            console.error('Error generating access token:', error);
            return false;
        }
    }

    static async verifyToken(token, secret) {
        return await jsonWebToken.verify(token, secret);
    }

    static async decodeToken(token) {
        return await jsonWebToken.decode(token);
    }

    static async getTokenFromHeaders(headers) {
        // return token in object
        if (headers.authorization && headers.authorization.split(' ')[0] === 'Bearer') {
            return headers.authorization.split(' ')[1];
        }
    }

    static async getTokenFromCookies(cookies) {
        return cookies.token;
    }

    static async generateNewAccessToken(payload) {
        // check if the refresh token is valid
        const secretAccessToken = process.env.JWT_ACCESS_TOKEN_SECRET;
        return await jsonWebToken.sign(payload, secretAccessToken, {
            expiresIn: '15m'
        });
    }

    static async generateUniqueIdentifier(uniqueValue) {
        const currentDateTime = new Date();
        return await bcrypt.hash(`${uniqueValue}${currentDateTime}`, 10);
    }


    static async verify(token, secretKey) {
        return jsonWebToken.verify(token, secretKey);
    }

}

module.exports = JWT;