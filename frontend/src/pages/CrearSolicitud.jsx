import { useState } from 'react';
import { createSolicitud } from '../services/solicitud.service';
import Swal from 'sweetalert2';

const CrearSolicitud = () => {
  const [mensaje, setMensaje] = useState('');
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    const archivoSeleccionado = e.target.files[0];
    setFile(archivoSeleccionado);
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); 

    try {
      await createSolicitud(mensaje, file);
      
      Swal.fire('¡Enviado!', 'Tu solicitud se ha creado correctamente', 'success');
      
      setMensaje('');
      setFile(null);
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'No se pudo enviar la solicitud', 'error');
    }
  };

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-4">Nueva Solicitud</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* INPUT DE TEXTO */}
        <div>
          <label className="block font-bold">Mensaje:</label>
          <textarea
            className="w-full border p-2 rounded"
            value={mensaje}
            onChange={(e) => setMensaje(e.target.value)}
            placeholder="Escribe aquí los detalles..."
          />
        </div>

        {/* INPUT DE ARCHIVO */}
        <div>
          <label className="block font-bold">Adjuntar Documento (PDF/Imagen):</label>
          <input
            type="file"
            onChange={handleFileChange} //aqui archivo
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>

        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded">
          Enviar Solicitud
        </button>

      </form>
    </div>
  );
};

export default CrearSolicitud;