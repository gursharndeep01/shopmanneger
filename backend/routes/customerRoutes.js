const protect = require('../middlewares/authMiddleware');
const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');
const { validateCustomer } = require('../middlewares/validate');

router.get('/', protect, customerController.getAllCustomers);
router.get('/:id', protect, customerController.getCustomer);
router.post('/', protect, validateCustomer, customerController.createCustomer);
router.put('/:id', protect, customerController.updateCustomer);
router.delete('/:id', protect, customerController.deleteCustomer);

module.exports = router;