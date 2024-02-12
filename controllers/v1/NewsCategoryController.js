const NewsCategory = require('../../models/v1/NewsCategory');
const Permission = require('../../models/v1/Permission');


class NewsCategoryController {

    async getNewsCategories(req, res) {
        try {
            const newsCategories = await NewsCategory.find();
            if (newsCategories.length === 0) {
                return res.status(404).json({
                    message: 'No news categories found'
                });
            }
            res.status(200).json({
                message: 'Success',
                data: newsCategories
            });
        } catch (error) {
            res.status(500).json({
                message: error.message
            });
        }
    }

    async getNewsCategoryById(req, res) {
        try {
            const newsCategory = await NewsCategory.findById(req.params.id);
            res.status(200).json(newsCategory);
        } catch (error) {
            res.status(500).json({
                message: error.message
            });
        }
    }

    async createNewsCategory(req, res) {
        try {
            const newsCategory = new NewsCategory(req.body);
            await newsCategory.save();
            res.status(201).json(newsCategory);
        } catch (error) {
            res.status(500).json({
                message: error.message
            });
        }
    }

    async updateNewsCategory(req, res) {
        try {
            const newsCategory = await NewsCategory.findById(req.params.id);
            Object.assign(newsCategory, req.body);
            await newsCategory.save();
            res.status(200).json(newsCategory);
        } catch (error) {
            res.status(500).json({
                message: error.message
            });
        }
    }

    async deleteNewsCategory(req, res) {
        try {
            const newsCategory = await NewsCategory.findById(req.params.id);
            await newsCategory.remove();
            res.status(204).json();
        } catch (error) {
            res.status(500).json({
                message: error.message
            });
        }
    }
}

module.exports = new NewsCategoryController();