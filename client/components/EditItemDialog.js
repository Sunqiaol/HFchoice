import React, { useState } from 'react';
import { uploadImageToStorage, deleteImageFromStorage } from '../utils/firebaseStorage';
import SmartImage from './SmartImage';

const EditItemDialog = ({ open, onClose, onEditItem, editItemData, handleEditChange, userRole }) => {
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };



  const handleSaveChanges = async () => {
    // Handle image upload if admin uploaded a new image
    if (userRole === 'Admin' && imageFile && editItemData.CODIGO) {
      setUploading(true);
      try {
        await uploadImageToStorage(imageFile, editItemData.CODIGO);
        setImageFile(null);
      } catch (error) {
        console.error('Image upload failed:', error);
        alert('Image upload failed: ' + error.message);
        setUploading(false);
        return;
      }
      setUploading(false);
    }
    
    onEditItem(editItemData);
    onClose();
  };

  const handleDeleteImage = async () => {
    if (!editItemData.CODIGO) return;
    
    try {
      await deleteImageFromStorage(editItemData.CODIGO);
      alert('Image deleted successfully');
    } catch (error) {
      console.error('Image deletion failed:', error);
      alert('Image deletion failed: ' + error.message);
    }
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
            {editItemData?.CODIGO && (
              <div className="mb-4 flex justify-center">
                <SmartImage
                  codigo={editItemData.CODIGO}
                  alt="Item"
                  className="h-32 w-32 object-cover rounded-full"
                />
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="CODIGO" className="block text-sm font-medium text-gray-700">Codigo</label>
                <input
                  type="text"
                  name="CODIGO"
                  value={editItemData?.CODIGO || ''}
                  onChange={handleEditChange}
                  placeholder="Codigo"
                  className="border rounded p-2 w-full"
                />
                
              </div>

              <div>
                <label htmlFor="DISCRIPCION" className="block text-sm font-medium text-gray-700">Description</label>
                <input
                  type="text"
                  name="DISCRIPCION"
                  value={editItemData?.DISCRIPCION || ''}
                  onChange={handleEditChange}
                  placeholder="Description"
                  className="border rounded p-2 w-full"
                />
              </div>
              <div>
                <label htmlFor="MARCA" className="block text-sm font-medium text-gray-700">Brand</label>
                <input
                  type="text"
                  name="MARCA"
                  value={editItemData?.MARCA || ''}
                  onChange={handleEditChange}
                  placeholder="Brand"
                  className="border rounded p-2 w-full"
                />
              </div>
              <div>
                <label htmlFor="GRUPO" className="block text-sm font-medium text-gray-700">Group</label>
                <input
                  type="text"
                  name="GRUPO"
                  value={editItemData?.GRUPO || ''}
                  onChange={handleEditChange}
                  placeholder="Group"
                  className="border rounded p-2 w-full"
                />
              </div>
              <div>
                <label htmlFor="UNIDAD" className="block text-sm font-medium text-gray-700">Unit</label>
                <input
                  type="text"
                  name="UNIDAD"
                  value={editItemData?.UNIDAD || ''}
                  onChange={handleEditChange}
                  placeholder="Unit"
                  className="border rounded p-2 w-full"
                />
              </div>
              <div>
                <label htmlFor="COSTO" className="block text-sm font-medium text-gray-700">Cost</label>
                <input
                  type="text"
                  name="COSTO"
                  value={editItemData?.COSTO || ''}
                  onChange={handleEditChange}
                  placeholder="Cost"
                  className="border rounded p-2 w-full"
                />
              </div>
              <div>
                <label htmlFor="P_A" className="block text-sm font-medium text-gray-700">P_A</label>
                <input
                  type="text"
                  name="P_A"
                  value={editItemData?.P_A || ''}
                  onChange={handleEditChange}
                  placeholder="P_A"
                  className="border rounded p-2 w-full"
                />
              </div>
              <div>
                <label htmlFor="P_B" className="block text-sm font-medium text-gray-700">P_B</label>
                <input
                  type="text"
                  name="P_B"
                  value={editItemData?.P_B || ''}
                  onChange={handleEditChange}
                  placeholder="P_B"
                  className="border rounded p-2 w-full"
                />
              </div>
              <div>
                <label htmlFor="P_C" className="block text-sm font-medium text-gray-700">P_C</label>
                <input
                  type="text"
                  name="P_C"
                  value={editItemData?.P_C || ''}
                  onChange={handleEditChange}
                  placeholder="P_C"
                  className="border rounded p-2 w-full"
                />
              </div>
              <div>
                <label htmlFor="P_D" className="block text-sm font-medium text-gray-700">P_D</label>
                <input
                  type="text"
                  name="P_D"
                  value={editItemData?.P_D || ''}
                  onChange={handleEditChange}
                  placeholder="P_D"
                  className="border rounded p-2 w-full"
                />
              </div>
              <div>
                <label htmlFor="INVE" className="block text-sm font-medium text-gray-700">Inve</label>
                <input
                  type="text"
                  name="INVE"
                  value={editItemData?.INVE || ''}
                  onChange={handleEditChange}
                  placeholder="Inve"
                  className="border rounded p-2 w-full"
                />
              </div>
              <div>
                <label htmlFor="UN_CTN" className="block text-sm font-medium text-gray-700">Un_Ctn</label>
                <input
                  type="text"
                  name="UN_CTN"
                  value={editItemData?.UN_CTN || ''}
                  onChange={handleEditChange}
                  placeholder="Un_Ctn"
                  className="border rounded p-2 w-full"
                />
              </div>
              <div>
                <label htmlFor="CTNS" className="block text-sm font-medium text-gray-700">Ctns</label>
                <input
                  type="text"
                  name="CTNS"
                  value={editItemData?.CTNS || ''}
                  onChange={handleEditChange}
                  placeholder="Ctns"
                  className="border rounded p-2 w-full"
                />
              </div>
              
              {userRole === 'Admin' && (
                <div className="col-span-2 mt-4 p-4 border rounded-lg bg-gray-50">
                  <h3 className="text-lg font-semibold mb-3">Image Management (Admin Only)</h3>
                  
                  <div className="flex gap-4 items-start">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Upload New Image
                      </label>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleFileChange}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      />
                      {imageFile && (
                        <p className="text-sm text-green-600 mt-1">
                          Selected: {imageFile.name}
                        </p>
                      )}
                    </div>
                    
                    <div className="flex-shrink-0">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Actions
                      </label>
                      <button
                        type="button"
                        onClick={handleDeleteImage}
                        className="px-3 py-2 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition"
                      >
                        🗑️ Delete Image
                      </button>
                    </div>
                  </div>
                  
                  <p className="text-xs text-gray-500 mt-2">
                    Image will be saved as: {editItemData?.CODIGO}.jpg
                  </p>
                </div>
              )}
            </div>
          </div>
          <div className="p-4 border-t flex justify-end space-x-2">
            <button onClick={onClose} className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400">
              Cancel
            </button>
            <button 
              onClick={handleSaveChanges} 
              className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
              disabled={uploading}
            >
              {uploading ? 'Uploading...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default EditItemDialog;
