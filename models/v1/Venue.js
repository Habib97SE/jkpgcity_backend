const {
    DataTypes
} = require('sequelize');
const sequelize = require("../../config/sequelize");
const VenueCategory = require('./VenueCategory');

const Venue = sequelize.define('venue', {
    venueId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    venueCategoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'venueCategory',
            key: 'venueCategoryId'
        }
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    address: {
        type: DataTypes.STRING,
        allowNull: false
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isPhone: true
        }
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isEmail: true
        }
    },
    website: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            isUrl: true
        }
    },
    bio: {
        type: DataTypes.STRING,
        allowNull: true
    }
});

Venue.belongsTo(VenueCategory, {
    foreignKey: 'venueCategoryId'
});

VenueCategory.hasMany(Venue, {
    foreignKey: 'venueCategoryId'
});


module.exports = Venue;