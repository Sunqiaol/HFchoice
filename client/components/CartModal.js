import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

const CartModal = ({ isOpen, onClose, cart, handleCheckout }) => {
    return (
        <Dialog open={isOpen} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>Shopping Cart</DialogTitle>
            <DialogContent>
                {cart.length === 0 ? (
                    <p>Your cart is empty.</p>
                ) : (
                    <ul>
                        {cart.map((item, index) => (
                            <li key={index} className="mb-2">
                                {item.discripcion} - {item.codigo}
                            </li>
                        ))}
                    </ul>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">Close</Button>
                {cart.length > 0 && (
                    <Button onClick={handleCheckout} color="primary">Checkout</Button>
                )}
            </DialogActions>
        </Dialog>
    );
};

export default CartModal;
