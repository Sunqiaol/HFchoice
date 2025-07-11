import React, { useEffect, useState } from 'react';
import { signOut, getAuth } from 'firebase/auth';
import { useRouter } from 'next/router';
import { auth } from '../firebase';
import axios from 'axios';
import { Pagination } from '@mui/material';
import useAuth from '../hooks/useAuth';
import ItemDetailModal from '../components/ItemDetailModal';
import CartModal from '../components/CartModal';
import { getAllItems, addItem, editItem, deleteItem, toggleVisibility } from './api/itemApi';
import AddNewItemDialog from '../components/AddNewItemDialog';
import EditItemDialog from '../components/EditItemDialog';
import MuiAlert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';

const Dashboard = () => {
    const router = useRouter();
    const { user, role, loading } = useAuth();
    const [items, setItems] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(9);
    const [selectedItem, setSelectedItem] = useState(null);
    const [isItemModalOpen, setIsItemModalOpen] = useState(false);
    const [isCartModalOpen, setIsCartModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [cart, setCart] = useState([]);
    const itemsPerPageOptions = [9, 24, 49, 99];
    const [filters, setFilters] = useState({
        marca: '',
        grupo: '',
        unidad: '',
        modelo: '',
        minCost: '',
        maxCost: ''
    });
    const [editItemData, setEditItemData] = useState(null);
    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [filter, setFilter] = useState('all');

    // Extract unique filter options from items
    const uniqueOptions = (key) => [...new Set(items.map(item => item[key]).filter(Boolean))];
    const marcaOptions = uniqueOptions('marca');
    const grupoOptions = uniqueOptions('grupo');
    const unidadOptions = uniqueOptions('unidad');
    const modeloOptions = uniqueOptions('modelo');

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
        if (loading) return;
        if (!user) {
            router.push('/login');
            return;
        }
        const fetchItems = async () => {
            if (role === 'Admin') {
                const allItems = await getAllItems();
                console.log('Admin fetched items:', allItems);
                setItems(allItems);
            } else {
                try {
                    const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/item/getVisibleItems`);
                    console.log('User fetched visible items:', response.data);
                    setItems(response.data);
                } catch (error) {
                    console.error('Error fetching items:', error);
                }
            }
        };
        fetchItems();
    }, [role, loading, user]);

    useEffect(() => {
        console.log('Items state updated:', items);
    }, [items]);

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    const handleItemsPerPageChange = (event) => {
        setItemsPerPage(parseInt(event.target.value, 10));
        setCurrentPage(1);
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const handleItemClick = (item) => {
        setSelectedItem(item);
        setIsItemModalOpen(true);
    };

    const getProxiedImageUrl = (url) => {
        return `${process.env.NEXT_PUBLIC_SERVER_URL}/proxy?url=${encodeURIComponent(url)}`;
    };

    const addToCart = (item) => {
        setCart([...cart, item]);
    };

    const handleCheckout = async () => {
        try {
            await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/checkout/checkout`, {
                cart,
                userEmail: user.email
            });
            alert('Checkout successful! An email has been sent.');
            setCart([]);
            setIsCartModalOpen(false);
        } catch (error) {
            console.error('Error during checkout:', error);
            alert('Checkout failed. Please try again.');
        }
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
        setCurrentPage(1);
    };

    let filteredItems = items;
    if (role === 'Admin') {
        filteredItems = items.filter(item => {
            if (filter === 'visible') return item.visible;
            if (filter === 'non-visible') return !item.visible;
            return true;
        }).filter(item =>
            item.discripcion.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.codigo.toLowerCase().includes(searchQuery.toLowerCase())
        );
    } else {
        filteredItems = items.filter(item => {
            const matchesSearch =
                item.discripcion.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.codigo.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesMarca = !filters.marca || item.marca === filters.marca;
            const matchesGrupo = !filters.grupo || item.grupo === filters.grupo;
            const matchesUnidad = !filters.unidad || item.unidad === filters.unidad;
            const matchesModelo = !filters.modelo || item.modelo === filters.modelo;
            const matchesMinCost = !filters.minCost || parseFloat(item.costo) >= parseFloat(filters.minCost);
            const matchesMaxCost = !filters.maxCost || parseFloat(item.costo) <= parseFloat(filters.maxCost);
            return (
                matchesSearch &&
                matchesMarca &&
                matchesGrupo &&
                matchesUnidad &&
                matchesModelo &&
                matchesMinCost &&
                matchesMaxCost
            );
        });
    }

    const paginatedItems = filteredItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

    // Admin handlers
    const handleAddItem = async (newItem) => {
        await addItem(newItem);
        setOpenAddDialog(false);
        reloadItems();
        showSnackbar('Item added successfully');
    };
    const handleEditItem = async (editItemData) => {
        await editItem(editItemData);
        setOpenEditDialog(false);
        reloadItems();
        showSnackbar('Item edited successfully');
    };
    const handleDeleteItem = async (id) => {
        await deleteItem(id);
        reloadItems();
        showSnackbar('Item deleted successfully');
    };
    const handleToggleVisibility = async (id) => {
        await toggleVisibility(id);
        reloadItems();
        showSnackbar('Item visibility toggled successfully');
    };
    const reloadItems = async () => {
        if (role === 'Admin') {
            const allItems = await getAllItems();
            setItems(allItems);
        } else {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/item/getVisibleItems`);
            setItems(response.data);
        }
    };
    const showSnackbar = (message) => {
        setSnackbarMessage(message);
        setSnackbarOpen(true);
    };
    const handleEditChange = (event) => {
        const { name, value } = event.target;
        setEditItemData({ ...editItemData, [name]: value });
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            {/* Header */}
            <header className="sticky top-0 z-40 bg-white shadow flex items-center justify-between px-4 sm:px-8 py-3">
                <div className="flex items-center gap-2">
                    <img src="/favicon.ico" alt="HF Choice Logo" className="w-8 h-8" />
                    <span className="text-xl font-bold text-indigo-700 tracking-tight">HF Choice</span>
                </div>
                <nav className="hidden md:flex gap-6 text-gray-700 font-medium">
                    <button onClick={() => router.push('/dashboard')} className="hover:text-indigo-600">Home</button>
                    {role === 'Admin' && (
                        <button onClick={() => setOpenAddDialog(true)} className="hover:text-indigo-600">+ Add Item</button>
                    )}
                    <button onClick={signOutUser} className="hover:text-red-600">Sign Out</button>
                </nav>
                {role !== 'Admin' && (
                    <button onClick={() => setIsCartModalOpen(true)} className="relative group ml-4" aria-label="View cart">
                        <span className="text-2xl">🛒</span>
                        {cart.length > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 font-bold">{cart.length}</span>
                        )}
                    </button>
                )}
            </header>

            {/* Controls/Filters */}
            {role === 'Admin' ? (
                <section className="w-full bg-white shadow rounded-lg mt-4 mx-auto px-4 py-4 flex flex-col md:flex-row md:items-end md:justify-between gap-4 max-w-6xl">
                    <input
                        type="text"
                        placeholder="Search items..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                        className="border rounded p-2 w-full md:w-1/2 focus:ring-2 focus:ring-blue-400"
                        aria-label="Search items"
                    />
                    <div className="flex items-center gap-2 w-full md:w-auto">
                        <label htmlFor="filter" className="mr-2 text-xs font-semibold text-gray-600">Filter:</label>
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
                        <label htmlFor="itemsPerPage" className="ml-4 mr-2 text-xs font-semibold text-gray-600">Items per page:</label>
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
                    <button
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-full shadow-md transition duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-opacity-50 w-full md:w-auto"
                        onClick={() => setOpenAddDialog(true)}
                    >
                        + Add Item
                    </button>
                </section>
            ) : (
                <section className="w-full bg-white shadow rounded-lg mt-4 mx-auto px-4 py-4 flex flex-col md:flex-row md:items-end md:justify-between gap-4 max-w-6xl">
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                        className="border rounded p-2 w-full md:w-64 focus:ring-2 focus:ring-blue-400"
                        aria-label="Search items"
                    />
                    <div className="flex flex-wrap gap-2 w-full md:w-auto">
                        <div className="w-full sm:w-auto">
                            <label className="block text-xs font-semibold text-gray-600">Brand</label>
                            <select name="marca" value={filters.marca} onChange={handleFilterChange} className="border rounded p-2 w-full min-w-[100px]" aria-label="Filter by brand">
                                <option value="">All</option>
                                {marcaOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            </select>
                        </div>
                        <div className="w-full sm:w-auto">
                            <label className="block text-xs font-semibold text-gray-600">Group</label>
                            <select name="grupo" value={filters.grupo} onChange={handleFilterChange} className="border rounded p-2 w-full min-w-[100px]" aria-label="Filter by group">
                                <option value="">All</option>
                                {grupoOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            </select>
                        </div>
                        <div className="w-full sm:w-auto">
                            <label className="block text-xs font-semibold text-gray-600">Unit</label>
                            <select name="unidad" value={filters.unidad} onChange={handleFilterChange} className="border rounded p-2 w-full min-w-[100px]" aria-label="Filter by unit">
                                <option value="">All</option>
                                {unidadOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            </select>
                        </div>
                        <div className="w-full sm:w-auto">
                            <label className="block text-xs font-semibold text-gray-600">Model</label>
                            <select name="modelo" value={filters.modelo} onChange={handleFilterChange} className="border rounded p-2 w-full min-w-[100px]" aria-label="Filter by model">
                                <option value="">All</option>
                                {modeloOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            </select>
                        </div>
                        <div className="w-full sm:w-auto">
                            <label className="block text-xs font-semibold text-gray-600">Min Cost</label>
                            <input type="number" name="minCost" value={filters.minCost} onChange={handleFilterChange} className="border rounded p-2 w-full min-w-[80px]" placeholder="Min" aria-label="Minimum cost" />
                        </div>
                        <div className="w-full sm:w-auto">
                            <label className="block text-xs font-semibold text-gray-600">Max Cost</label>
                            <input type="number" name="maxCost" value={filters.maxCost} onChange={handleFilterChange} className="border rounded p-2 w-full min-w-[80px]" placeholder="Max" aria-label="Maximum cost" />
                        </div>
                    </div>
                    <div className="w-full md:w-auto">
                        <label htmlFor="itemsPerPage" className="mr-2 text-xs font-semibold text-gray-600">Items per page:</label>
                        <select
                            id="itemsPerPage"
                            value={itemsPerPage}
                            onChange={handleItemsPerPageChange}
                            className="border rounded p-2 w-full min-w-[100px]"
                            aria-label="Items per page"
                        >
                            {itemsPerPageOptions.map((option) => (
                                <option key={option} value={option}>{option}</option>
                            ))}
                        </select>
                    </div>
                </section>
            )}

            {/* Main Content */}
            <main className="flex-1 w-full max-w-6xl mx-auto px-2 sm:px-4 py-6">
                <div className={`grid ${role === 'Admin' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'} gap-6 mb-8`}>
                    {paginatedItems.map((item) => (
                        role === 'Admin' ? (
                            <div key={item.id} className="bg-white shadow-lg rounded-2xl p-4 flex flex-col hover:shadow-2xl transition duration-200 ease-in-out focus-within:ring-2 focus-within:ring-blue-400 cursor-pointer group">
                                <div className="flex flex-col items-center mb-4">
                                    <img src={getProxiedImageUrl(item.picture)} alt={item.codigo} className="w-24 h-24 rounded-xl object-cover bg-gray-100 mb-2 group-hover:scale-105 transition" onError={e => { e.target.onerror = null; e.target.src=''; e.target.style.background = '#000'; e.target.style.display = 'block'; }} />
                                    <h2 className="text-lg font-bold text-gray-800 text-center line-clamp-2 min-h-[48px]">{item.discripcion}</h2>
                                    <p className="text-gray-500 text-sm">{item.codigo}</p>
                                </div>
                                <div className="flex flex-col items-center gap-1 mb-2">
                                    <span className="text-xl font-bold text-indigo-600">${item.costo}</span>
                                    <span className="text-xs text-gray-400">Model: {item.modelo}</span>
                                    <span className="text-xs text-gray-400">Brand: {item.marca}</span>
                                    <span className="text-xs text-gray-400">Group: {item.grupo}</span>
                                    <span className="text-xs text-gray-400">Unit: {item.unidad}</span>
                                    <span className="text-xs text-gray-400">Visible: {item.visible ? 'Yes' : 'No'}</span>
                                </div>
                                <div className="flex justify-center gap-2 mt-auto">
                                    <button
                                        className="text-blue-600 hover:text-blue-800 bg-blue-50 rounded-full p-2 transition"
                                        onClick={() => { setEditItemData(item); setOpenEditDialog(true); }}
                                        aria-label="Edit item"
                                    >
                                        ✏️
                                    </button>
                                    <button
                                        className="text-red-600 hover:text-red-800 bg-red-50 rounded-full p-2 transition"
                                        onClick={() => handleDeleteItem(item.id)}
                                        aria-label="Delete item"
                                    >
                                        🗑️
                                    </button>
                                    <button
                                        className={`transition rounded-full p-2 ${item.visible ? 'text-green-600 bg-green-50 hover:text-green-800' : 'text-gray-400 bg-gray-100 hover:text-gray-600'}`}
                                        onClick={() => handleToggleVisibility(item.id)}
                                        aria-label="Toggle visibility"
                                    >
                                        {item.visible ? '👁️' : '🙈'}
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div key={item.id} className="bg-white shadow-lg rounded-2xl p-4 flex flex-col hover:shadow-2xl transition duration-200 ease-in-out focus-within:ring-2 focus-within:ring-blue-400 cursor-pointer group" onClick={() => handleItemClick(item)} tabIndex={0} aria-label={`View details for ${item.discripcion}`}> 
                                <div className="flex flex-col items-center mb-4">
                                    <img src={getProxiedImageUrl(item.picture)} alt={item.codigo} className="w-32 h-32 rounded-xl object-cover bg-gray-100 mb-2 group-hover:scale-105 transition" onError={e => { e.target.onerror = null; e.target.src=''; e.target.style.background = '#000'; e.target.style.display = 'block'; }} />
                                    <h2 className="text-lg font-bold text-gray-800 text-center line-clamp-2 min-h-[48px]">{item.discripcion}</h2>
                                    <p className="text-gray-500 text-sm">{item.codigo}</p>
                                </div>
                                <div className="flex flex-col items-center gap-1 mb-2">
                                    <span className="text-xl font-bold text-indigo-600">${item.costo}</span>
                                    <span className="text-xs text-gray-400">Model: {item.modelo}</span>
                                    <span className="text-xs text-gray-400">Brand: {item.marca}</span>
                                    <span className="text-xs text-gray-400">Group: {item.grupo}</span>
                                    <span className="text-xs text-gray-400">Unit: {item.unidad}</span>
                                </div>
                                <button
                                    className="mt-auto bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-full shadow-md transition duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-opacity-50 w-full"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        addToCart(item);
                                    }}
                                    aria-label={`Add ${item.discripcion} to cart`}
                                >
                                    Add to Cart
                                </button>
                            </div>
                        )
                    ))}
                </div>
                <div className="flex justify-center">
                    <Pagination
                        count={totalPages}
                        page={currentPage}
                        onChange={handlePageChange}
                        color="primary"
                    />
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-white border-t mt-8 py-4 text-center text-gray-500 text-sm">
                &copy; {new Date().getFullYear()} HF Choice. All rights reserved.
            </footer>

            {/* Modals and Dialogs */}
            {role === 'Admin' && (
                <>
                    <AddNewItemDialog open={openAddDialog} onClose={() => setOpenAddDialog(false)} onAdd={handleAddItem} />
                    <EditItemDialog open={openEditDialog} onClose={() => setOpenEditDialog(false)} item={editItemData} onEdit={handleEditItem} onChange={handleEditChange} />
                    <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={() => setSnackbarOpen(false)}>
                        <MuiAlert elevation={6} variant="filled" onClose={() => setSnackbarOpen(false)} severity="success">
                            {snackbarMessage}
                        </MuiAlert>
                    </Snackbar>
                </>
            )}
            {role !== 'Admin' && (
                <>
                    <ItemDetailModal
                        isOpen={isItemModalOpen}
                        onClose={() => setIsItemModalOpen(false)}
                        item={selectedItem}
                    />
                    <CartModal
                        isOpen={isCartModalOpen}
                        onClose={() => setIsCartModalOpen(false)}
                        cart={cart}
                        handleCheckout={handleCheckout}
                    />
                </>
            )}
        </div>
    );
};

export default Dashboard;
