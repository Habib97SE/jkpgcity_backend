const {
    DataTypes
} = require('sequelize');
const sequelize = require('../../config/sequelize');

const Token = sequelize.define('Tokens', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    token: {
        type: DataTypes.STRING,
        allowNull: false
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    tableName: 'tokens',
    timestamps: false
});

module.exports = Token;