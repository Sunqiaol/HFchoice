import React, { useState } from 'react';

const AddNewItemDialog = ({ open, onClose, onAddItem }) => {
  const [newItem, setNewItem] = useState({
    picture: '',
    codigo: '',
    discripcion: '',
    marca: '',
    grupo: '',
    unidad: '',
    costo: '',
    p_a: '',
    p_b: '',
    p_c: '',
    p_d: '',
    inve: '',
    un_ctn: '',
    ctns: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewItem({ ...newItem, [name]: value });
  };

  const handleAddItem = () => {
    onAddItem(newItem);
    onClose();
  };

  return (
    open && (
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="bg-black bg-opacity-50 fixed inset-0" onClick={onClose}></div>
        <div className="bg-white rounded-lg overflow-hidden shadow-xl w-full max-w-lg z-50">
          <div className="p-4 border-b">
            <h2 className="text-xl font-semibold">Add New Item</h2>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="picture" className="block text-sm font-medium text-gray-700">Picture URL</label>
                <input
                  type="text"
                  name="picture"
                  value={newItem.picture}
                  onChange={handleChange}
                  placeholder="Picture URL"
                  className="border rounded p-2 w-full"
                />
              </div>
              <div>
                <label htmlFor="codigo" className="block text-sm font-medium text-gray-700">Codigo</label>
                <input
                  type="text"
                  name="codigo"
                  value={newItem.codigo}
                  onChange={handleChange}
                  placeholder="Codigo"
                  className="border rounded p-2 w-full"
                />
              </div>
              <div>
                <label htmlFor="discripcion" className="block text-sm font-medium text-gray-700">Description</label>
                <input
                  type="text"
                  name="discripcion"
                  value={newItem.discripcion}
                  onChange={handleChange}
                  placeholder="Description"
                  className="border rounded p-2 w-full"
                />
              </div>
              <div>
                <label htmlFor="marca" className="block text-sm font-medium text-gray-700">Brand</label>
                <input
                  type="text"
                  name="marca"
                  value={newItem.marca}
                  onChange={handleChange}
                  placeholder="Brand"
                  className="border rounded p-2 w-full"
                />
              </div>
              <div>
                <label htmlFor="grupo" className="block text-sm font-medium text-gray-700">Group</label>
                <input
                  type="text"
                  name="grupo"
                  value={newItem.grupo}
                  onChange={handleChange}
                  placeholder="Group"
                  className="border rounded p-2 w-full"
                />
              </div>
              <div>
                <label htmlFor="unidad" className="block text-sm font-medium text-gray-700">Unit</label>
                <input
                  type="text"
                  name="unidad"
                  value={newItem.unidad}
                  onChange={handleChange}
                  placeholder="Unit"
                  className="border rounded p-2 w-full"
                />
              </div>
              <div>
                <label htmlFor="costo" className="block text-sm font-medium text-gray-700">Cost</label>
                <input
                  type="text"
                  name="costo"
                  value={newItem.costo}
                  onChange={handleChange}
                  placeholder="Cost"
                  className="border rounded p-2 w-full"
                />
              </div>
              <div>
                <label htmlFor="p_a" className="block text-sm font-medium text-gray-700">P_A</label>
                <input
                  type="text"
                  name="p_a"
                  value={newItem.p_a}
                  onChange={handleChange}
                  placeholder="P_A"
                  className="border rounded p-2 w-full"
                />
              </div>
              <div>
                <label htmlFor="p_b" className="block text-sm font-medium text-gray-700">P_B</label>
                <input
                  type="text"
                  name="p_b"
                  value={newItem.p_b}
                  onChange={handleChange}
                  placeholder="P_B"
                  className="border rounded p-2 w-full"
                />
              </div>
              <div>
                <label htmlFor="p_c" className="block text-sm font-medium text-gray-700">P_C</label>
                <input
                  type="text"
                  name="p_c"
                  value={newItem.p_c}
                  onChange={handleChange}
                  placeholder="P_C"
                  className="border rounded p-2 w-full"
                />
              </div>
              <div>
                <label htmlFor="p_d" className="block text-sm font-medium text-gray-700">P_D</label>
                <input
                  type="text"
                  name="p_d"
                  value={newItem.p_d}
                  onChange={handleChange}
                  placeholder="P_D"
                  className="border rounded p-2 w-full"
                />
              </div>
              <div>
                <label htmlFor="inve" className="block text-sm font-medium text-gray-700">Inve</label>
                <input
                  type="text"
                  name="inve"
                  value={newItem.inve}
                  onChange={handleChange}
                  placeholder="Inve"
                  className="border rounded p-2 w-full"
                />
              </div>
              <div>
                <label htmlFor="un_ctn" className="block text-sm font-medium text-gray-700">Un_Ctn</label>
                <input
                  type="text"
                  name="un_ctn"
                  value={newItem.un_ctn}
                  onChange={handleChange}
                  placeholder="Un_Ctn"
                  className="border rounded p-2 w-full"
                />
              </div>
              <div>
                <label htmlFor="ctns" className="block text-sm font-medium text-gray-700">Ctns</label>
                <input
                  type="text"
                  name="ctns"
                  value={newItem.ctns}
                  onChange={handleChange}
                  placeholder="Ctns"
                  className="border rounded p-2 w-full"
                />
              </div>
            </div>
          </div>
          <div className="p-4 border-t flex justify-end space-x-2">
            <button onClick={onClose} className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400">
              Cancel
            </button>
            <button onClick={handleAddItem} className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600">
              Add Item
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default AddNewItemDialog;
