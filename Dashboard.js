import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  FaChartLine, 
  FaExchangeAlt, 
  FaCheckCircle, 
  FaClock, 
  FaExclamationTriangle,
  FaArrowUp,
  FaArrowDown,
  FaEye
} from 'react-icons/fa';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalTransfers: 0,
    pendingTransfers: 0,
    completedTransfers: 0,
    totalValue: 0,
    monthlyGrowth: 0
  });
  const [recentTransfers, setRecentTransfers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Mock data for demonstration
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setStats({
        totalTransfers: 156,
        pendingTransfers: 8,
        completedTransfers: 148,
        totalValue: 2500000,
        monthlyGrowth: 12.5
      });
      
      setRecentTransfers([
        {
          id: 1,
          reference: 'TRF-2024-001',
          type: 'Transfer In',
          source: 'HDFC Mid-Cap Opportunities',
          target: 'Axis Bluechip Fund',
          amount: 50000,
          status: 'completed',
          date: '2024-01-15'
        },
        {
          id: 2,
          reference: 'TRF-2024-002',
          type: 'Transfer Out',
          source: 'ICICI Prudential Technology',
          target: 'SBI Bluechip Fund',
          amount: 75000,
          status: 'processing',
          date: '2024-01-14'
        },
        {
          id: 3,
          reference: 'TRF-2024-003',
          type: 'Transfer In',
          source: 'Kotak Emerging Equity',
          target: 'Mirae Asset Large Cap',
          amount: 100000,
          status: 'pending',
          date: '2024-01-13'
        }
      ]);
      
      setIsLoading(false);
    }, 1000);
  }, []);

  const chartData = [
    { month: 'Jan', transfers: 12, value: 1200000 },
    { month: 'Feb', transfers: 15, value: 1500000 },
    { month: 'Mar', transfers: 18, value: 1800000 },
    { month: 'Apr', transfers: 22, value: 2200000 },
    { month: 'May', transfers: 25, value: 2500000 },
    { month: 'Jun', transfers: 28, value: 2800000 }
  ];

  const pieData = [
    { name: 'Equity', value: 60, color: '#3B82F6' },
    { name: 'Debt', value: 25, color: '#10B981' },
    { name: 'Hybrid', value: 15, color: '#F59E0B' }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'processing':
        return 'text-blue-600 bg-blue-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'failed':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <FaCheckCircle className="w-4 h-4" />;
      case 'processing':
        return <FaClock className="w-4 h-4" />;
      case 'pending':
        return <FaClock className="w-4 h-4" />;
      case 'failed':
        return <FaExclamationTriangle className="w-4 h-4" />;
      default:
        return <FaClock className="w-4 h-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.first_name || 'User'}! 👋
          </h1>
          <p className="text-gray-600">
            Here's what's happening with your mutual fund transfers today.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card p-6">
            <div className="flex items-center">
              <div className="p-2 bg-primary-100 rounded-lg">
                <FaChartLine className="w-6 h-6 text-primary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Transfers</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalTransfers}</p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <FaClock className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pendingTransfers}</p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <FaCheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">{stats.completedTransfers}</p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FaExchangeAlt className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Value</p>
                <p className="text-2xl font-bold text-gray-900">
                  ₹{(stats.totalValue / 100000).toFixed(1)}L
                </p>
                <div className="flex items-center text-sm text-green-600">
                  <FaArrowUp className="w-3 h-3 mr-1" />
                  {stats.monthlyGrowth}%
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Transfer Trends Chart */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Transfer Trends</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => [
                    name === 'transfers' ? value : `₹${(value / 100000).toFixed(1)}L`,
                    name === 'transfers' ? 'Transfers' : 'Value'
                  ]}
                />
                <Line 
                  type="monotone" 
                  dataKey="transfers" 
                  stroke="#3B82F6" 
                  strokeWidth={2}
                  name="transfers"
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#10B981" 
                  strokeWidth={2}
                  name="value"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Portfolio Distribution Chart */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Portfolio Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Transfers */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Recent Transfers</h3>
            <Link 
              to="/transfers" 
              className="btn-primary px-4 py-2 text-sm flex items-center"
            >
              <FaEye className="w-4 h-4 mr-2" />
              View All
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reference
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Source
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Target
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentTransfers.map((transfer) => (
                  <tr key={transfer.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {transfer.reference}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        transfer.type === 'Transfer In' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {transfer.type === 'Transfer In' ? (
                          <FaArrowDown className="w-3 h-3 mr-1" />
                        ) : (
                          <FaArrowUp className="w-3 h-3 mr-1" />
                        )}
                        {transfer.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {transfer.source}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {transfer.target}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ₹{(transfer.amount / 1000).toFixed(1)}K
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(transfer.status)}`}>
                        {getStatusIcon(transfer.status)}
                        <span className="ml-1 capitalize">{transfer.status}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(transfer.date).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link 
            to="/transfers/new" 
            className="card p-6 hover:shadow-lg transition-shadow cursor-pointer group"
          >
            <div className="text-center">
              <div className="p-3 bg-primary-100 rounded-full w-16 h-16 mx-auto mb-4 group-hover:bg-primary-200 transition-colors">
                <FaExchangeAlt className="w-8 h-8 text-primary-600 mx-auto" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">New Transfer</h3>
              <p className="text-gray-600">Initiate a new mutual fund transfer</p>
            </div>
          </Link>

          <Link 
            to="/profile" 
            className="card p-6 hover:shadow-lg transition-shadow cursor-pointer group"
          >
            <div className="text-center">
              <div className="p-3 bg-green-100 rounded-full w-16 h-16 mx-auto mb-4 group-hover:bg-green-200 transition-colors">
                <FaChartLine className="w-8 h-8 text-green-600 mx-auto" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">View Profile</h3>
              <p className="text-gray-600">Update your account information</p>
            </div>
          </Link>

          <Link 
            to="/transfers" 
            className="card p-6 hover:shadow-lg transition-shadow cursor-pointer group"
          >
            <div className="text-center">
              <div className="p-3 bg-blue-100 rounded-full w-16 h-16 mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                <FaEye className="w-8 h-8 text-blue-600 mx-auto" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">All Transfers</h3>
              <p className="text-gray-600">View and manage all transfers</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
