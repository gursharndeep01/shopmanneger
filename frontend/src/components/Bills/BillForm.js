import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { billAPI, customerAPI, productAPI } from '../../services/api';

const BillForm = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    customer: '',
    items: [{ product: '', quantity: 1 }],
    tax: 0,
    discount: 0,
    amountPaid: 0,
    paymentType: 'cash',
    notes: '',
  });

  useEffect(() => {
    fetchCustomersAndProducts();
  }, []);

  const fetchCustomersAndProducts = async () => {
    try {
      const [customersRes, productsRes] = await Promise.all([
        customerAPI.getAll(),
        productAPI.getAll(),
      ]);
      setCustomers(customersRes.data);
      setProducts(productsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index][field] = value;
    setFormData({ ...formData, items: newItems });
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { product: '', quantity: 1 }],
    });
  };

  const removeItem = (index) => {
    const newItems = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items: newItems });
  };

  const calculateTotal = () => {
    let subtotal = 0;
    formData.items.forEach(item => {
      const product = products.find(p => p._id === item.product);
      if (product) {
        subtotal += product.price * item.quantity;
      }
    });
    const total = subtotal + Number(formData.tax) - Number(formData.discount);
    return { subtotal, total };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = {
        customer: formData.customer,
        items: formData.items.filter(item => item.product),
        tax: Number(formData.tax),
        discount: Number(formData.discount),
        amountPaid: Number(formData.amountPaid),
        paymentType: formData.paymentType,
        notes: formData.notes,
      };

      await billAPI.create(dataToSend);
      navigate('/bills');
    } catch (error) {
      console.error('Error creating bill:', error);
      alert(error.response?.data?.error || 'Failed to create bill');
    }
  };

  const { subtotal, total } = calculateTotal();

  return (
    <div>
      <div className="page-header">
        <h2>Create New Bill</h2>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit}>

          {}
          <div className="form-group">
            <label>Customer *</label>
            <select
              name="customer"
              value={formData.customer}
              onChange={handleChange}
              required
            >
              <option value="">Select Customer</option>
              {customers.map(customer => (
                <option key={customer._id} value={customer._id}>
                  {customer.name} - {customer.phone}
                </option>
              ))}
            </select>
          </div>

          {}
          <h3 style={{ marginTop: '30px', marginBottom: '15px' }}>Items</h3>

          {formData.items.map((item, index) => (
            <div key={index} style={{ display: 'flex', gap: '10px', marginBottom: '15px', alignItems: 'flex-end' }}>
              
              <div className="form-group" style={{ flex: 2, marginBottom: 0 }}>
                <label>Product</label>
                <select
                  value={item.product}
                  onChange={(e) => handleItemChange(index, 'product', e.target.value)}
                  required
                >
                  <option value="">Select Product</option>
                  {products.map(product => (
                    <option key={product._id} value={product._id}>
                      {product.name} - ₹{product.price} (Stock: {product.stock})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                <label>Quantity</label>
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                  min="1"
                  required
                />
              </div>

              {formData.items.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  className="btn btn-danger"
                >
                  Remove
                </button>
              )}
            </div>
          ))}

          <button type="button" onClick={addItem} className="btn btn-secondary" style={{ marginBottom: '20px' }}>
            + Add Item
          </button>

          {}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="form-group">
              <label>Tax (₹)</label>
              <input type="number" name="tax" value={formData.tax} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>Discount (₹)</label>
              <input type="number" name="discount" value={formData.discount} onChange={handleChange} />
            </div>
          </div>

          {}
          <div className="total-box">
            <p>Subtotal: ₹{subtotal.toLocaleString()}</p>
            <p>Tax: ₹{Number(formData.tax).toLocaleString()}</p>
            <p>Discount: -₹{Number(formData.discount).toLocaleString()}</p>
            <p className="grand-total">Total: ₹{total.toLocaleString()}</p>
          </div>

          {}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="form-group">
              <label>Amount Paid (₹)</label>
              <input type="number" name="amountPaid" value={formData.amountPaid} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>Payment Type</label>
              <select name="paymentType" value={formData.paymentType} onChange={handleChange}>
                <option value="cash">Cash</option>
                <option value="card">Card</option>
                <option value="upi">UPI</option>
                <option value="bank_transfer">Bank Transfer</option>
              </select>
            </div>
          </div>

          {}
          <div className="form-group">
            <label>Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="3"
              placeholder="Any additional notes..."
            />
          </div>

          {}
          {total - Number(formData.amountPaid) > 0 && (
            <div style={{
              padding: '15px',
              background: '#2a2a2a',
              border: '1px solid #444',
              borderRadius: '8px',
              marginBottom: '20px',
              color: '#ffffff'
            }}>
              <strong>Remaining Payment:</strong> ₹{(total - Number(formData.amountPaid)).toLocaleString()}
            </div>
          )}

          {}
          <div className="form-actions">
            <button type="submit" className="btn btn-primary">Create Bill</button>
            <button type="button" onClick={() => navigate('/bills')} className="btn btn-secondary">
              Cancel
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default BillForm;