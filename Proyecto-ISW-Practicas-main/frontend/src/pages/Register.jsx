import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from '../services/root.service.js';

const Register = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        nombre: '',
        rut: '',
        email: '',
        password: '',
        carrera: '',
        nivelPractica: 'I',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        const email = formData.email.toLowerCase();
        
        // --- VALIDACIONES ---
        
        // 0. Separamos las palabras
        const nombreParts = normalizeString(formData.nombre).trim().split(/\s+/);
        
        // Verificamos que al menos haya escrito Nombre y Primer Apellido
        if (nombreParts.length < 2) {
            alert("Por favor escribe tu Nombre y tus dos Apellidos.");
            return;
        }

        const primerNombre = nombreParts[0];   
        const primerApellido = nombreParts[1]; 
        // El segundo apellido (nombreParts[2]) se guarda pero no se usa para validar el email

        // 1. Dominio UBB
        if (!email.endsWith('@alumnos.ubiobio.cl')) {
            alert('Error: Debes usar tu correo institucional (@alumnos.ubiobio.cl)');
            return;
        }

        // 2. Coincidencia Nombre (Solo revisa Nombre + Primer Apellido)
        const expectedPrefix = `${primerNombre}.${primerApellido}`;
        if (!email.startsWith(expectedPrefix)) {
            alert(`Error: El correo debe coincidir con tu nombre (${expectedPrefix}...)`);
            return;
        }

        // 3. Formato Año+01
        const regex = /^[a-zñ]+\.[a-zñ]+\d{2}01@alumnos\.ubiobio\.cl$/;
        if (!regex.test(email)) {
                alert('Error: El correo debe terminar con el año + 01 (ej: .apellido2201@...)');
                return;
        }

        // 4. Contraseña Segura
        const pwd = formData.password;
        if (pwd.length < 8 || !/[A-Z]/.test(pwd) || !/[^a-zA-Z0-9]/.test(pwd)) {
            alert('La contraseña debe tener: 8 caracteres, 1 mayúscula y 1 símbolo.');
            return;
        }

        try {
            await axios.post('/auth/register', formData);
            alert('¡Registro exitoso! Ahora puedes iniciar sesión.');
            navigate('/auth');
            
        } catch (error) {
            console.error(error);
            const msg = error.response?.data?.message || "Error desconocido";
            alert('Error al registrarse: ' + msg);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
            <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
                
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-extrabold text-blue-700">Registro Estudiantes</h1>
                    <p className="text-gray-500 mt-2">Crea tu cuenta para inscribir tu práctica</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-sm font-bold text-gray-700">Nombre Completo</label>
                        <input 
                            name="nombre" 
                            placeholder="Ej: Cristina Morán Valenzuela" 
                            onChange={handleChange} 
                            required 
                            className="w-full p-3 border rounded-lg bg-gray-50 focus:outline-none focus:border-blue-500" 
                        />
                    </div>

                    <div>
                        <label className="text-sm font-bold text-gray-700">RUT</label>
                        <input name="rut" placeholder="12.345.678-9" value={formData.rut} onChange={handleRutChange} maxLength={12} required className="w-full p-3 border rounded-lg bg-gray-50 focus:outline-none focus:border-blue-500" />
                    </div>

                    <div>
                        <label className="text-sm font-bold text-gray-700">Correo Institucional</label>
                        <input name="email" type="email" placeholder="nombre.apellidoXX01@alumnos..." onChange={handleChange} required className="w-full p-3 border rounded-lg bg-gray-50 focus:outline-none focus:border-blue-500" />
                    </div>

                    <div>
                        <label className="text-sm font-bold text-gray-700">Contraseña</label>
                        <input name="password" type="password" placeholder="Mín. 8 caracteres, Mayús + Símbolo" onChange={handleChange} required className="w-full p-3 border rounded-lg bg-gray-50 focus:outline-none focus:border-blue-500" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <input name="carrera" placeholder="Carrera" onChange={handleChange} required className="w-full p-3 border rounded-lg bg-gray-50 focus:outline-none focus:border-blue-500" />
                        <select name="nivelPractica" onChange={handleChange} className="w-full p-3 border rounded-lg bg-gray-50 focus:outline-none focus:border-blue-500">
                            <option value="I">Práctica I</option>
                            <option value="II">Práctica II</option>
                        </select>
                    </div>

                    <button type="submit" className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg transform hover:scale-[1.02]">
                        Registrarme
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-gray-500">¿Ya tienes cuenta?</p>
                    <Link to="/auth" className="text-blue-600 font-bold hover:underline">
                        Inicia Sesión aquí
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Register;