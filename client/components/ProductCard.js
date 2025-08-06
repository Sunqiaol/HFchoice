import React from 'react';
import { USER_ROLES } from '../constants';
import SmartImage from './ui/SmartImage';
import { useTranslation } from '../hooks/useTranslation';

const ProductCard = ({ 
  item, 
  role, 
  onItemClick, 
  onAddToCart, 
  onEdit, 
  onDelete, 
  onToggleVisibility 
}) => {
  const isAdmin = role === USER_ROLES.ADMIN;
  const { t } = useTranslation();

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(price);
  };

  return (
    <div 
      className={`card-hover group cursor-pointer ${!item.VISIBLE && isAdmin ? 'opacity-60' : ''}`}
      onClick={() => onItemClick(item)}
      role='button'
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onItemClick(item);
        }
      }}
      aria-label={`View details for ${item.DISCRIPCION}`}
    >
      <div className='relative overflow-hidden'>
        {/* Product Image */}
        <div className='aspect-square relative bg-gray-50'>
          <SmartImage
            codigo={item.CODIGO}
            alt={item.DISCRIPCION}
            className='w-full h-full object-cover transition-transform duration-300 group-hover:scale-110'
          />
          
          {/* Visibility Badge for Admin */}
          {isAdmin && (
            <div className='absolute top-3 left-3'>
              <span className={`badge ${item.VISIBLE ? 'badge-success' : 'badge-error'}`}>
                {item.VISIBLE ? t('productCard.visible') : t('productCard.hidden')}
              </span>
            </div>
          )}
          
          {/* Quick Actions for Admin */}
          {isAdmin && (
            <div className='absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200'>
              <div className='flex space-x-1'>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(item);
                  }}
                  className='p-2 bg-white/90 hover:bg-white rounded-full shadow-elegant transition-all duration-200 hover:scale-110'
                  aria-label={t('productCard.editProduct')}
                >
                  <svg className='w-4 h-4 text-primary-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' />
                  </svg>
                </button>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleVisibility(item.id);
                  }}
                  className='p-2 bg-white/90 hover:bg-white rounded-full shadow-elegant transition-all duration-200 hover:scale-110'
                  aria-label={t('productCard.toggleVisibility')}
                >
                  <svg className={`w-4 h-4 ${item.VISIBLE ? 'text-success-600' : 'text-secondary-400'}`} fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d={item.VISIBLE ? 'M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z' : 'M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21'} />
                  </svg>
                </button>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(item.id);
                  }}
                  className='p-2 bg-white/90 hover:bg-white rounded-full shadow-elegant transition-all duration-200 hover:scale-110'
                  aria-label={t('productCard.deleteProduct')}
                >
                  <svg className='w-4 h-4 text-red-500' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16' />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className='p-5'>
          <div className='mb-3'>
            <h3 className='font-semibold text-gray-900 text-lg line-clamp-2 mb-1 group-hover:text-blue-600 transition-colors duration-200'>
              {item.DISCRIPCION}
            </h3>
            <p className='text-secondary-500 text-sm font-medium'>
              {t('productCard.code')} {item.CODIGO}
            </p>
          </div>

          {/* Product Details */}
          <div className='space-y-2 mb-4'>
            {item.MARCA && (
              <div className='flex justify-between text-sm'>
                <span className='text-secondary-600'>{t('productCard.brand')}</span>
                <span className='text-secondary-900 font-medium'>{item.MARCA}</span>
              </div>
            )}
            {item.MODELO && (
              <div className='flex justify-between text-sm'>
                <span className='text-secondary-600'>{t('productCard.model')}</span>
                <span className='text-secondary-900 font-medium'>{item.MODELO}</span>
              </div>
            )}
            {item.GRUPO && (
              <div className='flex justify-between text-sm'>
                <span className='text-secondary-600'>{t('productCard.category')}</span>
                <span className='text-secondary-900 font-medium'>{item.GRUPO}</span>
              </div>
            )}
            {item.UNIDAD && (
              <div className='flex justify-between text-sm'>
                <span className='text-secondary-600'>{t('productCard.unit')}</span>
                <span className='text-secondary-900 font-medium'>{item.UNIDAD}</span>
              </div>
            )}
          </div>

          {/* Price - Only visible to admins */}
          {isAdmin && (
            <div className='mb-4'>
              <div className='text-2xl font-bold text-blue-600'>{formatPrice(item.COSTO)}</div>
              {item.INVE && (
                <p className='text-sm text-gray-500 mt-1'>
                  {t('productCard.inStock').replace('{count}', item.INVE)}
                </p>
              )}
            </div>
          )}
          
          {/* Stock info for non-admin users */}
          {!isAdmin && item.INVE && (
            <div className='mb-4'>
              <p className='text-sm text-gray-500'>
                In Stock: {item.INVE} units
              </p>
            </div>
          )}

          {/* Actions */}
          <div className='flex space-x-2'>
            {!isAdmin ? (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onItemClick(item);
                  }}
                  className='flex-1 btn-secondary text-sm py-2.5'
                >
                  {t('productCard.viewDetails')}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddToCart(item);
                  }}
                  className='btn-primary text-sm py-2.5 px-4 flex items-center space-x-1'
                >
                  <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.6 3.2a1 1 0 001 1.4h9.2' />
                  </svg>
                  <span>{t('productCard.addToCart')}</span>
                </button>
              </>
            ) : (
              <div className='w-full text-center py-2 text-sm text-gray-500'>
                {t('productCard.clickToView')}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;