import React, { useState } from 'react';
import { PAGINATION_OPTIONS, USER_ROLES } from '../constants';

const SearchFilters = ({ 
  searchQuery, 
  onSearchChange, 
  filters, 
  onFilterChange, 
  itemsPerPage, 
  onItemsPerPageChange, 
  uniqueOptions, 
  role, 
  adminFilter, 
  onAdminFilterChange 
}) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const isAdmin = role === USER_ROLES.ADMIN;

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 mb-8">
      <div className="p-6">
        {/* Search Bar */}
        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder={isAdmin ? "Search products..." : "Search our catalog..."}
            value={searchQuery}
            onChange={onSearchChange}
            className="input-field pl-12 pr-4 text-lg"
          />
        </div>

        {/* Filter Toggle Button */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
            </svg>
            <span>Filters</span>
            <svg className={`w-4 h-4 transition-transform duration-200 ${isFilterOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Items Per Page */}
          <div className="flex items-center space-x-3">
            <label className="text-sm font-medium text-gray-700">Show:</label>
            <select
              value={itemsPerPage}
              onChange={onItemsPerPageChange}
              className="input-field w-auto min-w-[80px] py-2"
            >
              {PAGINATION_OPTIONS.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Filters */}
        {isFilterOpen && (
          <div className="border-t border-gray-200 pt-6 animate-slide-up">
            {isAdmin ? (
              /* Admin Filters */
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Product Visibility</label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { value: 'all', label: 'All Products' },
                      { value: 'visible', label: 'Visible Only' },
                      { value: 'non-visible', label: 'Hidden Only' }
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => onAdminFilterChange({ target: { value: option.value } })}
                        className={`filter-chip ${
                          adminFilter === option.value ? 'filter-chip-active' : ''
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              /* User Filters */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Brand Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Brand</label>
                  <select
                    name="marca"
                    value={filters.marca}
                    onChange={onFilterChange}
                    className="input-field w-full py-2"
                  >
                    <option value="">All Brands</option>
                    {uniqueOptions.marcaOptions?.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>

                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    name="grupo"
                    value={filters.grupo}
                    onChange={onFilterChange}
                    className="input-field w-full py-2"
                  >
                    <option value="">All Categories</option>
                    {uniqueOptions.grupoOptions?.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>

                {/* Unit Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Unit</label>
                  <select
                    name="unidad"
                    value={filters.unidad}
                    onChange={onFilterChange}
                    className="input-field w-full py-2"
                  >
                    <option value="">All Units</option>
                    {uniqueOptions.unidadOptions?.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>

                {/* Model Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Model</label>
                  <select
                    name="modelo"
                    value={filters.modelo}
                    onChange={onFilterChange}
                    className="input-field w-full py-2"
                  >
                    <option value="">All Models</option>
                    {uniqueOptions.modeloOptions?.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Clear Filters */}
            <div className="flex justify-end mt-6 pt-4 border-t border-gray-200">
              <button
                onClick={() => {
                  if (isAdmin) {
                    onAdminFilterChange({ target: { value: 'all' } });
                  } else {
                    onFilterChange({
                      target: {
                        name: 'reset',
                        value: {
                          marca: '',
                          grupo: '',
                          unidad: '',
                          modelo: '',
                          minCost: '',
                          maxCost: ''
                        }
                      }
                    });
                  }
                }}
                className="btn-secondary text-sm"
              >
                Clear All Filters
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchFilters;