import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { billAPI } from '../../services/api';

const BillDetail = () => {
  const { id } = useParams();
  const [bill, setBill] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentType, setPaymentType] = useState('cash');

  useEffect(() => {
    fetchBill();
  }, [id]);

  const fetchBill = async () => {
    try {
      const response = await billAPI.getById(id);
      setBill(response.data);
      setPaymentAmount(response.data.remainingAmount);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching bill:', error);
      setLoading(false);
    }
  };

  const handleUpdatePayment = async (e) => {
    e.preventDefault();
    try {
      await billAPI.updatePayment(id, {
        amountPaid: Number(bill.amountPaid) + Number(paymentAmount),
        paymentType,
      });
      fetchBill();
      alert('Payment updated successfully!');
    } catch (error) {
      console.error('Error updating payment:', error);
      alert('Failed to update payment');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (!bill) return <div className="error">Bill not found</div>;

  return (
    <div>
      <div className="page-header no-print">
        <h2>Bill Details</h2>
        <div>
          <button onClick={handlePrint} className="btn btn-primary" style={{marginRight: '10px'}}>
             Print
          </button>
          <Link to="/bills" className="btn btn-secondary">
            Back to List
          </Link>
        </div>
      </div>

      <div className="card">
        <div style={{textAlign: 'center', marginBottom: '30px'}}>
          <h2>INVOICE</h2>
          <p style={{fontSize: '1.2rem', color: '#667eea'}}>{bill.billNumber}</p>
          <p>{new Date(bill.createdAt).toLocaleDateString()}</p>
        </div>

        <div style={{marginBottom: '30px'}}>
          <h3>Customer Information</h3>
          <p><strong>Name:</strong> {bill.customer?.name}</p>
          <p><strong>Phone:</strong> {bill.customer?.phone}</p>
          {bill.customer?.email && <p><strong>Email:</strong> {bill.customer.email}</p>}
          {bill.customer?.address && <p><strong>Address:</strong> {bill.customer.address}</p>}
        </div>

        <h3>Items</h3>
        <table style={{marginBottom: '30px'}}>
          <thead>
            <tr>
              <th>Product</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {bill.items.map((item, index) => (
              <tr key={index}>
                <td>{item.product?.name || 'N/A'}</td>
                <td>₹{item.price.toLocaleString()}</td>
                <td>{item.quantity}</td>
                <td>₹{item.total.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{maxWidth: '400px', marginLeft: 'auto'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #ddd'}}>
            <span>Subtotal:</span>
            <span>₹{bill.subtotal.toLocaleString()}</span>
          </div>
          <div style={{display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #ddd'}}>
            <span>Tax:</span>
            <span>₹{bill.tax.toLocaleString()}</span>
          </div>
          <div style={{display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #ddd'}}>
            <span>Discount:</span>
            <span>-₹{bill.discount.toLocaleString()}</span>
          </div>
          <div style={{display: 'flex', justifyContent: 'space-between', padding: '10px 0', fontSize: '1.2rem', fontWeight: 'bold'}}>
            <span>Total Amount:</span>
            <span>₹{bill.totalAmount.toLocaleString()}</span>
          </div>
          <div style={{display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderTop: '2px solid #ddd'}}>
            <span>Amount Paid:</span>
            <span style={{color: '#48bb78'}}>₹{bill.amountPaid.toLocaleString()}</span>
          </div>
          <div style={{display: 'flex', justifyContent: 'space-between', padding: '10px 0'}}>
            <span>Remaining:</span>
            <span style={{color: bill.remainingAmount > 0 ? '#f56565' : '#48bb78', fontWeight: 'bold'}}>
              ₹{bill.remainingAmount.toLocaleString()}
            </span>
          </div>
        </div>

        <div style={{marginTop: '30px', padding: '15px', background: 'rgba(255,255,255,0.9)', borderRadius: '8px', color: '#333'}}>
          <p style={{color: '#333', marginBottom: '8px'}}>
            <strong>Payment Type:</strong> {bill.paymentType.replace('_', ' ').toUpperCase()}
          </p>
          <p style={{color: '#333', marginBottom: '8px'}}>
            <strong>Payment Status:</strong>{' '}
            <span className={`badge badge-${
              bill.paymentStatus === 'paid' ? 'success' :
              bill.paymentStatus === 'partial' ? 'warning' : 'danger'
            }`}>
              {bill.paymentStatus.toUpperCase()}
            </span>
          </p>
          {bill.notes && (
            <p style={{color: '#333', marginBottom: '8px'}}>
              <strong>Notes:</strong> {bill.notes}
            </p>
          )}
        </div>
      </div>

      {bill.remainingAmount > 0 && (
        <div className="card no-print">
          <h3>Update Payment</h3>
          <form onSubmit={handleUpdatePayment}>
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px'}}>
              <div className="form-group">
                <label>Additional Payment Amount (₹)</label>
                <input
                  type="number"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  min="0"
                  max={bill.remainingAmount}
                  step="0.01"
                  required
                />
              </div>
              <div className="form-group">
                <label>Payment Type</label>
                <select value={paymentType} onChange={(e) => setPaymentType(e.target.value)}>
                  <option value="cash">Cash</option>
                  <option value="card">Card</option>
                  <option value="upi">UPI</option>
                  <option value="bank_transfer">Bank Transfer</option>
                </select>
              </div>
            </div>
            <button type="submit" className="btn btn-success">
              Record Payment
            </button>
          </form>
        </div>
      )}

      <style>{`
        @media print {
          .no-print {
            display: none !important;
          }
          .navbar {
            display: none !important;
          }
          body {
            background: white !important;
          }
        }
      `}</style>
    </div>
  );
};

export default BillDetail;