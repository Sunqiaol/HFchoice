import axios from 'axios';

// Cart service for managing cart operations
class CartService {
  constructor(user) {
    this.user = user;
  }

  async getAuthHeaders() {
    if (!this.user) {
      throw new Error('User not authenticated');
    }
    const token = await this.user.getIdToken();
    return {
      'Authorization': `Bearer ${token}`
    };
  }

  // Get all cart items
  async getCartItems() {
    try {
      const headers = await this.getAuthHeaders();
      const response = await axios.get('/api/cart', { headers });
      return response.data;
    } catch (error) {
      console.error('Error fetching cart:', error);
      throw error;
    }
  }

  // Get cart summary (total items, value)
  async getCartSummary() {
    try {
      const headers = await this.getAuthHeaders();
      const response = await axios.get('/api/cart?summary=true', { headers });
      return response.data;
    } catch (error) {
      console.error('Error fetching cart summary:', error);
      throw error;
    }
  }

  // Add item to cart
  async addItem(itemId, quantity = 1) {
    try {
      const headers = await this.getAuthHeaders();
      const response = await axios.post('/api/cart', {
        itemId,
        quantity
      }, { headers });
      return response.data;
    } catch (error) {
      console.error('Error adding item to cart:', error);
      throw error;
    }
  }

  // Update cart item quantity
  async updateQuantity(cartItemId, quantity) {
    try {
      const headers = await this.getAuthHeaders();
      const response = await axios.put('/api/cart', {
        cartItemId,
        quantity
      }, { headers });
      return response.data;
    } catch (error) {
      console.error('Error updating cart item:', error);
      throw error;
    }
  }

  // Remove item from cart
  async removeItem(cartItemId) {
    try {
      const headers = await this.getAuthHeaders();
      const response = await axios.delete('/api/cart', {
        headers,
        data: { cartItemId }
      });
      return response.data;
    } catch (error) {
      console.error('Error removing cart item:', error);
      throw error;
    }
  }

  // Clear entire cart
  async clearCart() {
    try {
      const headers = await this.getAuthHeaders();
      const response = await axios.delete('/api/cart', {
        headers,
        data: { action: 'clear' }
      });
      return response.data;
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error;
    }
  }

  // Convert database cart items to dashboard format
  static formatCartItemsForDashboard(dbCartItems) {
    return dbCartItems.map(cartItem => ({
      ...cartItem.itemSnapshot,
      quantity: cartItem.quantity,
      cartItemId: cartItem.id, // Keep reference to cart record
      cartId: `cart-${cartItem.id}`, // Create compatible cartId for existing UI
      addedAt: cartItem.addedAt
    }));
  }

  // Convert dashboard cart item to database format for adding
  static formatItemForDatabase(item, quantity = 1) {
    return {
      itemId: item.id,
      quantity
    };
  }
}

export default CartService;