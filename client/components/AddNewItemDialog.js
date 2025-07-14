import React, { useState } from 'react';
import { getAuth } from 'firebase/auth';
import { app } from '../firebase';
import { uploadImageToStorage } from '../utils/firebaseStorage';

const AddNewItemDialog = ({ open, onClose, onAddItem, userRole }) => {
  const [newItem, setNewItem] = useState({
    CODIGO: '',
    DISCRIPCION: '',
    MARCA: '',
    GRUPO: '',
    UNIDAD: '',
    COSTO: '',
    P_A: '',
    P_B: '',
    P_C: '',
    P_D: '',
    INVE: '',
    UN_CTN: '',
    CTNS: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewItem({ ...newItem, [name]: value });
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };


  const handleAddItem = async () => {
    if (userRole === 'Admin' && imageFile && newItem.CODIGO) {
      setUploading(true);
      try {
        const auth = getAuth(app);
        const user = auth.currentUser;
        
        if (!user) {
          throw new Error('User not authenticated');
        }
        
        const result = await uploadImageToStorage(imageFile, newItem.CODIGO);
        
        setUploading(false);
        onAddItem(newItem);
        onClose();
        
      } catch (err) {
        console.error('Upload error:', err);
        alert('Image upload failed: ' + err.message);
        setUploading(false);
        return;
      }
    } else {
      onAddItem(newItem);
      onClose();
    }
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
                <label htmlFor="CODIGO" className="block text-sm font-medium text-gray-700">Codigo</label>
                <input
                  type="text"
                  name="CODIGO"
                  value={newItem.CODIGO}
                  onChange={handleChange}
                  placeholder="Codigo"
                  className="border rounded p-2 w-full"
                />
                <p className="text-xs text-gray-500 mt-1">Image will be saved as: {newItem.CODIGO || 'enter-codigo'}.jpg</p>
              </div>
              <div>
                <label htmlFor="DISCRIPCION" className="block text-sm font-medium text-gray-700">Description</label>
                <input
                  type="text"
                  name="DISCRIPCION"
                  value={newItem.DISCRIPCION}
                  onChange={handleChange}
                  placeholder="Description"
                  className="border rounded p-2 w-full"
                />
              </div>
              <div>
                <label htmlFor="MARCA" className="block text-sm font-medium text-gray-700">Brand</label>
                <input
                  type="text"
                  name="MARCA"
                  value={newItem.MARCA}
                  onChange={handleChange}
                  placeholder="Brand"
                  className="border rounded p-2 w-full"
                />
              </div>
              <div>
                <label htmlFor="GRUPO" className="block text-sm font-medium text-gray-700">Group</label>
                <input
                  type="text"
                  name="GRUPO"
                  value={newItem.GRUPO}
                  onChange={handleChange}
                  placeholder="Group"
                  className="border rounded p-2 w-full"
                />
              </div>
              <div>
                <label htmlFor="UNIDAD" className="block text-sm font-medium text-gray-700">Unit</label>
                <input
                  type="text"
                  name="UNIDAD"
                  value={newItem.UNIDAD}
                  onChange={handleChange}
                  placeholder="Unit"
                  className="border rounded p-2 w-full"
                />
              </div>
              <div>
                <label htmlFor="COSTO" className="block text-sm font-medium text-gray-700">Cost</label>
                <input
                  type="text"
                  name="COSTO"
                  value={newItem.COSTO}
                  onChange={handleChange}
                  placeholder="Cost"
                  className="border rounded p-2 w-full"
                />
              </div>
              <div>
                <label htmlFor="P_A" className="block text-sm font-medium text-gray-700">P_A</label>
                <input
                  type="text"
                  name="P_A"
                  value={newItem.P_A}
                  onChange={handleChange}
                  placeholder="P_A"
                  className="border rounded p-2 w-full"
                />
              </div>
              <div>
                <label htmlFor="P_B" className="block text-sm font-medium text-gray-700">P_B</label>
                <input
                  type="text"
                  name="P_B"
                  value={newItem.P_B}
                  onChange={handleChange}
                  placeholder="P_B"
                  className="border rounded p-2 w-full"
                />
              </div>
              <div>
                <label htmlFor="P_C" className="block text-sm font-medium text-gray-700">P_C</label>
                <input
                  type="text"
                  name="P_C"
                  value={newItem.P_C}
                  onChange={handleChange}
                  placeholder="P_C"
                  className="border rounded p-2 w-full"
                />
              </div>
              <div>
                <label htmlFor="P_D" className="block text-sm font-medium text-gray-700">P_D</label>
                <input
                  type="text"
                  name="P_D"
                  value={newItem.P_D}
                  onChange={handleChange}
                  placeholder="P_D"
                  className="border rounded p-2 w-full"
                />
              </div>
              <div>
                <label htmlFor="INVE" className="block text-sm font-medium text-gray-700">Inve</label>
                <input
                  type="text"
                  name="INVE"
                  value={newItem.INVE}
                  onChange={handleChange}
                  placeholder="Inve"
                  className="border rounded p-2 w-full"
                />
              </div>
              <div>
                <label htmlFor="UN_CTN" className="block text-sm font-medium text-gray-700">Un_Ctn</label>
                <input
                  type="text"
                  name="UN_CTN"
                  value={newItem.UN_CTN}
                  onChange={handleChange}
                  placeholder="Un_Ctn"
                  className="border rounded p-2 w-full"
                />
              </div>
              <div>
                <label htmlFor="CTNS" className="block text-sm font-medium text-gray-700">Ctns</label>
                <input
                  type="text"
                  name="CTNS"
                  value={newItem.CTNS}
                  onChange={handleChange}
                  placeholder="Ctns"
                  className="border rounded p-2 w-full"
                />
              </div>
              {userRole === 'Admin' && (
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Upload Image (Admin only)</label>
                  <input type="file" accept="image/*" onChange={handleFileChange} />
                </div>
              )}
            </div>
          </div>
          <div className="p-4 border-t flex justify-end space-x-2">
            <button onClick={onClose} className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400">
              Cancel
            </button>
            <button onClick={handleAddItem} className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600" disabled={uploading}>
              {uploading ? 'Uploading...' : 'Add Item'}
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default AddNewItemDialog;
