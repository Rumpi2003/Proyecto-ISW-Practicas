import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createSupervisor, createEncargado } from '../services/user.service';

const CreateUser = () => {
    const navigate = useNavigate();
    
    // Estado inicial para el rol y formulario
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

    // Formateo automático de RUT (12.345.678-9)
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

    // Algoritmo de validación Módulo 11 (RUT Chileno)
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
            alert("RUT Inválido: Verifique el dígito verificador.");
            return;
        }

        const pwd = formData.password;
        if (pwd.length < 6) {
            alert("Contraseña demasiado corta (Mínimo 6 caracteres).");
            return;
        }

        // Validación de complejidad de contraseña
        const passwordRegex = /^(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{6,8}$/;
        if (!passwordRegex.test(pwd)) {
            alert("La contraseña debe tener entre 6 y 8 caracteres, incluir una mayúscula y un símbolo.");
            return;
        }

        const nombreParts = normalizeString(formData.nombre).trim().split(/\s+/);
        if (nombreParts.length < 2) {
            alert("Por favor ingrese su nombre y apellido.");
            return;
        }

        try {
            if (rol === 'supervisor') {
                await createSupervisor(formData);
            } else if (rol === 'encargado') {
                await createEncargado(formData);
            }
            
            alert(`Usuario ${rol.toUpperCase()} creado exitosamente.`);
            navigate('/dashboard/users');
            
        } catch (error) {
            console.error(error);
            const msg = error.message || error.details || "Error desconocido";
            alert('Error al crear usuario: ' + msg);
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
                    <label className="block text-blue-800 font-bold mb-2 text-sm">Tipo de Usuario:</label>
                    <select 
                        value={rol}
                        onChange={(e) => setRol(e.target.value)}
                        className="w-full p-2 border-none bg-white rounded-lg text-gray-700 shadow-sm focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="supervisor">Supervisor (Empresa)</option>
                        <option value="encargado">Encargado (Facultad)</option>
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
                                placeholder="6-8 caracteres"
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