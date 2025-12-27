import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUsers, deleteUser } from '../services/user.service';
import Swal from 'sweetalert2'; 

const Users = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);

    const handleEliminar = async (id) => {
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: "Esta acción eliminará al usuario permanentemente del sistema.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            try {
                await deleteUser(id); 
                
                // --- ACTUALIZACIÓN INSTANTÁNEA ---
                // Filtramos el estado local para quitar el usuario sin recargar la página
                setUsers(prevUsers => prevUsers.filter(user => user.id !== id));

                Swal.fire(
                    '¡Eliminado!',
                    'El usuario ha sido eliminado con éxito.',
                    'success'
                );
            } catch (error) {
                console.error("Error al eliminar:", error);
                Swal.fire(
                    'Error',
                    'No se pudo completar la acción.',
                    'error'
                );
            }
        }
    };

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await getUsers();
                setUsers(Array.isArray(response) ? response : response.data || []);
            } catch (error) {
                console.error("Error al cargar usuarios:", error);
            }
        };
        fetchUsers();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-6xl mx-auto flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Usuarios Registrados</h1>
                    <p className="text-gray-500">Gestión de Alumnos, Encargados y Supervisores</p>
                </div>
                <button
                    onClick={() => navigate('/dashboard/users/create')}
                    className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 shadow-lg transition-transform transform hover:scale-105 flex items-center gap-2"
                >
                    <span>+</span> Crear Nuevo Usuario
                </button>
            </div>

            <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-blue-50 text-blue-800 text-sm uppercase tracking-wider">
                                <th className="p-4 font-bold border-b">Nombre</th>
                                <th className="p-4 font-bold border-b">RUT</th>
                                <th className="p-4 font-bold border-b">Correo</th>
                                <th className="p-4 font-bold border-b">Rol</th>
                                <th className="p-4 font-bold border-b text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-gray-700">
                            {users.length > 0 ? (
                                users.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="p-4 font-medium capitalize">
                                            {user.nombre || user.nombreCompleto}
                                        </td>
                                        <td className="p-4 text-gray-500">{user.rut}</td>
                                        <td className="p-4 text-gray-500">{user.email}</td>
                                        <td className="p-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold border
                                                ${user.rol === 'estudiante' ? 'bg-green-100 text-green-700 border-green-200' : ''}
                                                ${user.rol === 'encargado' ? 'bg-purple-100 text-purple-700 border-purple-200' : ''}
                                                ${user.rol === 'supervisor' ? 'bg-orange-100 text-orange-700 border-orange-200' : ''}
                                            `}>
                                                {user.rol ? user.rol.toUpperCase() : 'USER'}
                                            </span>
                                        </td>
                                        <td className="p-4 text-center">
                                            <button 
                                                onClick={() => handleEliminar(user.id)}
                                                className="bg-red-50 text-red-600 p-2 rounded-lg hover:bg-red-600 hover:text-white transition-all shadow-sm"
                                                title="Eliminar Usuario"
                                            >
                                                🗑️
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center text-gray-400">
                                        Cargando usuarios...
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Users;