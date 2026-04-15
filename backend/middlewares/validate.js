const validateProduct = (req, res, next) => {
  const { name, price, stock } = req.body;

  if (!name || !price || stock === undefined) {
    return res.status(400).json({
      error: 'Missing required fields: name, price, and stock are required'
    });
  }

  if (price < 0 || stock < 0) {
    return res.status(400).json({
      error: 'Price and stock must be non-negative'
    });
  }

  next();
};

const validateCustomer = (req, res, next) => {
  const { name, phone } = req.body;

  if (!name || !phone) {
    return res.status(400).json({
      error: 'Missing required fields: name and phone are required'
    });
  }

  next();
};

const validateBill = (req, res, next) => {
  const { customer, items } = req.body;

  if (!customer || !items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({
      error: 'Customer and at least one item are required'
    });
  }

  next();
};

module.exports = { validateProduct, validateCustomer, validateBill };