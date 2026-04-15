import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { billAPI } from '../../services/api';

const BillList = () => {
  const [bills, setBills] = useState([]);
  const [filteredBills, setFilteredBills] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBills();
  }, []);

  useEffect(() => {
    let filtered = bills;

    if (searchTerm) {
      filtered = filtered.filter(bill =>
        bill.billNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bill.customer?.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(bill => bill.paymentStatus === filterStatus);
    }

    setFilteredBills(filtered);
  }, [searchTerm, filterStatus, bills]);

  const fetchBills = async () => {
    try {
      const response = await billAPI.getAll();
      setBills(response.data);
      setFilteredBills(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching bills:', error);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this bill?')) {
      try {
        await billAPI.delete(id);
        fetchBills();
      } catch (error) {
        console.error('Error deleting bill:', error);
        alert('Failed to delete bill');
      }
    }
  };

  if (loading) return <div className="loading">Loading bills...</div>;

  return (
    <div>
      <div className="page-header">
        <h2>Bills</h2>
        <Link to="/bills/new" className="btn btn-primary">
          + Create Bill
        </Link>
      </div>

      <div style={{display: 'flex', gap: '20px', marginBottom: '20px'}}>
        <div className="search-bar" style={{flex: 1}}>
          <input
            type="text"
            placeholder="Search by bill number or customer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select 
          value={filterStatus} 
          onChange={(e) => setFilterStatus(e.target.value)}
          style={{padding: '10px', borderRadius: '5px', border: '1px solid #ddd'}}
        >
          <option value="all">All Status</option>
          <option value="paid">Paid</option>
          <option value="partial">Partial</option>
          <option value="unpaid">Unpaid</option>
        </select>
      </div>

      {filteredBills.length === 0 ? (
        <div className="card">
          <p>No bills found. Create your first bill!</p>
        </div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Bill Number</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Total Amount</th>
              <th>Paid</th>
              <th>Remaining</th>
              <th>Payment Type</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBills.map(bill => (
              <tr key={bill._id}>
                <td>{bill.billNumber}</td>
                <td>{bill.customer?.name || 'N/A'}</td>
                <td>{new Date(bill.createdAt).toLocaleDateString()}</td>
                <td>₹{bill.totalAmount.toLocaleString()}</td>
                <td>₹{bill.amountPaid.toLocaleString()}</td>
                <td>₹{bill.remainingAmount.toLocaleString()}</td>
                <td>{bill.paymentType.replace('_', ' ').toUpperCase()}</td>
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
                  <button 
                    onClick={() => handleDelete(bill._id)} 
                    className="btn btn-danger btn-small"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default BillList;