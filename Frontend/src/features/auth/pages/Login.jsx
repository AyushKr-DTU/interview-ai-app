import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import '../auth.form.scss';
import { useAuth } from '../hooks/useAuth';
import LoadingScreen from '../../../components/LoadingScreen';
import BrandLogo from '../../../components/BrandLogo';

const Login = () => {
    const { loading, handleLogin } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const success = await handleLogin({ email, password });
        if (success) {
            navigate('/app');
        } else {
            setError('Invalid email or password. Please try again.');
        }
    };

    if (loading) {
        return (
            <LoadingScreen
                title="Just a moment"
                subtitle="Connecting to the server…"
            />
        );
    }

    return (
        <main className="auth-page">
            <div className="form-container">
                <BrandLogo className="auth-brand" to="/" />
                <h1>Log in</h1>
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="email">Email</label>
                        <input
                            onChange={(e) => setEmail(e.target.value)}
                            type="email"
                            id="email"
                            name="email"
                            placeholder="you@example.com"
                            required
                            value={email}
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input
                            onChange={(e) => setPassword(e.target.value)}
                            type="password"
                            id="password"
                            name="password"
                            placeholder="Enter password"
                            required
                            value={password}
                        />
                    </div>
                    {error && <p style={{ color: '#dc2626', margin: 0, textAlign: 'left', fontSize: '0.8rem' }}>{error}</p>}
                    <button type="submit" className="button primary-button">Continue</button>
                </form>
                <p>
                    Don&apos;t have an account? <Link to="/register">Register</Link>
                </p>
                <p>
                    <Link to="/">Back to home</Link>
                </p>
            </div>
        </main>
    );
};

export default Login;
