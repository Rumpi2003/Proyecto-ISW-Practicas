import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { createSupervisor, createEncargado, createEstudiante } from '@services/user.service';
import Swal from 'sweetalert2';

const CreateUser = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const isLocked = !!location.state?.initialRole;
    
    const [rol, setRol] = useState('estudiante');
    const [formData, setFormData] = useState({
        nombre: '', rut: '', email: '', password: '',
        empresa: '', facultad: '', carrera: '', nivelPractica: ''
    });

    useEffect(() => {
        if (location.state?.initialRole) {
            setRol(location.state.initialRole);
        }
    }, [location]);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (rol === 'supervisor') await createSupervisor(formData);
            else if (rol === 'encargado') await createEncargado(formData);
            else if (rol === 'estudiante') await createEstudiante(formData);
            
            Swal.fire('Éxito', 'Usuario creado', 'success');
            navigate(`/dashboard/users/${rol}`);
        } catch (error) {
            Swal.fire('Error', error.message || 'Error al crear', 'error');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-lg">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Crear {rol.charAt(0).toUpperCase() + rol.slice(1)}</h2>
                    <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-gray-600 font-bold text-xl">✕</button>
                </div>

                <div className="mb-4 bg-blue-50 p-3 rounded-lg">
                    <label className="text-sm font-bold text-blue-800">Rol seleccionado:</label>
                    <select 
                        value={rol} 
                        onChange={(e) => setRol(e.target.value)} 
                        className={`w-full p-2 rounded mt-1 ${isLocked ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'bg-white'}`}
                        disabled={isLocked} 
                    >
                        <option value="estudiante">Estudiante</option>
                        <option value="encargado">Encargado</option>
                        <option value="supervisor">Supervisor</option>
                    </select>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input name="nombre" placeholder="Nombre Completo" onChange={handleChange} required className="w-full p-3 border rounded-lg" />
                    <div className="grid grid-cols-2 gap-4">
                        <input name="rut" placeholder="RUT" onChange={handleChange} required className="w-full p-3 border rounded-lg" />
                        <input name="password" type="password" placeholder="Contraseña" onChange={handleChange} required className="w-full p-3 border rounded-lg" />
                    </div>
                    <input name="email" type="email" placeholder="Correo" onChange={handleChange} required className="w-full p-3 border rounded-lg" />

                    {rol === 'supervisor' && <input name="empresa" placeholder="Empresa" onChange={handleChange} className="w-full p-3 border rounded-lg bg-orange-50" />}
                    {rol === 'encargado' && <input name="facultad" placeholder="Facultad" onChange={handleChange} className="w-full p-3 border rounded-lg bg-purple-50" />}
                    {rol === 'estudiante' && (
                        <div className="bg-green-50 p-3 rounded-lg space-y-3">
                            <input name="carrera" placeholder="Carrera" onChange={handleChange} className="w-full p-3 border rounded-lg" />
                            <select name="nivelPractica" onChange={handleChange} className="w-full p-3 border rounded-lg bg-white">
                                <option value="">Nivel Práctica...</option>
                                <option value="I">I</option>
                                <option value="II">II</option>
                            </select>
                        </div>
                    )}

                    <button type="submit" className="w-full mt-4 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700">Guardar</button>
                </form>
            </div>
        </div>
    );
};

export default CreateUser;