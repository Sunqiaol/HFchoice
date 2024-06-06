import React, { useEffect, useState } from 'react';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/router';
import { getAuth } from 'firebase/auth';
import useAuth from '../hooks/useAuth';
import { app } from '../firebase';
import { getAllItems, addItem, editItem, deleteItem, toggleVisibility } from './api/itemApi';
import { Pagination, Snackbar } from '@mui/material';
import { PencilAltIcon, TrashIcon } from '@heroicons/react/solid';
import AddNewItemDialog from '../components/AddNewItemDialog';
import EditItemDialog from '../components/EditItemDialog';
import MuiAlert from '@mui/material/Alert';

const Admin = () => {
  const router = useRouter();
  const { user, role, loading } = useAuth();
  const auth = getAuth(app);
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({});
  const [editItemData, setEditItemData] = useState(null);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [batchData, setBatchData] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(24);
  const [searchQuery, setSearchQuery] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [filter, setFilter] = useState('all'); // New filter state
  const itemsPerPageOptions = [9, 24, 49, 99];

  const signOutUser = () => {
    signOut(auth)
      .then(() => {
        console.log("User signed out.");
        router.push('/login');
      })
      .catch((error) => {
        console.error("Error signing out: ", error);
      });
  };

  useEffect(() => {
    if (!loading && role !== 'Admin') {
      router.push('/dashboard');
    } else if (role === 'Admin') {
      loadItems();
    }
  }, [role, loading, router]);

  const loadItems = async () => {
    const items = await getAllItems();
    setItems(items);
  };

  const handleAddItem = async (newItem) => {
    await addItem(newItem);
    setNewItem({});
    setOpenAddDialog(false);
    loadItems();
    showSnackbar('Item added successfully');
  };

  const handleEditItem = async (editItemData) => {
    await editItem(editItemData);
    setEditItemData(null);
    setOpenEditDialog(false);
    loadItems();
    showSnackbar('Item edited successfully');
  };

  const handleDeleteItem = async (id) => {
    await deleteItem(id);
    loadItems();
    showSnackbar('Item deleted successfully');
  };

  const handleToggleVisibility = async (id) => {
    await toggleVisibility(id);
    loadItems();
    showSnackbar('Item visibility toggled successfully');
  };

  const showSnackbar = (message) => {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full" role="status"></div></div>;
  }

  const handleEditChange = (event) => {
    const { name, value } = event.target;
    setEditItemData({ ...editItemData, [name]: value });
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(1);
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
    setCurrentPage(1);
  };

  const getProxiedImageUrl = (url) => {
    return `/proxy?url=${encodeURIComponent(url)}`;
  };

  const filteredItems = items.filter(item => {
    if (filter === 'visible') return item.visible;
    if (filter === 'non-visible') return !item.visible;
    return true; // 'all'
  }).filter(item =>
    item.discripcion.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.codigo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentItems = filteredItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Welcome To Admin</h1>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full shadow-md transition duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50"
          onClick={() => setOpenAddDialog(true)}
        >
          Add Item
        </button>
        <div className="flex space-x-4">
          <button onClick={signOutUser} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full shadow-md transition duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-opacity-50 mb-8">
            Sign Out
          </button>

          <button
            onClick={() => router.push('/dashboard')}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full shadow-md transition duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-opacity-50 mb-8 mr-3"
          >
            Dashboard
          </button>
        </div>
      </div>
      <div className="flex justify-between items-center mb-8">
        <input
          type="text"
          placeholder="Search"
          value={searchQuery}
          onChange={handleSearchChange}
          className="border rounded p-2 w-full mr-4"
        />
        <div>
          <label htmlFor="filter" className="mr-2">Filter:</label>
          <select
            id="filter"
            value={filter}
            onChange={handleFilterChange}
            className="border rounded p-2"
          >
            <option value="all">All</option>
            <option value="visible">Visible only</option>
            <option value="non-visible">Non-visible only</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {currentItems.map((item) => (
          <div key={item.id} className="bg-white shadow-md rounded p-4">
            <div className="flex items-center mb-4">
              <img src={getProxiedImageUrl(item.picture)} alt={item.codigo} className="w-16 h-16 rounded-full mr-4" />
              <div>
                <h2 className="text-xl font-bold">{item.discripcion}</h2>
                <p className="text-gray-600">{item.codigo}</p>
              </div>
            </div>
            <div className="flex justify-end">
              <button
                className="text-blue-500 hover:text-blue-700 mr-2"
                onClick={() => { setEditItemData(item); setOpenEditDialog(true); }}
              >
                <PencilAltIcon className="w-5 h-5" />
              </button>
              <button
                className="text-red-500 hover:text-red-700 mr-2"
                onClick={() => handleDeleteItem(item.id)}
              >
                <TrashIcon className="w-5 h-5" />
              </button>
              <button
                className={`text-${item.visible ? 'green' : 'gray'}-500 hover:text-${item.visible ? 'green' : 'gray'}-700`}
                onClick={() => handleToggleVisibility(item.id)}
              >
                {item.visible ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-between items-center">
        <div>
          <label htmlFor="itemsPerPage" className="mr-2">Items per page:</label>
          <select
            id="itemsPerPage"
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}
            className="border rounded p-2"
          >
            {itemsPerPageOptions.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>
        <div>
          <Pagination count={totalPages} page={currentPage} onChange={handlePageChange} color="primary" />
        </div>
      </div>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
      >
        <MuiAlert onClose={() => setSnackbarOpen(false)} severity="success" elevation={6} variant="filled">
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>

      <AddNewItemDialog
        open={openAddDialog}
        onClose={() => setOpenAddDialog(false)}
        onAddItem={handleAddItem}
      />

      <EditItemDialog
        open={openEditDialog}
        onClose={() => setOpenEditDialog(false)}
        onEditItem={handleEditItem}
        editItemData={editItemData}
        handleEditChange={handleEditChange}
      />
    </div>
  );
};

export default Admin;
