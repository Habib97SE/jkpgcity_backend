const JWT = require("../../utils/JWT");
const jsonWebToken = require('jsonwebtoken');

const jwtAuthMiddleware = (roles = []) => {
    return async (req, res, next) => {
        try {
            const token = req.cookies.auth_token;
            if (!token) {
                return res.status(401).json({message: "Unauthorized, token not found"});
            }
            const decoded = await JWT.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET);
            console.log(decoded);
            if (!roles.includes(decoded.user.role)) {
                return res.status(401).json({message: "Unauthorized, invalid role"});
            }
            req.user = decoded.user;
            next();
        } catch (error) {
            return res.status(401).json({message: "Unauthorized, error: " + error.message});
        }
    };
}

module.exports = jwtAuthMiddleware;

