const express = require('express');
const router = express.Router();
const sportController = require('../controllers/sportController');
const { verifyToken } = require('../middlewares/authMiddleware');

// Ruta pública para listar deportes
router.get('/', sportController.getAll);

// Rutas protegidas que requieren autenticación
router.post('/', verifyToken, sportController.create);
router.put('/:id', verifyToken, sportController.update);
router.delete('/:id', verifyToken, sportController.delete);

module.exports = router;