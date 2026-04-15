import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { customerAPI, productAPI, billAPI } from '../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalProducts: 0,
    totalBills: 0,
    lowStockProducts: 0,
    totalSales: 0,
    pendingPayments: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [customers, products, bills, lowStock] = await Promise.all([
        customerAPI.getAll(),
        productAPI.getAll(),
        billAPI.getAll(),
        productAPI.getLowStock(10),
      ]);

      const totalSales = bills.data.reduce((sum, bill) => sum + bill.totalAmount, 0);
      const pendingPayments = bills.data.reduce((sum, bill) => sum + bill.remainingAmount, 0);

      setStats({
        totalCustomers: customers.data.length,
        totalProducts: products.data.length,
        totalBills: bills.data.length,
        lowStockProducts: lowStock.data.length,
        totalSales,
        pendingPayments,
      });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching stats:', error);
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading dashboard...</div>;

  return (
    <div>
      <div className="page-header">
        <h2>Dashboard</h2>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>{stats.totalCustomers}</h3>
          <p>Total Customers</p>
          <Link to="/customers" className="btn btn-primary btn-small" style={{marginTop: '10px'}}>
            View All
          </Link>
        </div>

        <div className="stat-card">
          <h3>{stats.totalProducts}</h3>
          <p>Total Products</p>
          <Link to="/products" className="btn btn-primary btn-small" style={{marginTop: '10px'}}>
            View All
          </Link>
        </div>

        <div className="stat-card">
          <h3>{stats.totalBills}</h3>
          <p>Total Bills</p>
          <Link to="/bills" className="btn btn-primary btn-small" style={{marginTop: '10px'}}>
            View All
          </Link>
        </div>

        <div className="stat-card">
          <h3>₹{stats.totalSales.toLocaleString()}</h3>
          <p>Total Sales</p>
        </div>

        <div className="stat-card">
          <h3>₹{stats.pendingPayments.toLocaleString()}</h3>
          <p>Pending Payments</p>
        </div>

        <div className="stat-card">
          <h3 style={{color: stats.lowStockProducts > 0 ? '#f56565' : '#48bb78'}}>
            {stats.lowStockProducts}
          </h3>
          <p>Low Stock Products</p>
          {stats.lowStockProducts > 0 && (
            <Link to="/products" className="btn btn-danger btn-small" style={{marginTop: '10px'}}>
              Check Now
            </Link>
          )}
        </div>
      </div>

      <div className="card">
        <h3 style={{marginBottom: '20px'}}>Quick Actions</h3>
        <div style={{display: 'flex', gap: '10px', flexWrap: 'wrap'}}>
          <Link to="/customers/new" className="btn btn-primary">
            + Add Customer
          </Link>
          <Link to="/products/new" className="btn btn-success">
            + Add Product
          </Link>
          <Link to="/bills/new" className="btn btn-secondary">
            + Create Bill
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;