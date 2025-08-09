import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { 
  FaPlus, 
  FaSearch, 
  FaFilter, 
  FaEye, 
  FaEdit, 
  FaTrash, 
  FaDownload,
  FaExchangeAlt,
  FaCheckCircle,
  FaClock,
  FaExclamationTriangle,
  FaArrowUp,
  FaArrowDown
} from 'react-icons/fa';

const Transfers = () => {
  const [transfers, setTransfers] = useState([]);
  const [filteredTransfers, setFilteredTransfers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Mock data for demonstration
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockTransfers = [
        {
          id: 1,
          reference: 'TRF-2024-001',
          type: 'Transfer In',
          source: 'HDFC Mid-Cap Opportunities',
          target: 'Axis Bluechip Fund',
          units: 1000.50,
          amount: 50000,
          nav_at_transfer: 50.00,
          status: 'completed',
          transfer_date: '2024-01-15',
          requested_at: '2024-01-10T10:30:00Z',
          processed_at: '2024-01-12T14:20:00Z',
          completed_at: '2024-01-15T09:15:00Z',
          notes: 'Regular portfolio rebalancing'
        },
        {
          id: 2,
          reference: 'TRF-2024-002',
          type: 'Transfer Out',
          source: 'ICICI Prudential Technology',
          target: 'SBI Bluechip Fund',
          units: 1500.75,
          amount: 75000,
          nav_at_transfer: 50.00,
          status: 'processing',
          transfer_date: '2024-01-20',
          requested_at: '2024-01-14T11:45:00Z',
          processed_at: '2024-01-16T16:30:00Z',
          completed_at: null,
          notes: 'Sector rotation strategy'
        },
        {
          id: 3,
          reference: 'TRF-2024-003',
          type: 'Transfer In',
          source: 'Kotak Emerging Equity',
          target: 'Mirae Asset Large Cap',
          units: 2000.00,
          amount: 100000,
          nav_at_transfer: 50.00,
          status: 'pending',
          transfer_date: '2024-01-25',
          requested_at: '2024-01-13T09:20:00Z',
          processed_at: null,
          completed_at: null,
          notes: 'Fund performance optimization'
        },
        {
          id: 4,
          reference: 'TRF-2024-004',
          type: 'Transfer Out',
          source: 'SBI Small Cap Fund',
          target: 'HDFC Balanced Advantage',
          units: 800.25,
          amount: 40000,
          nav_at_transfer: 50.00,
          status: 'failed',
          transfer_date: '2024-01-18',
          requested_at: '2024-01-12T15:10:00Z',
          processed_at: null,
          completed_at: null,
          notes: 'Insufficient units in source scheme'
        }
      ];
      
      setTransfers(mockTransfers);
      setFilteredTransfers(mockTransfers);
      setIsLoading(false);
    }, 1000);
  }, []);

  // Filter transfers based on search and filters
  useEffect(() => {
    let filtered = transfers;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(transfer =>
        transfer.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transfer.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transfer.target.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(transfer => transfer.status === statusFilter);
    }

    // Type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(transfer => transfer.type === typeFilter);
    }

    setFilteredTransfers(filtered);
    setCurrentPage(1);
  }, [transfers, searchTerm, statusFilter, typeFilter]);

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
      case 'cancelled':
        return 'text-gray-600 bg-gray-100';
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
      case 'cancelled':
        return <FaExclamationTriangle className="w-4 h-4" />;
      default:
        return <FaClock className="w-4 h-4" />;
    }
  };

  const handleDeleteTransfer = (transferId) => {
    if (window.confirm('Are you sure you want to delete this transfer?')) {
      setTransfers(transfers.filter(t => t.id !== transferId));
      toast.success('Transfer deleted successfully');
    }
  };

  const handleExportData = () => {
    // Mock export functionality
    toast.success('Data exported successfully');
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTransfers = filteredTransfers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredTransfers.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading transfers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Transfers</h1>
            <p className="text-gray-600">Manage your mutual fund transfers</p>
          </div>
          <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleExportData}
              className="btn-secondary px-4 py-2 text-sm flex items-center justify-center"
            >
              <FaDownload className="w-4 h-4 mr-2" />
              Export
            </button>
            <Link
              to="/transfers/new"
              className="btn-primary px-4 py-2 text-sm flex items-center justify-center"
            >
              <FaPlus className="w-4 h-4 mr-2" />
              New Transfer
            </Link>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="card p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search transfers by reference, source, or target..."
                  className="input-field pl-10 w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="btn-secondary px-4 py-2 text-sm flex items-center"
            >
              <FaFilter className="w-4 h-4 mr-2" />
              Filters
            </button>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="input-field"
                  >
                    <option value="all">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="completed">Completed</option>
                    <option value="failed">Failed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type
                  </label>
                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="input-field"
                  >
                    <option value="all">All Types</option>
                    <option value="Transfer In">Transfer In</option>
                    <option value="Transfer Out">Transfer Out</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setStatusFilter('all');
                      setTypeFilter('all');
                    }}
                    className="btn-secondary px-4 py-2 text-sm w-full"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results Summary */}
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            Showing {filteredTransfers.length} of {transfers.length} transfers
          </p>
        </div>

        {/* Transfers Table */}
        <div className="card overflow-hidden">
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
                    Units
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentTransfers.map((transfer) => (
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
                      {transfer.units.toLocaleString()}
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
                      {new Date(transfer.transfer_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Link
                          to={`/transfers/${transfer.id}`}
                          className="text-primary-600 hover:text-primary-900"
                          title="View Details"
                        >
                          <FaEye className="w-4 h-4" />
                        </Link>
                        {transfer.status === 'pending' && (
                          <>
                            <Link
                              to={`/transfers/${transfer.id}/edit`}
                              className="text-blue-600 hover:text-blue-900"
                              title="Edit Transfer"
                            >
                              <FaEdit className="w-4 h-4" />
                            </Link>
                            <button
                              onClick={() => handleDeleteTransfer(transfer.id)}
                              className="text-red-600 hover:text-red-900"
                              title="Delete Transfer"
                            >
                              <FaTrash className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {currentTransfers.length === 0 && (
            <div className="text-center py-12">
              <FaExchangeAlt className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No transfers found</h3>
              <p className="text-gray-600 mb-4">
                {filteredTransfers.length === 0 && transfers.length > 0
                  ? 'Try adjusting your search or filters'
                  : 'Get started by creating your first transfer'
                }
              </p>
              {filteredTransfers.length === 0 && transfers.length > 0 ? (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('all');
                    setTypeFilter('all');
                  }}
                  className="btn-primary px-4 py-2"
                >
                  Clear Filters
                </button>
              ) : (
                <Link to="/transfers/new" className="btn-primary px-4 py-2">
                  Create Transfer
                </Link>
              )}
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-gray-700">
              Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredTransfers.length)} of{' '}
              {filteredTransfers.length} results
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="btn-secondary px-3 py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => paginate(page)}
                  className={`px-3 py-2 text-sm rounded-md ${
                    currentPage === page
                      ? 'bg-primary-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="btn-secondary px-3 py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Transfers;
