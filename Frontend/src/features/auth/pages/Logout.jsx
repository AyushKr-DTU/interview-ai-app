import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../hooks/useAuth';
import LoadingScreen from '../../../components/LoadingScreen';

const Logout = () => {
    const { handleLogout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const doLogout = async () => {
            await handleLogout();
            navigate('/login', { replace: true });
        };
        doLogout();
    }, []);

    return (
        <LoadingScreen
            title="Signing out"
            subtitle="See you next time…"
        />
    );
};

export default Logout;
