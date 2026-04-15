const protect = require('../middlewares/authMiddleware');
const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { validateProduct } = require('../middlewares/validate');

router.get('/', protect, productController.getAllProducts);
router.get('/low-stock', protect, productController.getLowStock);
router.get('/:id', protect, productController.getProduct);
router.post('/', protect, validateProduct, productController.createProduct);
router.put('/:id', protect, productController.updateProduct);
router.delete('/:id', protect, productController.deleteProduct);

module.exports = router;