import React, { useState } from 'react';
import axios from 'axios';
import useAuth from '../../hooks/useAuth';

const QuoteRequestModal = ({ isOpen, onClose, cart, onClearCart }) => {
  const { user } = useAuth();
  const [customerInfo, setCustomerInfo] = useState({
    customerName: '',
    phone: '',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const token = await user.getIdToken();
      const response = await axios.post('/api/checkout', {
        cart,
        userEmail: user.email,
        ...customerInfo
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      setSubmitSuccess(true);
      onClearCart();
      
      setTimeout(() => {
        setSubmitSuccess(false);
        setCustomerInfo({ customerName: '', phone: '', notes: '' });
        onClose();
      }, 3000);

    } catch (error) {
      console.error('Error submitting quote request:', error);
      console.error('Error details:', error.response?.data);
      const errorMessage = error.response?.data?.error || 'Error submitting quote request. Please try again.';
      alert(`Error: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  if (submitSuccess) {
    return (
      <div className='modal-overlay' onClick={onClose}>
        <div className='modal-content max-w-md' onClick={(e) => e.stopPropagation()}>
          <div className='text-center p-8'>
            <div className='w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center'>
              <svg className='w-8 h-8 text-green-500' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
              </svg>
            </div>
            <h3 className='text-xl font-semibold text-gray-900 mb-2'>Quote Request Submitted!</h3>
            <p className='text-gray-600 mb-4'>
              Your quote request has been submitted successfully. You&apos;ll receive a confirmation email shortly.
            </p>
            <p className='text-sm text-gray-500'>
              Our team will review your request and respond within 24 hours.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='modal-overlay' onClick={onClose}>
      <div className='modal-content max-w-lg' onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className='flex items-center justify-between p-6 border-b border-gray-200'>
          <div>
            <h2 className='text-2xl font-bold text-gray-900'>Request Quote</h2>
            <p className='text-gray-600 mt-1'>{getTotalItems()} items for quote</p>
          </div>
          <button
            onClick={onClose}
            className='p-2 hover:bg-gray-100 rounded-full transition-colors duration-200'
            aria-label='Close modal'
          >
            <svg className='w-6 h-6 text-gray-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className='p-6'>
          <div className='space-y-4'>
            {/* Email (read-only) */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Email Address
              </label>
              <input
                type='email'
                value={user?.email || ''}
                disabled
                className='w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500'
              />
            </div>

            {/* Customer Name */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Full Name
              </label>
              <input
                type='text'
                name='customerName'
                value={customerInfo.customerName}
                onChange={handleInputChange}
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                placeholder='Enter your full name'
              />
            </div>

            {/* Phone */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Phone Number
              </label>
              <input
                type='tel'
                name='phone'
                value={customerInfo.phone}
                onChange={handleInputChange}
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                placeholder='Enter your phone number'
              />
            </div>

            {/* Notes */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Additional Notes
              </label>
              <textarea
                name='notes'
                value={customerInfo.notes}
                onChange={handleInputChange}
                rows={3}
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                placeholder='Any specific requirements or questions...'
              />
            </div>

            {/* Items Summary */}
            <div className='bg-gray-50 p-4 rounded-md'>
              <h4 className='font-medium text-gray-900 mb-2'>Items for Quote:</h4>
              <div className='max-h-32 overflow-y-auto'>
                {cart.map((item, index) => (
                  <div key={index} className='flex justify-between text-sm text-gray-600 py-1'>
                    <span>{item.DISCRIPCION}</span>
                    <span>Qty: {item.quantity}</span>
                  </div>
                ))}
              </div>
              <div className='border-t border-gray-200 mt-2 pt-2'>
                <div className='flex justify-between font-medium text-gray-900'>
                  <span>Total Items:</span>
                  <span>{getTotalItems()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className='flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200'>
            <button
              type='button'
              onClick={onClose}
              className='px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors duration-200'
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type='submit'
              disabled={isSubmitting}
              className='px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {isSubmitting ? 'Submitting...' : 'Submit Quote Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuoteRequestModal;