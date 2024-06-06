import React, { useEffect, useState } from 'react';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/router';
import { auth } from '../firebase'; // Make sure you have configured Firebase correctly
import axios from 'axios'; // Axios for making API requests
import { Pagination } from '@mui/material';
import useAuth from '../hooks/useAuth'; // Assuming you have a useAuth hook
import ItemDetailModal from '../components/ItemDetailModal'; // Import the new modal component

const Dashboard = () => {
    const router = useRouter();
    const { user, role } = useAuth(); // Assuming useAuth provides user and role
    const [items, setItems] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(9);
    const [selectedItem, setSelectedItem] = useState(null); // State for selected item
    const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
    const itemsPerPageOptions = [9, 24, 49, 99];

    const signOutUser = () => {
        signOut(auth)
            .then(() => {
                console.log("User signed out.");
                router.push('/login'); // Redirect to login page after sign out
            })
            .catch((error) => {
                console.error("Error signing out: ", error);
            });
    };

    useEffect(() => {
        const fetchVisibleItems = async () => {
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/item/getVisibleItems`); // Fetch visible items from the backend
                setItems(response.data); // Set the items in the state
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
        setCurrentPage(1); // Reset to first page on items per page change
    };

    const handleItemClick = (item) => {
        setSelectedItem(item); // Set the selected item
        setIsModalOpen(true); // Open the modal
    };

    const filteredItems = items.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    const totalPages = Math.ceil(items.length / itemsPerPage);

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
                {filteredItems.map((item) => (
                    <div key={item.id} className="bg-white shadow-md rounded p-4 cursor-pointer" onClick={() => handleItemClick(item)}>
                        <div className="flex items-center mb-4">
                            <img src={item.picture} alt={item.codigo} className="w-16 h-16 rounded-full mr-4" />
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
            <ItemDetailModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                item={selectedItem}
            />
        </div>
    );
};

export default Dashboard;
