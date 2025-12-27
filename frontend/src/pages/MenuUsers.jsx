import { useNavigate } from 'react-router-dom';

const UsersMenu = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-6xl min-h-[70vh] p-8 md:p-12 flex flex-col">
        
        <div className="flex items-center gap-4 mb-10 border-b border-gray-100 pb-6">
            <button 
                onClick={() => navigate('/dashboard')}
                className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-4 py-2 rounded-xl transition-all font-bold text-xl"
            >
                ←
            </button>
            <div>
                <h1 className="text-3xl font-extrabold text-gray-800">Gestión de Usuarios</h1>
                <p className="text-gray-500">Selecciona el rol que deseas administrar</p>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-4">
            {/* Tarjeta Estudiantes */}
            <div 
                onClick={() => navigate('/dashboard/users/estudiante')}
                className="group bg-green-50 border-2 border-green-100 rounded-2xl p-8 cursor-pointer hover:bg-green-600 hover:border-green-600 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">🎓</div>
                <h3 className="text-2xl font-bold text-gray-800 group-hover:text-white mb-2">Estudiantes</h3>
                <p className="text-gray-500 group-hover:text-green-100">Gestionar alumnos.</p>
            </div>

            {/* Tarjeta Encargados */}
            <div 
                onClick={() => navigate('/dashboard/users/encargado')}
                className="group bg-purple-50 border-2 border-purple-100 rounded-2xl p-8 cursor-pointer hover:bg-purple-600 hover:border-purple-600 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">🏫</div>
                <h3 className="text-2xl font-bold text-gray-800 group-hover:text-white mb-2">Encargados</h3>
                <p className="text-gray-500 group-hover:text-purple-100">Administrativos.</p>
            </div>

            {/* Tarjeta Supervisores */}
            <div 
                onClick={() => navigate('/dashboard/users/supervisor')}
                className="group bg-orange-50 border-2 border-orange-100 rounded-2xl p-8 cursor-pointer hover:bg-orange-600 hover:border-orange-600 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">💼</div>
                <h3 className="text-2xl font-bold text-gray-800 group-hover:text-white mb-2">Supervisores</h3>
                <p className="text-gray-500 group-hover:text-orange-100">Empresas.</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default UsersMenu;