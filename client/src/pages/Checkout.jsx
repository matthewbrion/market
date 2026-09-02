import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import request from '../api/client';

export default function Checkout() {
    const { items, clearCart } = useCart();
    const { token } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    async function handleCheckout() {
        setError(null);
        setSubmitting(true);
        let order;
        try {
            order = await request('/orders', {
                method: 'POST',
                token,
                body: { date: new Date().toISOString().split('T')[0] },
            });

            for (const item of items) {
                await request(`/orders/${order.id}/products`, {
                    method: 'POST',
                    token,
                    body: { productId: item.productId, quantity: item.quantity },
                });
            }

            clearCart();
            navigate(`/orders/${order.id}`);
        } catch (e) {
            if (order) {
                setError(
                     `Order #${order.id} was created, but we were unable to add the items: ${e.message}. Check 'My Orders' to see the current status of this order.`
                );
            } else {
                setError(e.message);
            }
        } finally {
            setSubmitting(false);
        }
    }

    if (items.length === 0) return <p>Your cart is empty.</p>;

    return (
        <div>
            <h1>Checkout</h1>
            <ul>
                {items.map((item) => (
                    <li key={item.productId}>
                        {item.title} x {item.quantity}
                    </li>
                ))}
            </ul>
            <button onClick={handleCheckout} disabled={submitting}>
                {submitting ? 'Placing order...' : 'Place Order'}
            </button>
            {error && <p role='alert'>{error}</p>}
        </div>
    );
}