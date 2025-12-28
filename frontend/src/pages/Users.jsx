// frontend/src/pages/Users.jsx
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const Users = () => {
  const navigate = useNavigate();

  const handleAction = (action) => {
    Swal.fire({
      title: action,
      text: 'Funcionalidad en desarrollo.',
      icon: 'info',
      confirmButtonColor: '#3b82f6'
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-7xl min-h-[80vh] p-8 md:p-12 flex flex-col">
        
        {/* ENCABEZADO CON BOTÓN "VOLVER" */}
        <div className="flex items-center gap-4 mb-10 border-b border-gray-100 pb-6">
            <button 
                onClick={() => navigate('/dashboard')}
                className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-4 py-2 rounded-xl transition-all font-bold text-xl"
            >
                ←
            </button>
            <div>
                <h1 className="text-3xl font-extrabold text-gray-800">
                    Administración de Usuarios
                </h1>
                <p className="text-gray-500">
                    Selecciona una acción para gestionar el sistema
                </p>
            </div>
        </div>

        {/* GRID DE BOTONES ESPECÍFICOS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-4">
            
            {/* 1. CREAR */}
            <div 
                onClick={() => handleAction('Crear Usuario')}
                className="group bg-blue-50 border-2 border-blue-100 rounded-2xl p-8 cursor-pointer hover:bg-blue-600 hover:border-blue-600 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    ➕
                </div>
                <h3 className="text-2xl font-bold text-gray-800 group-hover:text-white mb-2">
                    Crear Usuario
                </h3>
                <p className="text-gray-500 group-hover:text-blue-100">
                    Registrar nuevos alumnos, encargados o supervisores.
                </p>
            </div>

            {/* 2. ACTUALIZAR */}
            <div 
                onClick={() => handleAction('Actualizar Usuario')}
                className="group bg-orange-50 border-2 border-orange-100 rounded-2xl p-8 cursor-pointer hover:bg-orange-500 hover:border-orange-500 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    🔄
                </div>
                <h3 className="text-2xl font-bold text-gray-800 group-hover:text-white mb-2">
                    Editar Datos
                </h3>
                <p className="text-gray-500 group-hover:text-orange-100">
                    Modificar información de usuarios existentes.
                </p>
            </div>

            {/* 3. ELIMINAR */}
            <div 
                onClick={() => handleAction('Eliminar Usuario')}
                className="group bg-red-50 border-2 border-red-100 rounded-2xl p-8 cursor-pointer hover:bg-red-500 hover:border-red-500 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    🗑️
                </div>
                <h3 className="text-2xl font-bold text-gray-800 group-hover:text-white mb-2">
                    Eliminar Usuario
                </h3>
                <p className="text-gray-500 group-hover:text-red-100">
                    Dar de baja cuentas del sistema.
                </p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Users;