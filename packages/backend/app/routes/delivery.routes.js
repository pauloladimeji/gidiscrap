const router = require('express').Router();

const delivery = require('../controllers/delivery.controller');

// Create a new Company
router.get('/', delivery.getAllDeliveries);
router.get('/:id', delivery.getRequestDeliveries);
router.get('/:id/requests', delivery.getRequestDeliveries);

module.exports = router;
