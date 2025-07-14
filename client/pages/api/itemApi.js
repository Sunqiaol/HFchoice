// api/itemApi.js
import { getAuth } from 'firebase/auth';
import { app } from '../../firebase';

const API_URL = `${process.env.NEXT_PUBLIC_SERVER_URL}/api/item`;

// Helper function to get auth headers
const getAuthHeaders = async () => {
    const auth = getAuth(app);
    const user = auth.currentUser;
    const token = await user.getIdToken();
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
    };
};

export const getAllItems = async () => {
    const response = await fetch(`${API_URL}/getAllItems`);
    return response.json();
};

export const getItem = async (id) => {
    const response = await fetch(`${API_URL}/getItem`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
    });
    return response.json();
};

export const addItem = async (item) => {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/addItem`, {
        method: 'POST',
        headers,
        body: JSON.stringify(item),
    });
    return response.json();
};

export const editItem = async (item) => {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/editItem`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(item),
    });
    return response.json();
};

export const deleteItem = async (id) => {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/deleteItem`, {
        method: 'DELETE',
        headers,
        body: JSON.stringify({ id }),
    });
    return response.json();
};

export const toggleVisibility = async (id) => {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/toggleVisibility`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ id }),
    });
    return response.json();
};