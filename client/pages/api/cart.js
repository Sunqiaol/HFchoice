import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:8080';

export default async function handler(req, res) {
  const { method } = req;
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ error: 'Authorization header required' });
  }

  const config = {
    headers: {
      'Authorization': authorization,
      'Content-Type': 'application/json'
    }
  };

  try {
    switch (method) {
      case 'GET':
        // Get cart items or summary
        const endpoint = req.query.summary === 'true' ? '/summary' : '';
        const cartResponse = await axios.get(`${API_BASE_URL}/api/cart${endpoint}`, config);
        return res.status(200).json(cartResponse.data);

      case 'POST':
        // Add item to cart
        const addResponse = await axios.post(`${API_BASE_URL}/api/cart/add`, req.body, config);
        return res.status(addResponse.status).json(addResponse.data);

      case 'PUT':
        // Update cart item
        const { cartItemId } = req.body;
        if (!cartItemId) {
          return res.status(400).json({ error: 'Cart item ID is required for updates' });
        }
        const updateResponse = await axios.put(`${API_BASE_URL}/api/cart/update/${cartItemId}`, req.body, config);
        return res.status(200).json(updateResponse.data);

      case 'DELETE':
        // Remove item or clear cart
        const { cartItemId: removeId, action } = req.body;
        let deleteEndpoint = '';
        
        if (action === 'clear') {
          deleteEndpoint = '/clear';
        } else if (removeId) {
          deleteEndpoint = `/remove/${removeId}`;
        } else {
          return res.status(400).json({ error: 'Either cartItemId or action=clear is required' });
        }

        const deleteResponse = await axios.delete(`${API_BASE_URL}/api/cart${deleteEndpoint}`, config);
        return res.status(200).json(deleteResponse.data);

      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Cart API Error:', error.response?.data || error.message);
    return res.status(error.response?.status || 500).json({
      error: error.response?.data?.error || 'Internal server error'
    });
  }
}