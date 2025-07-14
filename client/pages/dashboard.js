import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { Pagination } from '@mui/material';
import useAuth from '../hooks/useAuth';
import Header from '../components/Header';
import SearchFilters from '../components/SearchFilters';
import ProductCard from '../components/ProductCard';
import ItemDetailModal from '../components/ItemDetailModal';
import CartModal from '../components/CartModal';
import { getAllItems, addItem, editItem, deleteItem, toggleVisibility } from './api/itemApi';
import AddNewItemDialog from '../components/AddNewItemDialog';
import EditItemDialog from '../components/EditItemDialog';
import MuiAlert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import { PAGINATION_OPTIONS, USER_ROLES } from '../constants';

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
    const itemsPerPageOptions = PAGINATION_OPTIONS;
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
    const [isLoading, setIsLoading] = useState(true);

    // Extract unique filter options from items
    const uniqueOptions = (key) => [...new Set(items.map(item => item[key]).filter(Boolean))];
    const marcaOptions = uniqueOptions('MARCA');
    const grupoOptions = uniqueOptions('GRUPO');
    const unidadOptions = uniqueOptions('UNIDAD');
    const modeloOptions = uniqueOptions('MODELO');

    useEffect(() => {
        if (loading) return;
        if (!user) {
            router.push('/login');
            return;
        }
        const fetchItems = async () => {
            setIsLoading(true);
            try {
                if (role === USER_ROLES.ADMIN) {
                    const allItems = await getAllItems();
                    setItems(allItems);
                } else {
                    const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/item/getVisibleItems`);
                    setItems(response.data);
                }
            } catch (error) {
                console.error('Error fetching items:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchItems();
    }, [role, loading, user, router]);

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    const handleItemsPerPageChange = (event) => {
        setItemsPerPage(parseInt(event.target.value, 10));
        setCurrentPage(1);
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
        setCurrentPage(1);
    };

    const handleItemClick = (item) => {
        setSelectedItem(item);
        setIsItemModalOpen(true);
    };

    const addToCart = (item) => {
        const cartId = `${item.id}-${Date.now()}`;
        const cartItem = {
            ...item,
            cartId,
            quantity: 1
        };
        setCart([...cart, cartItem]);
        showSnackbar(`${item.DISCRIPCION} added to cart`);
    };

    const updateCartQuantity = (cartId, newQuantity) => {
        if (newQuantity <= 0) {
            removeFromCart(cartId);
            return;
        }
        setCart(prevCart => 
            prevCart.map(item => 
                item.cartId === cartId 
                    ? { ...item, quantity: newQuantity }
                    : item
            )
        );
    };

    const removeFromCart = (cartId) => {
        setCart(prevCart => prevCart.filter(item => item.cartId !== cartId));
        showSnackbar('Item removed from cart');
    };

    const getTotalCartItems = () => {
        return cart.reduce((total, item) => total + item.quantity, 0);
    };

    const handleCheckout = async () => {
        try {
            await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/checkout/checkout`, {
                cart,
                userEmail: user.email
            });
            showSnackbar('Checkout successful! An email has been sent.');
            setCart([]);
            setIsCartModalOpen(false);
        } catch (error) {
            console.error('Error during checkout:', error);
            showSnackbar('Checkout failed. Please try again.');
        }
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        if (name === 'reset') {
            setFilters(value);
        } else {
            setFilters(prev => ({ ...prev, [name]: value }));
        }
        setCurrentPage(1);
    };

    const handleAdminFilterChange = (e) => {
        setFilter(e.target.value);
        setCurrentPage(1);
    };

    let filteredItems = items;
    if (role === USER_ROLES.ADMIN) {
        filteredItems = items.filter(item => {
            if (filter === 'visible') return item.VISIBLE;
            if (filter === 'non-visible') return !item.VISIBLE;
            return true;
        }).filter(item =>
            item.DISCRIPCION.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.CODIGO.toLowerCase().includes(searchQuery.toLowerCase())
        );
    } else {
        filteredItems = items.filter(item => {
            const matchesSearch =
                item.DISCRIPCION.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.CODIGO.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesMarca = !filters.marca || item.MARCA === filters.marca;
            const matchesGrupo = !filters.grupo || item.GRUPO === filters.grupo;
            const matchesUnidad = !filters.unidad || item.UNIDAD === filters.unidad;
            const matchesModelo = !filters.modelo || item.MODELO === filters.modelo;
            const matchesMinCost = !filters.minCost || parseFloat(item.COSTO) >= parseFloat(filters.minCost);
            const matchesMaxCost = !filters.maxCost || parseFloat(item.COSTO) <= parseFloat(filters.maxCost);
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
        try {
            await addItem(newItem);
            setOpenAddDialog(false);
            await reloadItems();
            showSnackbar('Product added successfully');
        } catch (error) {
            console.error('Error adding item:', error);
            showSnackbar('Failed to add product');
        }
    };

    const handleEditItem = async (editItemData) => {
        try {
            await editItem(editItemData);
            setOpenEditDialog(false);
            await reloadItems();
            showSnackbar('Product updated successfully');
        } catch (error) {
            console.error('Error editing item:', error);
            showSnackbar('Failed to update product');
        }
    };

    const handleDeleteItem = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await deleteItem(id);
                await reloadItems();
                showSnackbar('Product deleted successfully');
            } catch (error) {
                console.error('Error deleting item:', error);
                showSnackbar('Failed to delete product');
            }
        }
    };

    const handleToggleVisibility = async (id) => {
        try {
            await toggleVisibility(id);
            await reloadItems();
            showSnackbar('Product visibility updated');
        } catch (error) {
            console.error('Error toggling visibility:', error);
            showSnackbar('Failed to update visibility');
        }
    };

    const reloadItems = async () => {
        setIsLoading(true);
        try {
            if (role === USER_ROLES.ADMIN) {
                const allItems = await getAllItems();
                setItems(allItems);
            } else {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/item/getVisibleItems`);
                setItems(response.data);
            }
        } catch (error) {
            console.error('Error reloading items:', error);
        } finally {
            setIsLoading(false);
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

    if (loading || isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="loading-spinner w-12 h-12 mx-auto mb-4"></div>
                    <p className="text-gray-600 text-lg">Loading products...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
            <Header
                user={user}
                role={role}
                cart={cart}
                cartItemCount={getTotalCartItems()}
                onCartClick={() => setIsCartModalOpen(true)}
                onAddItemClick={() => setOpenAddDialog(true)}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <SearchFilters
                    searchQuery={searchQuery}
                    onSearchChange={handleSearchChange}
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    itemsPerPage={itemsPerPage}
                    onItemsPerPageChange={handleItemsPerPageChange}
                    uniqueOptions={{
                        marcaOptions,
                        grupoOptions,
                        unidadOptions,
                        modeloOptions
                    }}
                    role={role}
                    adminFilter={filter}
                    onAdminFilterChange={handleAdminFilterChange}
                />

                {/* Main Content */}
                <div className="mb-8">
                    {/* Results Summary */}
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            {role === USER_ROLES.ADMIN ? 'Product Management' : 'Our Products'}
                        </h2>
                        <p className="text-gray-600">
                            Showing {paginatedItems.length} of {filteredItems.length} products
                        </p>
                    </div>

                    {/* Product Grid */}
                    <div className={`grid gap-6 mb-8 ${
                        role === USER_ROLES.ADMIN 
                            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                            : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                    }`}>
                        {paginatedItems.map((item) => (
                            <ProductCard
                                key={item.id}
                                item={item}
                                role={role}
                                onItemClick={handleItemClick}
                                onAddToCart={addToCart}
                                onEdit={(item) => { setEditItemData(item); setOpenEditDialog(true); }}
                                onDelete={handleDeleteItem}
                                onToggleVisibility={handleToggleVisibility}
                            />
                        ))}
                    </div>

                    {/* No Results */}
                    {filteredItems.length === 0 && !isLoading && (
                        <div className="text-center py-12">
                            <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
                            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
                        </div>
                    )}

                    {/* Pagination */}
                    {filteredItems.length > 0 && (
                        <div className="flex justify-center">
                            <div className="bg-white rounded-xl shadow-lg p-4">
                                <Pagination
                                    count={totalPages}
                                    page={currentPage}
                                    onChange={handlePageChange}
                                    color="primary"
                                    size="large"
                                    showFirstButton
                                    showLastButton
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-200 mt-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="text-center">
                        <div className="flex items-center justify-center space-x-3 mb-4">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-pink-500 rounded-lg flex items-center justify-center">
                                <img src="/favicon.ico" alt="HF Choice" className="w-5 h-5" />
                            </div>
                            <span className="text-lg font-bold gradient-text">HF Choice</span>
                        </div>
                      
                        <p className="text-gray-500 text-sm">
                            &copy; {new Date().getFullYear()} HF Choice. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>

            {/* Modals and Dialogs */}
            {role === USER_ROLES.ADMIN && (
                <>
                    <AddNewItemDialog 
                        open={openAddDialog} 
                        onClose={() => setOpenAddDialog(false)} 
                        onAddItem={handleAddItem} 
                        userRole={role} 
                    />
                    <EditItemDialog 
                        open={openEditDialog} 
                        onClose={() => setOpenEditDialog(false)} 
                        editItemData={editItemData} 
                        onEditItem={handleEditItem} 
                        handleEditChange={handleEditChange} 
                        userRole={role} 
                    />
                </>
            )}
            
            {/* Item Detail Modal - Available for all users */}
            <ItemDetailModal
                isOpen={isItemModalOpen}
                onClose={() => setIsItemModalOpen(false)}
                item={selectedItem}
            />
            
            {/* Cart Modal - Only for non-admin users */}
            {role !== USER_ROLES.ADMIN && (
                <CartModal
                    isOpen={isCartModalOpen}
                    onClose={() => setIsCartModalOpen(false)}
                    cart={cart}
                    onUpdateQuantity={updateCartQuantity}
                    onRemoveItem={removeFromCart}
                    handleCheckout={handleCheckout}
                />
            )}

            {/* Snackbar */}
            <Snackbar 
                open={snackbarOpen} 
                autoHideDuration={4000} 
                onClose={() => setSnackbarOpen(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <MuiAlert 
                    elevation={6} 
                    variant="filled" 
                    onClose={() => setSnackbarOpen(false)} 
                    severity="success"
                    className="shadow-xl"
                >
                    {snackbarMessage}
                </MuiAlert>
            </Snackbar>
        </div>
    );
};

export default Dashboard;