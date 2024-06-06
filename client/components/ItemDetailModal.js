import React from 'react';

const ItemDetailModal = ({ isOpen, onClose, item }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl z-50 p-6">
        <button
          className="text-gray-600 hover:text-gray-900 mb-4"
          onClick={onClose}
        >
          Close
        </button>
        <div className="flex flex-col sm:flex-row">
          <img src={item.picture} alt={item.codigo} className="w-full sm:w-1/2 rounded-lg mb-4 sm:mb-0 sm:mr-4" />
          <div>
            <h2 className="text-2xl font-bold mb-2">{item.discripcion}</h2>
            <p className="text-gray-600 mb-1">Codigo: {item.codigo}</p>
            <p className="text-gray-600 mb-1">Model: {item.modelo}</p>
            <p className="text-gray-600 mb-1">Brand: {item.marca}</p>
            <p className="text-gray-600 mb-1">Group: {item.grupo}</p>
            <p className="text-gray-600 mb-1">Unit: {item.unidad}</p>
            <p className="text-gray-600 mb-1">Cost: {item.costo}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetailModal;
