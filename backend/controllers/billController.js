const Bill = require('../models/Bill.js');
const Customer = require('../models/Customer.js');
const Product = require('../models/Product.js');

const generateBillNumber = async () => {
  const count = await Bill.countDocuments();
  return `BILL-${Date.now()}-${count + 1}`;
};

exports.getAllBills = async (req, res) => {
  try {
    const bills = await Bill.find({ userId: req.user._id })
      .populate('customer', 'name phone')
      .populate('items.product', 'name price')
      .sort({ createdAt: -1 });
    res.json(bills);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getBill = async (req, res) => {
  try {
    const bill = await Bill.findOne({ _id: req.params.id, userId: req.user._id })
      .populate('customer')
      .populate('items.product');
    if (!bill) {
      return res.status(404).json({ error: 'Bill not found' });
    }
    res.json(bill);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createBill = async (req, res) => {
  try {
    const { customer, items, tax = 0, discount = 0, amountPaid = 0, paymentType } = req.body;

    const customerDoc = await Customer.findOne({ _id: customer, userId: req.user._id });
    if (!customerDoc) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    let subtotal = 0;
    const billItems = [];

    for (const item of items) {
      const product = await Product.findOne({ _id: item.product, userId: req.user._id });
      if (!product) {
        return res.status(404).json({ error: `Product ${item.product} not found` });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          error: `Insufficient stock for ${product.name}. Available: ${product.stock}`
        });
      }

      const itemTotal = product.price * item.quantity;
      subtotal += itemTotal;

      billItems.push({
        product: product._id,
        quantity: item.quantity,
        price: product.price,
        total: itemTotal
      });

      product.stock -= item.quantity;
      await product.save();
    }

    const totalAmount = subtotal + tax - discount;
    const remainingAmount = totalAmount - amountPaid;

    let paymentStatus = 'unpaid';
    if (amountPaid >= totalAmount) paymentStatus = 'paid';
    else if (amountPaid > 0) paymentStatus = 'partial';

    const billNumber = await generateBillNumber();

    const bill = new Bill({
      userId: req.user._id,
      billNumber,
      customer,
      items: billItems,
      subtotal,
      tax,
      discount,
      totalAmount,
      amountPaid,
      remainingAmount,
      paymentType: remainingAmount > 0 ? 'partial' : paymentType,
      paymentStatus
    });

    await bill.save();

    customerDoc.totalPurchases += totalAmount;
    customerDoc.totalPaid += amountPaid;
    customerDoc.remainingPayment += remainingAmount;
    await customerDoc.save();

    const populatedBill = await Bill.findById(bill._id)
      .populate('customer')
      .populate('items.product');

    res.status(201).json(populatedBill);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updatePayment = async (req, res) => {
  try {
    const { amountPaid, paymentType } = req.body;

    const bill = await Bill.findOne({ _id: req.params.id, userId: req.user._id }).populate('customer');
    if (!bill) {
      return res.status(404).json({ error: 'Bill not found' });
    }

    const additionalPayment = amountPaid - bill.amountPaid;
    bill.amountPaid = amountPaid;
    bill.remainingAmount = bill.totalAmount - amountPaid;

    if (bill.remainingAmount <= 0) {
      bill.paymentStatus = 'paid';
      bill.paymentType = paymentType;
    } else if (bill.amountPaid > 0) {
      bill.paymentStatus = 'partial';
      bill.paymentType = 'partial';
    }

    await bill.save();

    const customer = await Customer.findById(bill.customer._id);
    customer.totalPaid += additionalPayment;
    customer.remainingPayment -= additionalPayment;
    await customer.save();

    res.json(bill);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getBillsByCustomer = async (req, res) => {
  try {
    const bills = await Bill.find({ userId: req.user._id, customer: req.params.customerId })
      .populate('items.product')
      .sort({ createdAt: -1 });
    res.json(bills);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteBill = async (req, res) => {
  try {
    const bill = await Bill.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!bill) {
      return res.status(404).json({ error: 'Bill not found' });
    }
    res.json({ message: 'Bill deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};