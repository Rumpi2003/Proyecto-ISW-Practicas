import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom'; 
import { 
    getEstudiantes, deleteEstudiante,
    getEncargados, deleteEncargado,
    getSupervisores, deleteSupervisor
} from '@services/user.service';

import Swal from 'sweetalert2'; 

const UserList = () => {
    const navigate = useNavigate();
    const { tipo } = useParams(); // 'estudiante', 'encargado' o 'supervisor'
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const roleConfig = {
        estudiante: { 
            title: 'Estudiantes', 
            icon: '🎓',
            textColor: 'text-white',
            bgColor: 'bg-green-50', // Fondo suave
            borderColor: 'border-green-200',
            buttonColor: 'bg-green-600',
            buttonHover: 'hover:bg-green-700',
            tableHeader: 'bg-green-50 text-green-800'
        },
        encargado: { 
            title: 'Encargados', 
            icon: '🏫',
            textColor: 'text-white',
            bgColor: 'bg-purple-50',
            borderColor: 'border-purple-200',
            buttonColor: 'bg-purple-600',
            buttonHover: 'hover:bg-purple-700',
            tableHeader: 'bg-purple-50 text-purple-800'
        },
        supervisor: { 
            title: 'Supervisores', 
            icon: '💼',
            textColor: 'text-white',
            bgColor: 'bg-orange-50',
            borderColor: 'border-orange-200',
            buttonColor: 'bg-orange-600',
            buttonHover: 'hover:bg-orange-700',
            tableHeader: 'bg-orange-50 text-orange-800'
        }
    };

    const currentConfig = roleConfig[tipo] || roleConfig.estudiante;

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            try {
                let data = [];
                if (tipo === 'estudiante') {
                    const response = await getEstudiantes();
                    data = response.data || response;
                } else if (tipo === 'encargado') {
                    const response = await getEncargados();
                    data = response.data || response;
                } else if (tipo === 'supervisor') {
                    const response = await getSupervisores();
                    data = response.data || response;
                }
                
                setUsers(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error(error);
                setUsers([]);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, [tipo]);

    const handleEliminar = async (id) => {
        const result = await Swal.fire({
            title: '¿Eliminar usuario?',
            text: "No podrás revertir esto.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            try {
                if (tipo === 'estudiante') await deleteEstudiante(id);
                else if (tipo === 'encargado') await deleteEncargado(id);
                else if (tipo === 'supervisor') await deleteSupervisor(id);

                setUsers(prev => prev.filter(user => user.id !== id));
                Swal.fire('Eliminado', 'Usuario eliminado.', 'success');
            } catch (error) {
                console.error(error);
                Swal.fire('Error', 'No se pudo eliminar.', 'error');
            }
        }
    };

    return (
        <div className="min-h-screen p-8 font-sans">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => navigate('/dashboard/users')} 
                        className="bg-white border border-gray-300 px-4 py-2 rounded-xl font-bold hover:bg-gray-50 transition-colors shadow-sm text-gray-700"
                    >
                        ← Volver
                    </button>
                    <div>
                        {/* Usamos las clases directas del objeto de configuración */}
                        <h1 className={`text-3xl font-extrabold flex items-center gap-2 ${currentConfig.textColor}`}>
                            {currentConfig.icon} {currentConfig.title}
                        </h1>
                    </div>
                </div>
                
                <button
                    onClick={() => navigate('/dashboard/users/create', { state: { initialRole: tipo } })}
                    className={`${currentConfig.buttonColor} ${currentConfig.buttonHover} text-white px-6 py-3 rounded-xl font-bold shadow-lg transition-transform transform hover:scale-105 flex items-center gap-2`}
                >
                    <span>+</span> Nuevo {currentConfig.title.slice(0, -1)}
                </button>
            </div>

            <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            {/* Header de la tabla con color dinámico corregido */}
                            <tr className={`${currentConfig.tableHeader} text-sm uppercase tracking-wider`}>
                                <th className="p-4 font-bold border-b border-gray-200">Nombre</th>
                                <th className="p-4 font-bold border-b border-gray-200">RUT</th>
                                <th className="p-4 font-bold border-b border-gray-200">Correo</th>
                                {tipo === 'estudiante' && <th className="p-4 font-bold border-b border-gray-200">Carrera</th>}
                                {tipo === 'encargado' && <th className="p-4 font-bold border-b border-gray-200">Facultad</th>}
                                {tipo === 'supervisor' && <th className="p-4 font-bold border-b border-gray-200">Empresa</th>}
                                <th className="p-4 font-bold border-b border-gray-200 text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-gray-700">
                            {users.length > 0 ? (
                                users.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="p-4 font-medium capitalize text-gray-800">{user.nombre}</td>
                                        <td className="p-4 text-gray-500">{user.rut}</td>
                                        <td className="p-4 text-gray-500">{user.email}</td>
                                        
                                        {/* Manejo seguro de objetos vs strings */}
                                        {tipo === 'estudiante' && (
                                            <td className="p-4">
                                                <span className="bg-green-50 text-green-700 px-2 py-1 rounded-lg text-xs font-bold border border-green-100">
                                                    {user.carrera?.nombre || user.carrera || '-'}
                                                </span>
                                            </td>
                                        )}
                                        {tipo === 'encargado' && (
                                            <td className="p-4">
                                                <span className="bg-purple-50 text-purple-700 px-2 py-1 rounded-lg text-xs font-bold border border-purple-100">
                                                    {user.facultad?.nombre || user.facultad || '-'}
                                                </span>
                                            </td>
                                        )}
                                        {tipo === 'supervisor' && (
                                            <td className="p-4">
                                                <span className="bg-orange-50 text-orange-700 px-2 py-1 rounded-lg text-xs font-bold border border-orange-100">
                                                    {user.empresa || '-'}
                                                </span>
                                            </td>
                                        )}

                                        <td className="p-4 text-center">
                                            <button 
                                                onClick={() => handleEliminar(user.id)} 
                                                className="bg-red-50 text-red-600 p-2 rounded-lg hover:bg-red-600 hover:text-white transition-all shadow-sm border border-red-100"
                                                title="Eliminar usuario"
                                            >
                                                🗑️
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="p-12 text-center text-gray-400 flex-col items-center">
                                        <div className="text-4xl mb-2">📭</div>
                                        <p>{loading ? 'Cargando datos...' : 'No se encontraron usuarios registrados.'}</p>
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

export default UserList;