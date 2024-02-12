const express = require('express');
const router = express.Router();
const NewsController = require('../../controllers/v1/NewsController');
const NewsCategoryController = require('../../controllers/v1/NewsCategoryController');
const jwtAuthMiddleware = require('./jwtAuthMiddleware');

// News Category Controller routes

// Get all news categories
router.get('/categories', (req, res) => {
    NewsCategoryController.getNewsCategories(req, res)
});

// Get news category by id
router.get('/categories/:id', (req, res) => {
    NewsCategoryController.getNewsCategoryById(req, res)
});

// Create news category (only admin and moderator)
router.post('/categories', jwtAuthMiddleware(['admin', 'moderator']), (req, res) => {
    NewsCategoryController.createNewsCategory(req, res)
});

// Update news category (only admin and moderator)
router.put('/categories/:id', jwtAuthMiddleware(['admin', 'moderator']), (req, res) => {
    NewsCategoryController.updateNewsCategory(req, res)
});

// Delete news category (only admin and moderator)
router.delete('/categories/:id', jwtAuthMiddleware(['admin', 'moderator']), (req, res) => {
    NewsCategoryController.deleteNewsCategory(req, res)
});


// News Controller routes

// Get all news
router.get('/', (req, res) => {
    NewsController.getNews(req, res)
});

// Get news by id
router.get('/:id', (req, res) => {
    NewsController.getNewsById(req, res)
});

// Create news (only admin and moderator)
router.post('/', jwtAuthMiddleware(['amdin', 'moderator']),(req, res) => {
    NewsController.createNews(req, res)
});

// Update news (only admin and moderator)
router.put('/:id', jwtAuthMiddleware(['amdin', 'moderator']), (req, res) => {
    NewsController.updateNews(req, res)
});

// Delete news (only admin and moderator)
router.delete('/:id', jwtAuthMiddleware(['amdin', 'moderator']), (req, res) => {
    NewsController.deleteNews(req, res)
});

module.exports = router;