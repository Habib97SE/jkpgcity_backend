const express = require('express');
const router = express.Router();
const VenueController = require('../../controllers/v1/VenueController');
const VenueCategoryController = require('../../controllers/v1/VenueCategoryController');
const VenueNewsController = require('../../controllers/v1/VenueNewsController');
const jwtAuthMiddleware = require("./jwtAuthMiddleware");

// Venue Category Controller routes

// Get all venue categories
router.get('/categories', (req, res) => {
    VenueCategoryController.getVenueCategories(req, res);
});

// Get a specific venue category by id
router.get('/categories/:id', (req, res) => {
    VenueCategoryController.getVenueCategory(req, res);
});

// Create a new venue category (requires admin or moderator role)
router.post('/categories', jwtAuthMiddleware(['amdin', 'moderator']), (req, res) => {
    VenueCategoryController.createVenueCategory(req, res);
});

// Update a venue category (requires admin or moderator role)
router.put('/categories/:id', jwtAuthMiddleware(['amdin', 'moderator']), (req, res) => {
    VenueCategoryController.updateVenueCategory(req, res);
});

// Delete a venue category (requires admin or moderator role)
router.delete('/categories/:id', jwtAuthMiddleware(['amdin', 'moderator']), (req, res) => {
    VenueCategoryController.deleteVenueCategory(req, res);
});

// Venue News Controller routes
// Get all venue news
router.get('/news', (req, res) => {
    VenueNewsController.getVenueNews(req, res);
});

// Get a specific venue news by id
router.get('/news/:id', (req, res) => {
    VenueNewsController.getVenueNews(req, res);
});

// Create a new venue news (requires admin or moderator role)
router.post('/news', jwtAuthMiddleware(['amdin', 'moderator']), (req, res) => {
    VenueNewsController.createVenueNews(req, res);
});

// Update a venue news (requires admin or moderator role)
router.put('/news/:id', jwtAuthMiddleware(['amdin', 'moderator']), (req, res) => {
    VenueNewsController.updateVenueNews(req, res);
});

// Delete a venue news (requires admin or moderator role)
router.delete('/news/:id', jwtAuthMiddleware(['amdin', 'moderator']), (req, res) => {
    VenueNewsController.deleteVenueNews(req, res);
});

// Venue Controller routes
// Get all venues
router.get('/', (req, res) => {
    VenueController.getVenues(req, res);
});

// Get a specific venue by id
router.get('/:id', (req, res) => {
    VenueController.getVenue(req, res);
});

// Create a new venue (requires admin or moderator role)
router.post('/', jwtAuthMiddleware(['amdin', 'moderator']), (req, res) => {
    VenueController.createVenue(req, res);
});

// Update a venue (requires admin or moderator role)
router.put('/:id', (req, res) => {
    VenueController.updateVenue(req, res);
});

router.delete('/:id', jwtAuthMiddleware(['amdin', 'moderator']), (req, res) => {
    VenueController.deleteVenue(req, res);
});

module.exports = router;