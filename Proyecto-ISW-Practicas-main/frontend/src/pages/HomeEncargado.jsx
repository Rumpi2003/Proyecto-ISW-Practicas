import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../services/auth.service';
import { getSolicitudes } from '../services/solicitud.service';

const HomeEncargado = () => {
    const navigate = useNavigate();
    const [pendientes, setPendientes] = useState(0);
    const user = JSON.parse(sessionStorage.getItem('usuario') || '{}');

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            {/* Aquí irá el contenido en los siguientes commits */}
        </div>
    );
};

export default HomeEncargado;