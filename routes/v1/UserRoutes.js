const express = require('express');
const router = express.Router();
const UserController = require('../../controllers/v1/UserController');
const jwtAuthMiddleware = require('./jwtAuthMiddleware');

// Get all users (requires admin or moderator role)
router.get('/', jwtAuthMiddleware(['admin', 'moderator']), (req, res) => {
    UserController.getUsers(req, res);
});

// User login (no authentication required)
router.post("/login", (req, res) => {
    UserController.login(req, res);
})

// User logout (requires user role)
router.get("/logout", jwtAuthMiddleware(['user']), (req, res) => {
    UserController.logout(req, res);
})

// Get a single user by ID (requires admin or moderator role)
router.get('/:id', jwtAuthMiddleware(['user','admin', 'moderator']), (req, res) => {
    UserController.getUser(req, res);
});

// Create a new user (no authentication required)
router.post('/', (req, res) => {
    UserController.createUser(req, res);
});

// Update a user by ID (requires admin or moderator role)
router.put('/:id', jwtAuthMiddleware(['admin', 'moderator']), (req, res) => {
    UserController.updateUser(req, res);
});

// Delete a user by ID (requires admin or moderator role)
router.delete('/:id', jwtAuthMiddleware(['admin', 'moderator']), (req, res) => {
    UserController.deleteUser(req, res);
});

module.exports = router;
