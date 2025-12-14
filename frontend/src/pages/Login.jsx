import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '@services/auth.service.js'; 
import { useAuth } from '@context/AuthContext';
import { jwtDecode } from 'jwt-decode';
import Swal from 'sweetalert2'; 

const Login = () => {
    const navigate = useNavigate();
    const { setUser } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await login({ email, password });

            if (response.status !== 'Success' && response.status !== 200) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error de acceso',
                    text: response.message || 'Credenciales incorrectas',
                    confirmButtonColor: '#3b82f6'
                });
                return;
            }

            const { token, user } = response.data;
            const decoded = jwtDecode(token);
            const userRol = decoded.rol || decoded.role;
            const userCompleto = {
                ...user,
                rol: userRol
            };
            setUser(userCompleto);

            Swal.fire({
                icon: 'success',
                title: `¡Bienvenido ${user.nombre || ''}!`,
                text: 'Has iniciado sesión exitosamente.',
                timer: 1500,
                showConfirmButton: false
            });

            if (userRol === 'encargado') {
                navigate('/dashboard');
            } else if (userRol === 'estudiante') {
                navigate('/home');
            } else {
                navigate('/home');
            }

        } catch (error) {
            console.error(error);
            Swal.fire({
                icon: 'error',
                title: 'Error de Servidor',
                text: 'No se pudo conectar al servidor.',
            });
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-6 transform transition-all hover:scale-[1.01]">
                
                {/* ZONA DEL ENCABEZADO */}
                <div className="text-center mb-4">
                    {/* LOGO DE LA UNIVERSIDAD */}
                    <img 
                        src="/logo_universidad.png" 
                        alt="Logo UBB" 
                        className="h-16 mx-auto mb-2 object-contain" 
                    />
                    
                    <h1 className="text-2xl font-extrabold text-gray-800 mb-1">
                        Iniciar Sesión
                    </h1>
                    <p className="text-gray-400 font-medium text-xs">
                        Portal de Prácticas
                    </p>
                </div>

                <form className="space-y-3" onSubmit={handleSubmit}>
                    
                    <div className="space-y-1">
                        <label htmlFor="email" className="block text-xs font-bold text-gray-700 ml-1">
                            Correo Institucional
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="contacto@institución.cl"
                            required
                            className="w-full px-4 py-2 rounded-lg bg-gray-50 border border-gray-200 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all duration-200 text-sm"
                        />
                    </div>

                    <div className="space-y-1">
                        <label htmlFor="password" className="block text-xs font-bold text-gray-700 ml-1">
                            Contraseña
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                            className="w-full px-4 py-2 rounded-lg bg-gray-50 border border-gray-200 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all duration-200 text-sm"
                        />
                    </div>

                    <div className="flex justify-center pt-3">
                        <button 
                            type="submit" 
                            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-2.5 px-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95 text-sm"
                        >
                            Ingresar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login;