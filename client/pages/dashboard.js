import React, { useEffect, useState } from 'react';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/router';
import { auth } from '../firebase';
import axios from 'axios';
import { Pagination } from '@mui/material';
import useAuth from '../hooks/useAuth';
import ItemDetailModal from '../components/ItemDetailModal';
import CartModal from '../components/CartModal';

const Dashboard = () => {
    const router = useRouter();
    const { user, role } = useAuth();
    const [items, setItems] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(9);
    const [selectedItem, setSelectedItem] = useState(null);
    const [isItemModalOpen, setIsItemModalOpen] = useState(false);
    const [isCartModalOpen, setIsCartModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [cart, setCart] = useState([]);
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
        const fetchVisibleItems = async () => {
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/item/getVisibleItems`);
                setItems(response.data);
            } catch (error) {
                console.error('Error fetching items:', error);
            }
        };

        fetchVisibleItems();
    }, []);

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

    const filteredItems = items.filter(item =>
        item.discripcion.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.codigo.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const paginatedItems = filteredItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Welcome To HF</h1>
            {role === 'Admin' && (
                <button
                    onClick={() => router.push('/admin')}
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full shadow-md transition duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-opacity-50 mb-8 mr-3"
                >
                    Back to Admin
                </button>
            )}
            <button onClick={signOutUser} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full shadow-md transition duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-opacity-50 mb-8">
                Sign Out
            </button>
            <div className="mb-8 flex justify-between items-center">
                <input
                    type="text"
                    placeholder="Search"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="border rounded p-2 w-full mr-4"
                />
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
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {paginatedItems.map((item) => (
                    <div key={item.id} className="bg-white shadow-md rounded p-4 cursor-pointer" onClick={() => handleItemClick(item)}>
                        <div className="flex items-center mb-4">
                            <img src={getProxiedImageUrl(item.picture)} alt={item.codigo} className="w-16 h-16 rounded-full mr-4" />
                            <div>
                                <h2 className="text-xl font-bold">{item.discripcion}</h2>
                                <p className="text-gray-600">{item.codigo}</p>
                            </div>
                        </div>
                        <div>
                            <p className="text-gray-600">Model: {item.modelo}</p>
                            <p className="text-gray-600">Brand: {item.marca}</p>
                            <p className="text-gray-600">Group: {item.grupo}</p>
                            <p className="text-gray-600">Unit: {item.unidad}</p>
                            <p className="text-gray-600">Cost: {item.costo}</p>
                        </div>
                        <button
                            className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full shadow-md transition duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50"
                            onClick={(e) => {
                                e.stopPropagation();
                                addToCart(item);
                            }}
                        >
                            Add to Cart
                        </button>
                    </div>
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
            <div className="fixed bottom-8 right-8">
                <button
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full shadow-md transition duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-opacity-50"
                    onClick={() => setIsCartModalOpen(true)}
                >
                    View Cart ({cart.length})
                </button>
            </div>
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
        </div>
    );
};

export default Dashboard;
