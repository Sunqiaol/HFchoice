import React from 'react';
import SmartImage from './SmartImage';
import { USER_ROLES } from '../constants';
import useAuth from '../hooks/useAuth';

const ItemDetailModal = ({ isOpen, onClose, item }) => {
  const { role } = useAuth();
  if (!isOpen || !item) return null;

  const isAdmin = role === USER_ROLES.ADMIN;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(price);
  };


  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content max-w-4xl" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Product Details</h2>
            <p className="text-gray-600 mt-1">Code: {item.CODIGO}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
            aria-label="Close modal"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Product Image */}
            <div className="space-y-4">
              <div className="aspect-square bg-gray-50 rounded-2xl overflow-hidden shadow-lg relative">
                <SmartImage
                  codigo={item.CODIGO}
                  alt={item.DISCRIPCION}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Product Information */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{item.DISCRIPCION}</h1>
                {isAdmin && (
                  <div className="text-3xl font-bold text-blue-600 mb-4">{formatPrice(item.COSTO)}</div>
                )}
              </div>

              {/* Product Details Grid */}
              <div className="grid grid-cols-1 gap-4">
                {[
                  { label: 'Brand', value: item.MARCA },
                  { label: 'Model', value: item.MODELO },
                  { label: 'Category', value: item.GRUPO },
                  { label: 'Unit', value: item.UNIDAD },
                  { label: 'Inventory', value: item.INVE ? `${item.INVE} units` : null },
                  { label: 'Units per Carton', value: item.UN_CTN },
                  { label: 'Cartons', value: item.CTNS },
                ].filter(detail => detail.value).map((detail, index) => (
                  <div key={index} className="flex justify-between py-3 border-b border-gray-100 last:border-b-0">
                    <span className="text-gray-600 font-medium">{detail.label}:</span>
                    <span className="text-gray-900 font-semibold">{detail.value}</span>
                  </div>
                ))}
              </div>

              {/* Pricing Information - Admin Only */}
              {isAdmin && (item.P_A || item.P_B || item.P_C || item.P_D) && (
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Price Tiers</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: 'Price A', value: item.P_A },
                      { label: 'Price B', value: item.P_B },
                      { label: 'Price C', value: item.P_C },
                      { label: 'Price D', value: item.P_D },
                    ].filter(price => price.value).map((price, index) => (
                      <div key={index} className="flex justify-between">
                        <span className="text-gray-600 text-sm">{price.label}:</span>
                        <span className="text-gray-900 font-medium text-sm">{formatPrice(price.value)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
          <button onClick={onClose} className="btn-secondary">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ItemDetailModal;
