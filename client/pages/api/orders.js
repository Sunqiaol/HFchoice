import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:8080';

export default async function handler(req, res) {
  const { method } = req;
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ error: 'Authorization header required' });
  }

  try {
    const config = {
      headers: {
        'Authorization': authorization,
        'Content-Type': 'application/json'
      }
    };

    switch (method) {
      case 'GET':
        const ordersResponse = await axios.get(`${API_BASE_URL}/api/checkout/orders`, config);
        return res.status(200).json(ordersResponse.data);

      case 'PUT':
        const { orderId, status } = req.body;
        const updateResponse = await axios.put(
          `${API_BASE_URL}/api/checkout/orders/${orderId}/status`,
          { status },
          config
        );
        return res.status(200).json(updateResponse.data);

      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('API Error:', error.response?.data || error.message);
    return res.status(error.response?.status || 500).json({
      error: error.response?.data?.error || 'Internal server error'
    });
  }
}