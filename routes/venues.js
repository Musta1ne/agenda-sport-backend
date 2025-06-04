const express = require('express');
const router = express.Router();
const venueController = require('../controllers/venueController');

// Rutas para venues
router.get('/', venueController.getAllVenues);
router.get('/:id', venueController.getVenueById);
router.get('/:id/courts', venueController.getVenueCourts);
router.post('/', venueController.createVenue);
router.put('/:id', venueController.updateVenue);
router.delete('/:id', venueController.deleteVenue);

module.exports = router;