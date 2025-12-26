import { useState } from 'react';
import { createSolicitud } from '@services/solicitud.service'; 
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const CrearSolicitud = () => {
  const navigate = useNavigate();
  const [mensaje, setMensaje] = useState('');
  const [archivo, setArchivo] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!mensaje.trim()) return Swal.fire('Error', 'Debes escribir un mensaje', 'warning');

    const formData = new FormData();
    formData.append('mensaje', mensaje);
    if (archivo) {
        formData.append('archivo', archivo); 
    }

    try {
        await createSolicitud(formData);
        Swal.fire('Éxito', 'Solicitud enviada correctamente', 'success');
        navigate('/solicitudes/mis-solicitudes'); 
    } catch (error) {
        Swal.fire('Error', 'No se pudo crear la solicitud', 'error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-lg">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">📝 Nueva Solicitud</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Mensaje / Detalle</label>
                <textarea 
                    value={mensaje}
                    onChange={(e) => setMensaje(e.target.value)}
                    className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    rows="4"
                    placeholder="Explica el motivo de tu solicitud..."
                ></textarea>
            </div>

            <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Adjuntar Documento (PDF)</label>
                <input 
                    type="file" 
                    onChange={(e) => setArchivo(e.target.files[0])}
                    accept=".pdf"
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-colors"
                />
            </div>

            <div className="flex gap-4">
                <button 
                    type="button"
                    onClick={() => navigate(-1)}
                    className="flex-1 py-3 rounded-xl bg-gray-200 hover:bg-gray-300 font-bold text-gray-700"
                >
                    Cancelar
                </button>
                <button 
                    type="submit"
                    className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg transform active:scale-95 transition-all"
                >
                    Enviar
                </button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default CrearSolicitud;