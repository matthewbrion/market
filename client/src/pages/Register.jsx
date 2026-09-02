import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const { register } = useAuth();
    const navigate = useNavigate();

    async function handleSubmit(n) {
        n.preventDefault();
        setError(null);
        try {
            await register(username, password);
            navigate('/products');
        } catch (e) {
            setError(e.message);
        }
    }

    return (
        <div>
            <h1>Register</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Username
                    <input
                        type='text'
                        value={username}
                        onChange={(n) => setUsername(n.target.value)}
                        required
                    />
                </label>
                <label>
                    Password
                    <input
                        type='password'
                        value={password}
                        onChange={(n) => setPassword(n.target.value)}
                        required
                    />
                </label>
                <button type='submit'>Register</button>
            </form>
            {error && <p role='alert'>{error}</p>}
        </div>
    );
}