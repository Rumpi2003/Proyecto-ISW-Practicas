import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createSupervisor, createEncargado } from '../services/user.service';

const CreateUser = () => {
    const navigate = useNavigate();
    
    // Por defecto, ahora creamos Supervisores (tu tarea principal)
    const [rol, setRol] = useState('supervisor');

    const [formData, setFormData] = useState({
        nombre: '',
        rut: '',
        email: '',
        password: '',
        empresa: '',       
        facultad: ''       
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // --- FORMATEO RUT ---
    const handleRutChange = (e) => {
        let value = e.target.value.replace(/[^0-9kK]/g, ""); 
        if (value.length > 1) {
            const body = value.slice(0, -1);
            const dv = value.slice(-1).toUpperCase();
            const bodyFormatted = body.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
            value = `${bodyFormatted}-${dv}`;
        } else {
            value = value.toUpperCase();
        }
        setFormData({ ...formData, rut: value });
    };

    const normalizeString = (str) => {
        return str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    };

    // --- VALIDACIONES ---
    const validarRutChileno = (rutCompleto) => {
        const rutLimpio = rutCompleto.replace(/[.-]/g, "").toUpperCase();
        if (rutLimpio.length < 7) return false;
        
        const cuerpo = rutLimpio.slice(0, -1); 
        const dv = rutLimpio.slice(-1);       

        if (!/^[0-9]+$/.test(cuerpo)) return false;
        if (!/^[0-9K]$/.test(dv)) return false;

        let suma = 0;
        let multiplo = 2;
        for (let i = cuerpo.length - 1; i >= 0; i--) {
            suma += multiplo * parseInt(cuerpo.charAt(i));
            multiplo = (multiplo < 7) ? multiplo + 1 : 2;
        }
        const dvEsperado = 11 - (suma % 11);
        let dvCalculado = (dvEsperado === 11) ? '0' : (dvEsperado === 10) ? 'K' : dvEsperado.toString();

        return dv === dvCalculado;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validarRutChileno(formData.rut)) {
            alert("RUT INVÁLIDO:\n- Revise el dígito verificador.");
            return;
        }

        const pwd = formData.password;
        if (pwd.length < 6) {
            alert("CONTRASEÑA MUY CORTA:\nMínimo 6 caracteres.");
            return;
        }

        // Validación estricta de contraseña
        const passwordRegex = /^(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{6,8}$/;
        if (!passwordRegex.test(pwd)) {
            alert("CONTRASEÑA INVÁLIDA:\n- Entre 6 y 8 caracteres.\n- Al menos 1 Mayúscula.\n- Al menos 1 Símbolo.");
            return;
        }

        // Validación básica de nombre
        const nombreParts = normalizeString(formData.nombre).trim().split(/\s+/);
        if (nombreParts.length < 2) {
            alert("Por favor escriba el Nombre Completo.");
            return;
        }

        // ENVÍO AL BACKEND
        try {
            if (rol === 'supervisor') {
                await createSupervisor(formData);
            } else if (rol === 'encargado') {
                await createEncargado(formData);
            }
            
            alert(`¡${rol.toUpperCase()} creado con éxito!`);
            navigate('/dashboard/users');
            
        } catch (error) {
            console.error(error);
            const msg = error.message || error.details || "Error desconocido";
            alert('Error al crear: ' + msg);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-lg border border-gray-100">
                
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Crear Usuario Administrativo</h2>
                    <button onClick={() => navigate('/dashboard/users')} className="text-gray-400 hover:text-gray-600 font-bold text-xl">✕</button>
                </div>

                <div className="mb-6 bg-blue-50 p-4 rounded-xl border border-blue-100">
                    <label className="block text-blue-800 font-bold mb-2 text-sm">Rol a crear:</label>
                    <select 
                        value={rol}
                        onChange={(e) => setRol(e.target.value)}
                        className="w-full p-2 border-none bg-white rounded-lg text-gray-700 shadow-sm focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="supervisor">Supervisor (Empresa)</option>
                        <option value="encargado">Encargado (Profesor)</option>
                    </select>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-600 text-sm font-semibold mb-1">Nombre Completo</label>
                        <input name="nombre" placeholder="Ej: Juan Pérez" type="text" onChange={handleChange} required className="w-full p-3 border rounded-lg focus:outline-none focus:border-blue-500" />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-600 text-sm font-semibold mb-1">RUT</label>
                            <input name="rut" placeholder="12.345.678-9" value={formData.rut} onChange={handleRutChange} maxLength={12} required className="w-full p-3 border rounded-lg focus:outline-none focus:border-blue-500" />
                        </div>
                        <div>
                            <label className="block text-gray-600 text-sm font-semibold mb-1">Contraseña</label>
                            <input 
                                name="password" 
                                type="password" 
                                placeholder="6-8 chars"
                                onChange={handleChange} 
                                maxLength={8} 
                                required 
                                className="w-full p-3 border rounded-lg focus:outline-none focus:border-blue-500" 
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-gray-600 text-sm font-semibold mb-1">Correo Electrónico</label>
                        <input 
                            name="email" 
                            type="email" 
                            placeholder={rol === 'supervisor' ? "contacto@empresa.com" : "profesor@ubiobio.cl"} 
                            onChange={handleChange} 
                            required 
                            className="w-full p-3 border rounded-lg focus:outline-none focus:border-blue-500" 
                        />
                    </div>

                    {/* CAMPOS ESPECÍFICOS SEGÚN ROL */}

                    {rol === 'supervisor' && (
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 animate-fade-in">
                            <label className="block text-blue-800 text-sm font-bold mb-1">Empresa</label>
                            <input name="empresa" placeholder="Nombre de la Empresa" onChange={handleChange} required className="w-full p-2 border-none bg-white rounded-lg text-gray-700 shadow-sm focus:ring-2 focus:ring-blue-500" />
                        </div>
                    )}

                    {rol === 'encargado' && (
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 animate-fade-in">
                            <label className="block text-blue-800 text-sm font-bold mb-1">Facultad</label>
                            <input name="facultad" placeholder="Nombre Facultad" onChange={handleChange} required className="w-full p-2 border-none bg-white rounded-lg text-gray-700 shadow-sm focus:ring-2 focus:ring-blue-500" />
                        </div>
                    )}

                    <button type="submit" className="w-full mt-6 py-3.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-lg transition-all transform hover:scale-[1.02]">
                        Crear {rol === 'supervisor' ? 'Supervisor' : 'Encargado'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateUser;