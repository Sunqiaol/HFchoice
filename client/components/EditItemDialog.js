import React from 'react';

const EditItemDialog = ({ open, onClose, onEditItem, editItemData, handleEditChange }) => {
  const handleSaveChanges = () => {
    onEditItem(editItemData);
    onClose();
  };

  return (
    open && (
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="bg-black bg-opacity-50 fixed inset-0" onClick={onClose}></div>
        <div className="bg-white rounded-lg overflow-hidden shadow-xl w-full max-w-lg z-50">
          <div className="p-4 border-b text-center">
            <h2 className="text-xl font-semibold">Edit Item</h2>
          </div>
          <div className="p-4">
            {editItemData?.picture && (
              <div className="mb-4 flex justify-center">
                <img
                  src={editItemData.picture}
                  alt="Item"
                  className="h-32 w-32 object-cover rounded-full"
                />
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="picture" className="block text-sm font-medium text-gray-700">Picture URL</label>
                <input
                  type="text"
                  name="picture"
                  value={editItemData?.picture || ''}
                  onChange={handleEditChange}
                  placeholder="Picture URL"
                  className="border rounded p-2 w-full"
                />
              </div>
              <div>
                <label htmlFor="codigo" className="block text-sm font-medium text-gray-700">Codigo</label>
                <input
                  type="text"
                  name="codigo"
                  value={editItemData?.codigo || ''}
                  onChange={handleEditChange}
                  placeholder="Codigo"
                  className="border rounded p-2 w-full"
                />
              </div>
              <div>
                <label htmlFor="discripcion" className="block text-sm font-medium text-gray-700">Description</label>
                <input
                  type="text"
                  name="discripcion"
                  value={editItemData?.discripcion || ''}
                  onChange={handleEditChange}
                  placeholder="Description"
                  className="border rounded p-2 w-full"
                />
              </div>
              <div>
                <label htmlFor="marca" className="block text-sm font-medium text-gray-700">Brand</label>
                <input
                  type="text"
                  name="marca"
                  value={editItemData?.marca || ''}
                  onChange={handleEditChange}
                  placeholder="Brand"
                  className="border rounded p-2 w-full"
                />
              </div>
              <div>
                <label htmlFor="grupo" className="block text-sm font-medium text-gray-700">Group</label>
                <input
                  type="text"
                  name="grupo"
                  value={editItemData?.grupo || ''}
                  onChange={handleEditChange}
                  placeholder="Group"
                  className="border rounded p-2 w-full"
                />
              </div>
              <div>
                <label htmlFor="unidad" className="block text-sm font-medium text-gray-700">Unit</label>
                <input
                  type="text"
                  name="unidad"
                  value={editItemData?.unidad || ''}
                  onChange={handleEditChange}
                  placeholder="Unit"
                  className="border rounded p-2 w-full"
                />
              </div>
              <div>
                <label htmlFor="costo" className="block text-sm font-medium text-gray-700">Cost</label>
                <input
                  type="text"
                  name="costo"
                  value={editItemData?.costo || ''}
                  onChange={handleEditChange}
                  placeholder="Cost"
                  className="border rounded p-2 w-full"
                />
              </div>
              <div>
                <label htmlFor="p_a" className="block text-sm font-medium text-gray-700">P_A</label>
                <input
                  type="text"
                  name="p_a"
                  value={editItemData?.p_a || ''}
                  onChange={handleEditChange}
                  placeholder="P_A"
                  className="border rounded p-2 w-full"
                />
              </div>
              <div>
                <label htmlFor="p_b" className="block text-sm font-medium text-gray-700">P_B</label>
                <input
                  type="text"
                  name="p_b"
                  value={editItemData?.p_b || ''}
                  onChange={handleEditChange}
                  placeholder="P_B"
                  className="border rounded p-2 w-full"
                />
              </div>
              <div>
                <label htmlFor="p_c" className="block text-sm font-medium text-gray-700">P_C</label>
                <input
                  type="text"
                  name="p_c"
                  value={editItemData?.p_c || ''}
                  onChange={handleEditChange}
                  placeholder="P_C"
                  className="border rounded p-2 w-full"
                />
              </div>
              <div>
                <label htmlFor="p_d" className="block text-sm font-medium text-gray-700">P_D</label>
                <input
                  type="text"
                  name="p_d"
                  value={editItemData?.p_d || ''}
                  onChange={handleEditChange}
                  placeholder="P_D"
                  className="border rounded p-2 w-full"
                />
              </div>
              <div>
                <label htmlFor="inve" className="block text-sm font-medium text-gray-700">Inve</label>
                <input
                  type="text"
                  name="inve"
                  value={editItemData?.inve || ''}
                  onChange={handleEditChange}
                  placeholder="Inve"
                  className="border rounded p-2 w-full"
                />
              </div>
              <div>
                <label htmlFor="un_ctn" className="block text-sm font-medium text-gray-700">Un_Ctn</label>
                <input
                  type="text"
                  name="un_ctn"
                  value={editItemData?.un_ctn || ''}
                  onChange={handleEditChange}
                  placeholder="Un_Ctn"
                  className="border rounded p-2 w-full"
                />
              </div>
              <div>
                <label htmlFor="ctns" className="block text-sm font-medium text-gray-700">Ctns</label>
                <input
                  type="text"
                  name="ctns"
                  value={editItemData?.ctns || ''}
                  onChange={handleEditChange}
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
            <button onClick={handleSaveChanges} className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default EditItemDialog;
