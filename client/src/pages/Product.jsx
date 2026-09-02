import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import request from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Product() {
    const { id } = useParams();
    const { token } = useAuth();
    const { addItem } = useCart();

    const [product, setProduct] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    const [orders, setOrders] = useState([]);
    const [ordersError, setOrdersError] = useState(null);

    useEffect(() => {
        request(`/products/${id}`)
            .then(setProduct)
            .catch((e) => setError(e.message))
            .finally(() => setLoading(false));
    }, [id]);

    useEffect(() => {
        if (!token) return;
        request(`/products/${id}/orders`, { token })
            .then(setOrders)
            .catch((e) => setOrdersError(e.message));
    }, [id, token]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p role='alert'>{error}</p>

    return (
        <div>
            <h1>{product.title}</h1>
            <p>{product.description}</p>
            <p>${Number(product.price).toFixed(2)}</p>

            <button onClick={() => addItem({ productId: product.id, title: product.title, price: product.price })}>
                Add to Cart
            </button>
            {token && (
                <div>
                    <h2>{product.title} is on the the following orders</h2>
                    {ordersError && <p role='alert'>{ordersError}</p>}
                    {!ordersError && orders.length === 0 && <p>None yet. Please click 'Add to cart' to add this product to an order.</p>}
                    <ul>
                        {orders.map((order) => (
                            <li key={order.id}>
                                Order #{order.id} - {order.date}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}