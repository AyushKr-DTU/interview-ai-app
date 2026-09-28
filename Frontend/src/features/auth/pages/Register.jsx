import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { useAuth } from '../hooks/useAuth';
import '../auth.form.scss';
import LoadingScreen from '../../../components/LoadingScreen';
import BrandLogo from '../../../components/BrandLogo';

const Register = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { loading, handleRegister } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const success = await handleRegister({ username, email, password });
        if (success) {
            navigate('/app');
        } else {
            setError('Registration failed. Username or email may already be taken.');
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
                <h1>Create account</h1>
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="username">Username</label>
                        <input
                            onChange={(e) => setUsername(e.target.value)}
                            type="text"
                            id="username"
                            name="username"
                            placeholder="Choose a username"
                            required
                            value={username}
                        />
                    </div>
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
                            placeholder="Create a password"
                            required
                            value={password}
                        />
                    </div>
                    {error && <p style={{ color: '#dc2626', margin: 0, textAlign: 'left', fontSize: '0.8rem' }}>{error}</p>}
                    <button type="submit" className="button primary-button">Create account</button>
                </form>
                <p>
                    Already have an account? <Link to="/login">Log in</Link>
                </p>
                <p>
                    <Link to="/">Back to home</Link>
                </p>
            </div>
        </main>
    );
};

export default Register;
