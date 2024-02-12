const User = require('../../models/v1/User');
const JWT = require('../../utils/JWT');
const Token = require('../../models/v1/Token');
const Role = require('../../models/v1/Role');
const Validate = require('../../utils/Validate');
const Encrypt = require('../../utils/Encrypt');
const {
    Op
} = require('sequelize');
const {decode} = require("jsonwebtoken");


class UserController {

    /**
     * Retrieve a list of users
     * @param {Express.Request} req : Request object
     * @param {Express.Response} res : Response object
     * @returns : Promise<void> : A list of users
     */
    async getUsers(req, res) {
        let queryOptions = {
            where: {},
            order: []
        };
        const page = parseInt(req.query.page, 10) || 1; // Default to first page
        const pageSize = parseInt(req.query.pageSize, 10) || 10; // Default to 10 items per page
        queryOptions.limit = pageSize;
        queryOptions.offset = (page - 1) * pageSize;

        if (pageSize > 50) {
            res.status(400).json({
                message: 'Page size must not exceed 50'
            });
            return;
        }

        if (req.query.firstName) {
            queryOptions.where.firstName = req.query.firstName;
        }
        if (req.query.lastName) {
            queryOptions.where.lastName = req.query.lastName;
        }
        if (req.query.email) {
            queryOptions.where.email = req.query.email;
        }
        if (req.query.sort) {
            const [field, direction] = req.query.sort.split(',');
            if (['firstName', 'lastName', 'email', 'createdAt'].includes(field) && ['ASC', 'DESC'].includes(direction.toUpperCase())) {
                queryOptions.order.push([field, direction]);
            }
        }

        try {
            const {count, rows: users} = await User.findAndCountAll(queryOptions);
            const transformedUsers = users.map(user => this.createUserData(user)); // Transform each user

            // Add links to each user
            transformedUsers.forEach(user => {
                user.links = {
                    self: {
                        href: `api/v1/users/${user.userId}`,
                        method: 'GET'
                    },
                    update: {
                        href: `api/v1/users/${user.userId}`,
                        method: 'PUT'
                    },
                    delete: {
                        href: `api/v1/users/${user.userId}`,
                        method: 'DELETE'
                    }
                };
            });

            const totalPages = Math.ceil(count / pageSize);
            res.status(200).json({
                message: "Success",
                data: transformedUsers, // Send transformed users in response
                pagination: {
                    totalItems: count,
                    currentPage: page,
                    pageSize: pageSize,
                    totalPages: totalPages
                }
            });
        } catch (error) {
            res.status(500).json({
                message: error.message
            });
        }
    }

    getRole(roleId) {
        let role = "";
        switch (roleId) {
            case 2:
                role = "visitor"
                break;
            case 3:
                role = "user"
                break;
            case 4:
                role = "venueOwner"
                break;
            case 5:
                role = "moderator"
                break;
            case 6:
                role = "admin"
                break;
            default:
                role = null;
                break;
        }
        return role;
    }

    createUserData(user) {
        return {
            userId: user.userId,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone,
            bio: user.bio,
            facebook: user.facebook,
            instagram: user.instagram,
            twitter: user.twitter,
            role: this.getRole(user.roleId)
        };
    }

    async getUser(req, res) {
        const userId = req.params.id;
        if (!Validate.isValidId(userId)) {
            res.status(400).json({
                message: 'Invalid user id'
            });
            return;
        }
        const user = await User.findByPk(userId);
        if (!user) {
            res.status(404).json({
                message: "User not found."
            })
        }

        res.status(200).json({
            message: "Success",
            data: this.createUserData(user)
        })
    }

    async createUser(req, res) {
        try {
            const user = {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                password: req.body.password,
                roleId: req.body.role
            }
            // validate user input
            if (!Validate.newUser(user)) {
                res.status(Validate.newUser(user).message).json({
                    message: Validate.newUser(user).message
                });
                return;
            }
            const salt = Encrypt.generateSalt();
            user.password = Encrypt.hashPassword(user.email, user.password, salt);
            user.salt = salt;
            const newUser = await User.create(user);
            const role = await Role.findByPk(newUser.roleId);
            const accessToken = await JWT.generateAccessToken({
                userId: newUser.userId,
                email: newUser.email,
                role: role.roleName,
                fullName: `${newUser.firstName} ${newUser.lastName}`
            });
            const refreshToken = await JWT.generateRefreshToken({
                userId: newUser.userId,
                email: newUser.email,
                role: role.roleName,
                fullName: `${newUser.firstName} ${newUser.lastName}`
            });
            // store refreshToken in database
            const token = {
                user_id: newUser.userId,
                token: refreshToken
            }
            await Token.create(token);

            // store refreshToken in cookie
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
            });

