const {
    DataTypes
} = require('sequelize');
const sequelize = require("../../config/sequelize");
const User = require('./User');

const News = sequelize.define('news', {
    newsId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    slug: {
        type: DataTypes.STRING,
        allowNull: false
    },
    summary: {
        type: DataTypes.STRING,
        allowNull: false
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    authorId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    published: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    publishedAt: {
        type: DataTypes.DATE,
        allowNull: true
    },
    likes: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    views: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
});

News.belongsTo(User, {
    foreignKey: 'authorId'
});

User.hasMany(News, {
    foreignKey: 'authorId'
});

module.exports = News;