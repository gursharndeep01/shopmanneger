const protect = require('../middlewares/authMiddleware');
const express = require('express');
const router = express.Router();
const billController = require('../controllers/billController');
const { validateBill } = require('../middlewares/validate');

router.get('/', protect, billController.getAllBills);
router.get('/:id', protect, billController.getBill);
router.get('/customer/:customerId', protect, billController.getBillsByCustomer);
router.post('/', protect, validateBill, billController.createBill);
router.patch('/:id/payment', protect, billController.updatePayment);
router.delete('/:id', protect, billController.deleteBill);

module.exports = router;