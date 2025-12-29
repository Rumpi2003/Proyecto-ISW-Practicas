import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { subirBitacoras } from '../services/bitacora.service';

const SubirBitacoras = () => {
  const navigate = useNavigate();
  const [bitacoras, setBitacoras] = useState([]); // Lista de archivos a subir
  const [cargando, setCargando] = useState(false);

  const handleAgregarArchivo = (e) => {
    const archivos = Array.from(e.target.files);
    setBitacoras([...bitacoras, ...archivos]);
  };

  const handleEliminarArchivo = (index) => {
    setBitacoras(bitacoras.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (bitacoras.length === 0) {
      return Swal.fire('Error', 'Debes adjuntar al menos una bitácora', 'warning');
    }

    setCargando(true);

    try {
      await subirBitacoras(bitacoras, "Bitácora semanal");
      
      Swal.fire('Éxito', 'Bitácoras subidas correctamente', 'success');
      navigate('/');
    } catch (error) {
      Swal.fire('Error', error?.response?.data?.message || 'No se pudieron subir las bitácoras', 'error');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-2xl">
        {/* HEADER */}
        <div className="flex justify-between items-start mb-8 border-b border-gray-100 pb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
              <span>📖</span>
              Subir Bitácoras
            </h1>
            <p className="text-gray-500 mt-2">Carga los archivos de tus bitácoras de práctica</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate('/bitacoras/mis-bitacoras')}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-sm"
              type="button"
            >
              📋 Ver mis bitácoras
            </button>
            <button 
              onClick={() => navigate(-1)} 
              className="text-gray-400 hover:text-gray-600 font-bold text-2xl transition-colors"
              title="Volver"
            >
              ✕
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Carga de archivos */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3">
              📎 Adjuntar Bitácoras
            </label>
            <div className="border-2 border-dashed border-purple-300 rounded-xl p-8 text-center bg-purple-50 hover:bg-purple-100 transition-colors cursor-pointer relative">
              <input 
                type="file" 
                multiple
                onChange={handleAgregarArchivo}
                accept=".pdf"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="pointer-events-none">
                <p className="text-4xl mb-2">⬆️</p>
                <p className="text-gray-700 font-semibold">Arrastra tus archivos PDF aquí</p>
                <p className="text-gray-500 text-sm mt-1">o haz clic para seleccionar</p>
                <p className="text-xs text-gray-500 mt-2">Solo se aceptan archivos PDF</p>
              </div>
            </div>
          </div>

          {/* Lista de archivos */}
          {bitacoras.length > 0 && (
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="font-bold text-gray-800 mb-4">
                ✅ {bitacoras.length} archivo{bitacoras.length !== 1 ? 's' : ''} seleccionado{bitacoras.length !== 1 ? 's' : ''}
              </h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {bitacoras.map((archivo, index) => (
                  <div key={index} className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-200 hover:shadow-sm transition-shadow">
                    <div className="flex items-center gap-3 flex-1">
                      <span className="text-lg">📄</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-800 truncate">{archivo.name}</p>
                        <p className="text-xs text-gray-500">{(archivo.size / 1024).toFixed(2)} KB</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleEliminarArchivo(index)}
                      className="ml-2 text-red-500 hover:text-red-700 font-bold hover:bg-red-50 p-2 rounded transition-colors"
                      title="Eliminar archivo"
                    >
                      🗑️
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Botones de acción */}
          <div className="flex gap-4 pt-6 border-t border-gray-100">
            <button 
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 py-3 rounded-xl bg-gray-200 hover:bg-gray-300 font-bold text-gray-700 transition-colors"
              disabled={cargando}
            >
              Cancelar
            </button>
            <button 
              type="submit"
              disabled={cargando || bitacoras.length === 0}
              className="flex-1 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white font-bold shadow-lg transform active:scale-95 transition-all disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {cargando ? (
                <>
                  <span className="animate-spin">⏳</span>
                  Subiendo...
                </>
              ) : (
                <>
                  <span>📤</span>
                  Subir Bitácoras
                </>
              )}
            </button>
          </div>
        </form>

        {/* Info adicional */}
        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-xl">
          <p className="text-xs text-blue-800">
            <span className="font-bold">💡 Nota:</span> Las bitácoras subidas serán revisadas por los encargados y supervisores. Asegúrate de que contengan información clara y completa sobre tus actividades.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SubirBitacoras;
