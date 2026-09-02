import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import request from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function Orders() {
    const { token } = useAuth();
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        request('/orders', { token })
        .then(setOrders)
        .catch((e) => setError(e.message))
        .finally(() => setLoading(false));
    }, [token]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p role='alert'>{error}</p>;
    if (orders.length === 0) return <p>No orders yet.</p>;

    return (
        <div>
            <h1>My Orders</h1>
            <ul>
                {orders.map((order) => (
                    <li key={order.id}>
                        <Link to={`/orders/${order.id}`}>
                        Order #{order.id} - {order.date}
                        {order.note && ` (${order.note})`}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}