import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { customerAPI, billAPI } from '../../services/api';

const CustomerDetail = () => {
  const { id } = useParams();
  const [customer, setCustomer] = useState(null);
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCustomerData();
  }, [id]);

  const fetchCustomerData = async () => {
    try {
      const [customerRes, billsRes] = await Promise.all([
        customerAPI.getById(id),
        billAPI.getByCustomer(id),
      ]);
      setCustomer(customerRes.data);
      setBills(billsRes.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching customer data:', error);
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (!customer) return <div className="error">Customer not found</div>;

  return (
    <div>
      <div className="page-header">
        <h2>Customer Details</h2>
        <Link to="/customers" className="btn btn-secondary">
          Back to List
        </Link>
      </div>

      <div className="card">
        <h3>Personal Information</h3>
        <p><strong>Name:</strong> {customer.name}</p>
        <p><strong>Phone:</strong> {customer.phone}</p>
        <p><strong>Email:</strong> {customer.email || '-'}</p>
        <p><strong>Address:</strong> {customer.address || '-'}</p>
      </div>

      <div className="card">
        <h3>Payment Summary</h3>
        <div className="stats-grid">
          <div className="stat-card">
            <h3>₹{customer.totalPurchases.toLocaleString()}</h3>
            <p>Total Purchases</p>
          </div>
          <div className="stat-card">
            <h3>₹{customer.totalPaid.toLocaleString()}</h3>
            <p>Total Paid</p>
          </div>
          <div className="stat-card">
            <h3 style={{color: customer.remainingPayment > 0 ? '#f56565' : '#48bb78'}}>
              ₹{customer.remainingPayment.toLocaleString()}
            </h3>
            <p>Remaining Payment</p>
          </div>
        </div>
      </div>

      <div className="card">
        <h3>Purchase History</h3>
        {bills.length === 0 ? (
          <p>No bills found for this customer.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Bill Number</th>
                <th>Date</th>
                <th>Total Amount</th>
                <th>Paid</th>
                <th>Remaining</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bills.map(bill => (
                <tr key={bill._id}>
                  <td>{bill.billNumber}</td>
                  <td>{new Date(bill.createdAt).toLocaleDateString()}</td>
                  <td>₹{bill.totalAmount.toLocaleString()}</td>
                  <td>₹{bill.amountPaid.toLocaleString()}</td>
                  <td>₹{bill.remainingAmount.toLocaleString()}</td>
                  <td>
                    <span className={`badge badge-${
                      bill.paymentStatus === 'paid' ? 'success' : 
                      bill.paymentStatus === 'partial' ? 'warning' : 'danger'
                    }`}>
                      {bill.paymentStatus.toUpperCase()}
                    </span>
                  </td>
                  <td>
                    <Link to={`/bills/${bill._id}`} className="btn btn-primary btn-small">
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default CustomerDetail;