            res.status(201).json({
                message: "Success",
                data: this.createUserData(newUser),
                accessToken: accessToken,
            });
            return;
        } catch (error) {
            res.status(500).json({
                message: error.message
            });
            return;
        }
    }

    parseCookies(cookieHeader) {
        const cookies = {};
        cookieHeader.forEach(cookie => {
            const parts = cookie.split(';');
            const cookieName = parts.shift().trim();
            const [name, value] = cookieName.split('=');
            cookies[name] = value;
        });
        return cookies;
    }

    async login(req, res) {
        try {
            const cookieHeaderIndex = req.rawHeaders.indexOf('Cookie');
            const cookieHeader = req.rawHeaders.slice(cookieHeaderIndex + 1);

// Parse the cookies and access the refreshToken
            const cookies = this.parseCookies(cookieHeader);
            const refreshToken1 = cookies.refreshToken;
            if (refreshToken1) {

                res.status(400).json({
                    message: 'Already logged in'
                });
                return;
            }
            const email = req.body.email;
            const password = req.body.password;
            if (!email || !password) {
                res.status(400).json({
                    message: 'Email and password are required'
                });
                return;
            }
            const user = await User.findOne({
                where: {
                    email: email
                }
            });
            if (!user) {
                res.status(404).json({
                    message: 'User not found'
                });
                return;
            }
            const hash = Encrypt.hashPassword(email, password, user.salt);
            if (hash === null) {
                res.status(500).json({
                    message: 'Internal server error.'
                });
                return;
            }

            if (hash !== user.password) {
                res.status(401).json({
                    message: 'Invalid credentials'
                });
                return;
            }
            const role = await Role.findByPk(user.roleId);
            const accessToken = await JWT.generateAccessToken({
                userId: user.userId,
                email: user.email,
                role: role.roleName,
                fullName: `${user.dataValues.firstName} ${user.dataValues.lastName}`
            });
            const refreshToken = await JWT.generateRefreshToken({
                userId: user.userId,
                email: user.email,
                role: role.roleName,
                fullName: `${user.firstName} ${user.lastName}`
            });
            // store refreshToken in database
            const token = {
                user_id: user.userId,
                token: refreshToken
            }
            await Token.create(token);

            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
            });

            res.status(200).json({
                message: 'Success',
                data: this.createUserData(user),
                accessToken: accessToken
            });
            return;
        } catch (error) {
            res.status(500).json({
                message: error.message
            });
            return;
        }
    }

    async updateUser(req, res) {
        try {

            const userId = req.params.id;
            const user = await User.findByPk(userId);
            if (!user) {
                res.status(404).json({
                    message: 'User not found'
                });
                return;
            }
            const newAccessToken = await JWT.generateAccessToken({
                userId: user.userId,
                email: user.email,
                role: decodedToken.user.role,
                fullName: `${user.firstName} ${user.lastName}`
            });

            await user.update(req.body);
            res.status(200).json({
                message: 'Success',
                data: user,
                accessToken: newAccessToken
            });
        } catch (error) {
            res.status(500).json({
                message: error.message
            });
        }
    }

    async deleteUser(req, res) {
        try {
            if (!Validate.isValidId(req.params.userId)) {
                res.status(400).json({
                    message: 'Invalid user id'
                });
                return;
            }
            const user = await User.findByPk(userId);
            if (!user) {
                res.status(404).json({
                    message: 'User not found'
                });
                return;
            }
            await user.destroy();
            res.status(204).json({
                message: 'Success',
                data: this.createUserData(user)
            });
        } catch (error) {
            res.status(500).json({
                message: error.message
            });
        }
    }
}

module.exports = new UserController();