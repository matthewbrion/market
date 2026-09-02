import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

import Register from './pages/Register';
import Login from './pages/Login';
import Products from './pages/Products';
import Product from './pages/Product';
import Orders from './pages/Orders';
import Order from './pages/Order';
import Checkout from './pages/Checkout';

export default function App() {
  const { token, username, logout } = useAuth();

  return (
    <BrowserRouter>
      <nav>
        <Link to='/products'>Products</Link>
        {token ? (
          <>
            <Link to='/orders'>My Orders</Link>
            <span>{username}</span>
            <button onClick={logout}>Log out</button>
          </>
        ) : (
          <>
            <Link to='/login'>Log in</Link>
            <Link to='/register'>Register</Link>
          </>
        )}
      </nav>

      <main>
        <Routes>
          <Route path='/' element={<Products />} />
          <Route path='/register' element={<Register />} />
          <Route path='/login' element={<Login />} />
          <Route path='/products' element={<Products />} />
          <Route path='/products/:id' element={<Product />} />
          <Route path='/orders' element={<Orders />} />
          <Route path='/orders/:id' element={<Order />} />
          <Route path='/checkout' element={<Checkout />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}