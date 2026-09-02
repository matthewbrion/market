import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import request from "../api/client";
import { useAuth } from "../context/AuthContext";

export default function Order() {
    const { id } = useParams();
    const { token } = useAuth();

    const [order, setOrder] = useState(null);
    const [products, setProducts] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            request(`/orders/${id}`, { token }),
            request(`/orders/${id}/products`, { token }),
        ])
        .then(([orderData, productsData]) => {
            setOrder(orderData);
            setProducts(productsData);
        })
        .catch((e) => setError(e.message))
        .finally(() => setLoading(false));
    }, [id, token]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p role='alert'>{error}</p>;

    return (
        <div>
            <h1>Order #{order.id}</h1>
            <p>Date: {order.date}</p>
            {order.note && <p>Note: {order.note}</p>}
            <h2>Products</h2>
            <ul>
                {products.map((p) => {
                    <li key={p.product_id}>
                        Product #{p.product_id} - qty {p.quantity}
                    </li>
                })}
            </ul>
        </div>
    );
}