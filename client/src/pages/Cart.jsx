import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function Cart() {
    const { items, updateQuantity, removeItem } = useCart();
    const navigate = useNavigate();

    const total = items.reduce(
        (sum, item) => sum + Number(item.price) * item.quantity,
        0
    );

    if (items.length === 0) {
        return (
            <div>
                <h1>Cart</h1>
                <p>Your cart is empty.</p>
                <Link to='/products'>Browse products</Link>
            </div>
        );
    }

    return (
        <div>
            <h1>Cart</h1>
            <ul>
                {items.map((item) => (
                    <li key={item.productId}>
                        <span>{item.title}</span>
                        <span> - ${Number(item.price).toFixed(2)} each</span>
                        <label>
                            Qty
                            <input
                            type='number'
                            min='1'
                            value={item.quantity}
                            onChange={(e) =>
                                updateQuantity(item.productId, Number(e.target.value))
                            }
                            />
                        </label>
                        <button onClick={() => removeItem(item.productId)}>Remove</button>
                    </li>
                ))}
            </ul>
            <p>Total: ${total.toFixed(2)}</p>
            <button onClick={() => navigate('/checkout')}>Proceed to Checkout</button>
        </div>
    );
}