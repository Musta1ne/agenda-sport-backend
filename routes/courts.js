const express = require('express');
const router = express.Router();
const courtController = require('../controllers/courtController');
const { verifyToken } = require('../middlewares/authMiddleware');

// Rutas públicas
router.get('/:id/availability', courtController.getAvailability);

// Rutas protegidas que requieren autenticación
router.post('/', verifyToken, courtController.create);
router.put('/:id', verifyToken, courtController.update);
router.delete('/:id', verifyToken, courtController.delete);

module.exports = router;