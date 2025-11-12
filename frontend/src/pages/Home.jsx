// frontend/src/pages/Home.jsx
import { useState } from 'react';
import { useAuth } from '@context/AuthContext';
import { logout } from '@services/auth.service';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const { user, setUser } = useAuth(); 
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);

  const handleGetProfile = async () => {
    console.log('Obtener perfil (aún no implementado)');
  };

  const handleLogout = () => {
    logout(); 
    setUser(null);
    navigate('/auth');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 w-full max-w-2xl transform transition-all hover:scale-105">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
          Página de Inicio
        </h1>
        
        <h2 className="text-2xl text-center text-gray-600 mb-8">
          ¡Bienvenido, <strong>{user?.email}</strong>!
        </h2>

        <button 
          onClick={handleGetProfile} 
          className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-purple-300"
        >
          Obtener Perfil
        </button>

        <button 
          onClick={handleLogout} 
          className="w-full mt-4 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-red-300"
        >
          Cerrar Sesión
        </button>

        {profileData && (
          <div className="mt-8 bg-gray-50 rounded-xl p-6 border border-gray-200">
            <pre className="text-sm text-gray-700 overflow-auto">{JSON.stringify(profileData, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;