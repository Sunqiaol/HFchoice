import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Header from '../components/layout/Header';
import useAuth from '../hooks/useAuth';
import { USER_ROLES } from '../constants';
import { useTranslation } from '../hooks/useTranslation';

const Orders = () => {
  const { user, role, loading } = useAuth();
  const router = useRouter();
  const { t } = useTranslation();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  
  // Filter states
  const [filters, setFilters] = useState({
    status: '',
    customer: '',
    dateFrom: '',
    dateTo: ''
  });
  
  // Sorting state
  const [sortConfig, setSortConfig] = useState({
    key: 'createdAt',
    direction: 'desc'
  });

  const isAdmin = role === USER_ROLES.ADMIN;

  const fetchOrders = useCallback(async () => {
    if (!user) return;
    
    try {
      const token = await user.getIdToken();
      const response = await axios.get('/api/orders', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setOrders(response.data);
      setFilteredOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
      return;
    }

    if (user) {
      fetchOrders();
    }
  }, [user, loading, router, fetchOrders]);

  // Filter orders whenever filters or orders change
  useEffect(() => {
    let filtered = [...orders];

    // Filter by status
    if (filters.status) {
      filtered = filtered.filter(order => order.status === filters.status);
    }

    // Filter by customer (search in both name and email)
    if (filters.customer) {
      const searchTerm = filters.customer.toLowerCase();
      filtered = filtered.filter(order => 
        (order.customerName && order.customerName.toLowerCase().includes(searchTerm)) ||
        (order.email && order.email.toLowerCase().includes(searchTerm))
      );
    }

    // Filter by date range
    if (filters.dateFrom) {
      const fromDate = new Date(filters.dateFrom);
      fromDate.setHours(0, 0, 0, 0);
      filtered = filtered.filter(order => 
        new Date(order.createdAt) >= fromDate
      );
    }

    if (filters.dateTo) {
      const toDate = new Date(filters.dateTo);
      toDate.setHours(23, 59, 59, 999);
      filtered = filtered.filter(order => 
        new Date(order.createdAt) <= toDate
      );
    }

    // Sort the filtered results
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        // Handle date sorting
        if (sortConfig.key === 'createdAt') {
          aValue = new Date(aValue);
          bValue = new Date(bValue);
        }

        // Handle string sorting (case insensitive)
        if (typeof aValue === 'string') {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        }

        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    setFilteredOrders(filtered);
  }, [orders, filters, sortConfig]);

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const token = await user.getIdToken();
      await axios.put('/api/orders/update-status', 
        { orderId, status: newStatus },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      // Refresh orders
      fetchOrders();
      
      // Update selected order if it's open
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder(prev => ({ ...prev, status: newStatus }));
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      console.error('Error details:', error.response?.data);
      const errorMessage = error.response?.data?.error || 'Error updating order status';
      alert(`Error: ${errorMessage}`);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'Quote': 'bg-yellow-100 text-yellow-800',
      'Placed': 'bg-blue-100 text-blue-800',
      'shipped': 'bg-purple-100 text-purple-800',
      'delivering': 'bg-orange-100 text-orange-800',
      'Completed': 'bg-green-100 text-green-800',
      'Cancelled': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const openOrderDetail = (order) => {
    setSelectedOrder(order);
    setIsDetailModalOpen(true);
  };

  const closeOrderDetail = () => {
    setSelectedOrder(null);
    setIsDetailModalOpen(false);
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      status: '',
      customer: '',
      dateFrom: '',
      dateTo: ''
    });
  };

  const getActiveFilterCount = () => {
    return Object.values(filters).filter(value => value !== '').length;
  };

  const handleSort = (key) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  if (loading || isLoading) {
    return (
      <div className='min-h-screen bg-gray-50'>
        <Header />
        <div className='flex justify-center items-center h-64'>
          <div className='text-center'>
            <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto'></div>
            <p className='mt-4 text-gray-600'>{t('orders.loadingOrders')}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      <Header />
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {/* Header */}
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-gray-900'>
            {isAdmin ? t('orders.allOrders') : t('orders.myOrders')}
          </h1>
          <p className='text-gray-600 mt-2'>
            {isAdmin 
              ? t('orders.manageAllOrders')
              : t('orders.viewOrderHistory')
            }
          </p>
        </div>

        {/* Filter Section */}
        <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6'>
          <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4'>
            <h3 className='text-lg font-semibold text-gray-900'>
              {t('orders.filters')}
              {getActiveFilterCount() > 0 && (
                <span className='ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full'>
                  {getActiveFilterCount()} {t('orders.active')}
                </span>
              )}
            </h3>
            {getActiveFilterCount() > 0 && (
              <button
                onClick={clearFilters}
                className='text-sm text-gray-600 hover:text-gray-800 underline'
              >
                {t('orders.clearAllFilters')}
              </button>
            )}
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
            {/* Status Filter */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                {t('orders.status')}
              </label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              >
                <option value=''>{t('orders.allStatus')}</option>
                <option value='Quote'>{t('orders.statuses.Quote')}</option>
                <option value='Placed'>{t('orders.statuses.Placed')}</option>
                <option value='shipped'>{t('orders.statuses.shipped')}</option>
                <option value='delivering'>{t('orders.statuses.delivering')}</option>
                <option value='Completed'>{t('orders.statuses.Completed')}</option>
                <option value='Cancelled'>{t('orders.statuses.Cancelled')}</option>
              </select>
            </div>

            {/* Customer Filter */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                {t('orders.customer')}
              </label>
              <input
                type='text'
                value={filters.customer}
                onChange={(e) => handleFilterChange('customer', e.target.value)}
                placeholder={t('orders.searchCustomer')}
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              />
            </div>

            {/* Date From Filter */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                {t('orders.fromDate')}
              </label>
              <input
                type='date'
                value={filters.dateFrom}
                onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              />
            </div>

            {/* Date To Filter */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                {t('orders.toDate')}
              </label>
              <input
                type='date'
                value={filters.dateTo}
                onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              />
            </div>
          </div>

          {/* Quick Filters */}
          <div className='mt-4 pt-4 border-t border-gray-200'>
            <div className='flex flex-wrap items-center gap-2 mb-3'>
              <span className='text-sm font-medium text-gray-700'>{t('orders.quickFilters')}</span>
              <button
                onClick={() => handleFilterChange('status', 'Quote')}
                className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                  filters.status === 'Quote' 
                    ? 'bg-yellow-100 border-yellow-300 text-yellow-800' 
                    : 'bg-gray-100 border-gray-300 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {t('orders.newQuotes')}
              </button>
              <button
                onClick={() => handleFilterChange('status', 'Placed')}
                className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                  filters.status === 'Placed' 
                    ? 'bg-blue-100 border-blue-300 text-blue-800' 
                    : 'bg-gray-100 border-gray-300 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {t('orders.activeOrders')}
              </button>
              <button
                onClick={() => handleFilterChange('status', 'Completed')}
                className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                  filters.status === 'Completed' 
                    ? 'bg-green-100 border-green-300 text-green-800' 
                    : 'bg-gray-100 border-gray-300 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {t('orders.completed')}
              </button>
              <button
                onClick={() => {
                  const today = new Date().toISOString().split('T')[0];
                  handleFilterChange('dateFrom', today);
                }}
                className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                  filters.dateFrom === new Date().toISOString().split('T')[0] 
                    ? 'bg-purple-100 border-purple-300 text-purple-800' 
                    : 'bg-gray-100 border-gray-300 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {t('orders.today')}
              </button>
            </div>
            
            <p className='text-sm text-gray-600'>
              {t('orders.showingResults').replace('{filtered}', filteredOrders.length).replace('{total}', orders.length)}
              {getActiveFilterCount() > 0 && ` ${t('orders.filtered')}`}
            </p>
          </div>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className='text-center py-12'>
            <div className='text-gray-400 mb-4'>
              <svg className='w-16 h-16 mx-auto' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} 
                      d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' />
              </svg>
            </div>
            <h3 className='text-lg font-medium text-gray-900 mb-2'>
              {getActiveFilterCount() > 0 ? t('orders.noOrdersMatch') : t('orders.noOrders')}
            </h3>
            <p className='text-gray-600'>
              {getActiveFilterCount() > 0 
                ? t('orders.tryAdjusting')
                : (isAdmin 
                  ? t('orders.noOrdersYet')
                  : t('orders.noOrdersYetUser'))
              }
            </p>
          </div>
        ) : (
          <div className='bg-white shadow-sm rounded-lg overflow-hidden'>
            <div className='overflow-x-auto'>
              <table className='min-w-full divide-y divide-gray-200'>
                <thead className='bg-gray-50'>
                  <tr>
                    <th 
                      className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-50'
                      onClick={() => handleSort('id')}
                    >
                      <div className='flex items-center space-x-1'>
                        <span>{t('orders.orderID')}</span>
                        {sortConfig.key === 'id' && (
                          <span className='text-blue-500'>
                            {sortConfig.direction === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </div>
                    </th>
                    {isAdmin && (
                      <th 
                        className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-50'
                        onClick={() => handleSort('customerName')}
                      >
                        <div className='flex items-center space-x-1'>
                          <span>{t('orders.customer')}</span>
                          {sortConfig.key === 'customerName' && (
                            <span className='text-blue-500'>
                              {sortConfig.direction === 'asc' ? '↑' : '↓'}
                            </span>
                          )}
                        </div>
                      </th>
                    )}
                    <th 
                      className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-50'
                      onClick={() => handleSort('createdAt')}
                    >
                      <div className='flex items-center space-x-1'>
                        <span>{t('orders.date')}</span>
                        {sortConfig.key === 'createdAt' && (
                          <span className='text-blue-500'>
                            {sortConfig.direction === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </div>
                    </th>
                    <th 
                      className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-50'
                      onClick={() => handleSort('totalItems')}
                    >
                      <div className='flex items-center space-x-1'>
                        <span>{t('orders.items')}</span>
                        {sortConfig.key === 'totalItems' && (
                          <span className='text-blue-500'>
                            {sortConfig.direction === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </div>
                    </th>
                    <th 
                      className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-50'
                      onClick={() => handleSort('status')}
                    >
                      <div className='flex items-center space-x-1'>
                        <span>{t('orders.status')}</span>
                        {sortConfig.key === 'status' && (
                          <span className='text-blue-500'>
                            {sortConfig.direction === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </div>
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      {t('orders.actions')}
                    </th>
                  </tr>
                </thead>
                <tbody className='bg-white divide-y divide-gray-200'>
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className='hover:bg-gray-50'>
                      <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                        #{order.id}
                      </td>
                      {isAdmin && (
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                          <div>
                            <div className='font-medium'>{order.customerName || 'N/A'}</div>
                            <div className='text-gray-500'>{order.email}</div>
                          </div>
                        </td>
                      )}
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                        {formatDate(order.createdAt)}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                        {t('orders.itemsCount').replace('{count}', order.totalItems)}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2'>
                        <button
                          onClick={() => openOrderDetail(order)}
                          className='text-blue-600 hover:text-blue-900'
                        >
                          {t('orders.view')}
                        </button>
                        {isAdmin && (
                          <select
                            value={order.status}
                            onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                            className='ml-2 text-xs border border-gray-300 rounded px-2 py-1'
                          >
                            <option value='Quote'>{t('orders.statuses.Quote')}</option>
                            <option value='Placed'>{t('orders.statuses.Placed')}</option>
                            <option value='shipped'>{t('orders.statuses.shipped')}</option>
                            <option value='delivering'>{t('orders.statuses.delivering')}</option>
                            <option value='Completed'>{t('orders.statuses.Completed')}</option>
                            <option value='Cancelled'>{t('orders.statuses.Cancelled')}</option>
                          </select>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {isDetailModalOpen && selectedOrder && (
        <div className='modal-overlay' onClick={closeOrderDetail}>
          <div className='modal-content max-w-2xl' onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className='flex items-center justify-between p-6 border-b border-gray-200'>
              <div>
                <h2 className='text-2xl font-bold text-gray-900'>{t('orders.orderDetail').replace('{id}', selectedOrder.id)}</h2>
                <p className='text-gray-600 mt-1'>
                  {formatDate(selectedOrder.createdAt)}
                </p>
              </div>
              <button
                onClick={closeOrderDetail}
                className='p-2 hover:bg-gray-100 rounded-full transition-colors duration-200'
              >
                <svg className='w-6 h-6 text-gray-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className='p-6 space-y-6'>
              {/* Customer Info */}
              <div>
                <h3 className='text-lg font-semibold text-gray-900 mb-3'>{t('orders.customerInformation')}</h3>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-sm'>
                  <div>
                    <span className='text-gray-500'>{t('orders.name')}</span>
                    <span className='ml-2 text-gray-900'>{selectedOrder.customerName || 'N/A'}</span>
                  </div>
                  <div>
                    <span className='text-gray-500'>{t('orders.email')}</span>
                    <span className='ml-2 text-gray-900'>{selectedOrder.email}</span>
                  </div>
                  <div>
                    <span className='text-gray-500'>{t('orders.phone')}</span>
                    <span className='ml-2 text-gray-900'>{selectedOrder.phone || 'N/A'}</span>
                  </div>
                  <div>
                    <span className='text-gray-500'>{t('orders.status')}:</span>
                    <span className={`ml-2 px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedOrder.status)}`}>
                      {selectedOrder.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {selectedOrder.notes && (
                <div>
                  <h3 className='text-lg font-semibold text-gray-900 mb-3'>{t('orders.customerNotes')}</h3>
                  <p className='text-gray-700 bg-gray-50 p-3 rounded-md'>
                    {selectedOrder.notes}
                  </p>
                </div>
              )}

              {/* Items */}
              <div>
                <h3 className='text-lg font-semibold text-gray-900 mb-3'>
                  {t('orders.itemsTotal').replace('{count}', selectedOrder.totalItems)}
                </h3>
                <div className='space-y-3 max-h-64 overflow-y-auto'>
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className='flex justify-between items-center p-3 bg-gray-50 rounded-md'>
                      <div className='flex-1'>
                        <div className='font-medium text-gray-900'>{item.DISCRIPCION}</div>
                        <div className='text-sm text-gray-500'>
                          {t('orders.code')} {item.CODIGO} | {t('orders.brand')} {item.MARCA || 'N/A'}
                        </div>
                      </div>
                      <div className='text-right'>
                        <div className='font-medium'>{t('orders.quantity').replace('{count}', item.quantity)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;