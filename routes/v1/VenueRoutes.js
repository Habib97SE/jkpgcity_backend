const express = require('express');
const router = express.Router();
const VenueController = require('../../controllers/v1/VenueController');


router.get('/', (req, res) => {
    VenueController.getVenues(req, res);
});

router.get('/:id', (req, res) => {
    VenueController.getVenue(req, res);
});

router.post('/', (req, res) => {
    VenueController.createVenue(req, res);
});

router.put('/:id', (req, res) => {
    VenueController.updateVenue(req, res);
});

router.delete('/:id', (req, res) => {
    VenueController.deleteVenue(req, res);
});