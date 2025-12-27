import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/auth.service';

const Login = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState(''); // Estado para mensajes de error en pantalla

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (errorMsg) setErrorMsg(''); // Limpia el error mientras el usuario escribe
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg('');

        try {
            const response = await login(formData);

            if (response) {
                // Obtenemos el usuario guardado para saber su rol
                const user = JSON.parse(sessionStorage.getItem('usuario'));
                
                // Redirección basada en Rol
                if (user?.rol === 'encargado' || user?.rol === 'admin') {
                    navigate('/home');
                } else {
                    navigate('/dashboard');
                }
            }
        } catch (error) {
            console.error("Error en login:", error);
            setErrorMsg(error.message || 'Credenciales inválidas. Intente nuevamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-blue-600 p-6">
            <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-black text-gray-800 tracking-normal">Portal de Prácticas</h1>
                    <p className="text-gray-400 mt-2 font-medium">Inicia sesión para continuar</p>
                </div>

                {errorMsg && (
                    <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm font-medium animate-pulse">
                        {errorMsg}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-gray-700 text-xs uppercase tracking-wide font-black mb-3">Correo Electrónico</label>
                        <input
                            name="email"
                            type="email"
                            onChange={handleChange}
                            className="w-full p-4 border-2 border-gray-100 rounded-2xl bg-gray-50 focus:border-blue-500 focus:bg-white transition-all outline-none"
                            placeholder="nombre@ejemplo.com"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 text-xs uppercase tracking-wide font-black mb-3">Contraseña</label>
                        <input
                            name="password"
                            type="password"
                            onChange={handleChange}
                            className="w-full p-4 border-2 border-gray-100 rounded-2xl bg-gray-50 focus:border-blue-500 focus:bg-white transition-all outline-none"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-4 text-white font-black rounded-2xl transition-all shadow-xl uppercase tracking-wide text-sm
                            ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 active:scale-95'}`}
                    >
                        {loading ? 'Validando...' : 'Entrar al sistema'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;