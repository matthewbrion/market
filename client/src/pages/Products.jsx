import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import request from '../api/client';

export default function Products() {
    const [products, setProducts] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        request('/products')
        .then(setProducts)
        .catch((e) => setError(e.message))
        .finally(() => setLoading(false));
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p role='alert'>{error}</p>;

    return (
    <div>
        <h1>Products</h1>
        <div className='product-grid'>
            {products.map((product) => (
                <Link key={product.id} to={`/products/${product.id}`}>
                    <div className='product-card'>
                        <h3>{product.title}</h3>
                        <p>${Number(product.price).toFixed(2)}</p>
                    </div>
                </Link>
            ))}
        </div>
    </div>
    );
}