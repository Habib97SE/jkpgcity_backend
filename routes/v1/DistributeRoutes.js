const router = require('express').Router();
const UserRoutes = require('./UserRoutes');
const VenueRoutes = require('./VenueRoutes');

router.get('/users', UserRoutes);
router.get('/venues', VenueRoutes);