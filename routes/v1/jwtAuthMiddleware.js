const JWT = require("../../utils/JWT");
const { TokenExpiredError } = require("jsonwebtoken");

const jwtAuthMiddleware = (roles = []) => {
    return async (req, res, next) => {
        const token = req.headers.authorization;
        if (!token) {
            return res.status(401).json({ message: "Token is required" });
        }
        try {
            const decoded = await JWT.verify(token);
            if (roles.length && !roles.includes(decoded.role)) {
                return res.status(403).json({ message: "You don't have permission" });
            }
            req.user = decoded;
            next();
        } catch (error) {
            console.log(error)
            // check for refreshToken
            const headers = req.rawHeaders;
            const refreshToken = headers.find((header) => header.includes("refreshToken")).split("=")[1]
            const decoded = await JWT.verify(refreshToken);
            if (roles.length && !roles.includes(decoded.role)) {
                return res.status(403).json({ message: "You don't have permission" });
            }
            req.user = decoded;
            next();
        }
    };
}

module.exports = jwtAuthMiddleware;
