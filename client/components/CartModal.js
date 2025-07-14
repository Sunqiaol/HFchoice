import React from 'react';
import SmartImage from './SmartImage';
import { USER_ROLES } from '../constants';
import useAuth from '../hooks/useAuth';

const CartModal = ({ isOpen, onClose, cart, onUpdateQuantity, onRemoveItem, handleCheckout }) => {
  const { role } = useAuth();
  if (!isOpen) return null;

  const isAdmin = role === USER_ROLES.ADMIN;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(price);
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (parseFloat(item.COSTO) * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content max-w-2xl" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{isAdmin ? 'Shopping Cart' : 'Quote Request'}</h2>
            <p className="text-gray-600 mt-1">
              {cart.length === 0 ? 'Your cart is empty' : `${getTotalItems()} items ${isAdmin ? 'in your cart' : 'for quote'}`}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
            aria-label="Close cart"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {cart.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.6 3.2a1 1 0 001 1.4h9.2M16 19a2 2 0 11-4 0 2 2 0 014 0zM9 19a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h3>
              <p className="text-gray-600">Add some products to get started!</p>
            </div>
          ) : (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {cart.map((item) => (
                <div key={`${item.id}-${item.cartId}`} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
                  {/* Product Image */}
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-white relative">
                    <SmartImage
                      codigo={item.CODIGO}
                      alt={item.DISCRIPCION}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 truncate">{item.DISCRIPCION}</h4>
                    <p className="text-sm text-gray-600">Code: {item.CODIGO}</p>
                    {item.MARCA && <p className="text-sm text-gray-600">Brand: {item.MARCA}</p>}
                    {isAdmin && <p className="text-lg font-bold text-blue-600">{formatPrice(item.COSTO)}</p>}
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onUpdateQuantity(item.cartId, Math.max(1, item.quantity - 1))}
                      className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
                      disabled={item.quantity <= 1}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                      </svg>
                    </button>
                    
                    <input
                      type="number"
                      min="1"
                      max="999"
                      value={item.quantity}
                      onChange={(e) => {
                        const value = parseInt(e.target.value);
                        if (!isNaN(value) && value > 0) {
                          onUpdateQuantity(item.cartId, value);
                        }
                      }}
                      onBlur={(e) => {
                        // Ensure minimum quantity of 1 on blur
                        const value = parseInt(e.target.value);
                        if (isNaN(value) || value < 1) {
                          onUpdateQuantity(item.cartId, 1);
                        }
                      }}
                      className="w-16 text-center font-semibold text-gray-900 border border-gray-200 rounded-lg px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    />
                    
                    <button
                      onClick={() => onUpdateQuantity(item.cartId, item.quantity + 1)}
                      className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  </div>

                  {/* Item Total - Admin Only */}
                  {isAdmin && (
                    <div className="text-right">
                      <p className="font-bold text-gray-900">{formatPrice(item.COSTO * item.quantity)}</p>
                    </div>
                  )}

                  {/* Remove Button */}
                  <button
                    onClick={() => onRemoveItem(item.cartId)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                    aria-label="Remove item"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Cart Summary - Admin Only */}
          {cart.length > 0 && isAdmin && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-semibold text-gray-900">Total ({getTotalItems()} items):</span>
                <span className="text-2xl font-bold text-blue-600">{formatPrice(getTotalPrice())}</span>
              </div>
            </div>
          )}
          
          {/* Summary for non-admin users */}
          {cart.length > 0 && !isAdmin && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="text-center">
                <p className="text-lg font-semibold text-gray-900">Ready to request a quote for {getTotalItems()} items</p>
                <p className="text-sm text-gray-600 mt-1">We&apos;ll provide pricing and availability information</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-between space-x-3 p-6 border-t border-gray-200 bg-gray-50">
          <button onClick={onClose} className="btn-secondary flex-1">
            Continue Shopping
          </button>
          {cart.length > 0 && (
            <button onClick={handleCheckout} className="btn-primary flex-1">
              {isAdmin ? `Checkout (${formatPrice(getTotalPrice())})` : 'Request Quote'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartModal;