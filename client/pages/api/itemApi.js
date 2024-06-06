// api/itemApi.js
const API_URL = `${process.env.NEXT_PUBLIC_SERVER_URL}/api/item`;// Adjust the URL as needed

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
    const response = await fetch(`${API_URL}/addItem`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
    });
    return response.json();
};

export const editItem = async (item) => {
    const response = await fetch(`${API_URL}/editItem`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
    });
    return response.json();
};

export const deleteItem = async (id) => {
    const response = await fetch(`${API_URL}/deleteItem`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
    });
    return response.json();
};

export const toggleVisibility = async (id) => {
    const response = await fetch(`${API_URL}/toggleVisibility`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
    });
    return response.json();
};