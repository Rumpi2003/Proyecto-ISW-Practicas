import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../services/auth.service';
import { getSolicitudes } from '../services/solicitud.service';

const HomeEncargado = () => {
    const navigate = useNavigate();
    const [pendientes, setPendientes] = useState(0);
    const user = JSON.parse(sessionStorage.getItem('usuario') || '{}');

    useEffect(() => {
        const fetchContador = async () => {
            try {
                const response = await getSolicitudes();
                const soloPendientes = response.data.filter(s => s.estado === 'espera');
                setPendientes(soloPendientes.length);
            } catch (error) {
                console.error("Error al cargar contador:", error);
            }
        };
        fetchContador();
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <header className="flex justify-between items-center mb-10 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Portal del Encargado</h1>
                    <p className="text-gray-500 font-medium">Bienvenido, {user.nombre || "Usuario"}</p>
                </div>
                <button onClick={handleLogout} className="bg-red-50 text-red-600 px-6 py-2 rounded-xl font-bold hover:bg-red-200 transition-all text-sm">
                    Cerrar Sesión
                </button>
            </header>
        </div>
    );
};

export default HomeEncargado;