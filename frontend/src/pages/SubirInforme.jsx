import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { subirInforme } from '../services/informe.service';
import Swal from 'sweetalert2';

const SubirInforme = () => {
  const navigate = useNavigate();
  const [archivo, setArchivo] = useState(null);
  const [cargando, setCargando] = useState(false);

  const handleArchivoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        Swal.fire('Error', 'Solo se permite subir archivos PDF', 'error');
        return;
      }
      setArchivo(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!archivo) {
      return Swal.fire('Falta archivo', 'Debes seleccionar un archivo PDF', 'warning');
    }

    try {
      setCargando(true);
      await subirInforme(archivo, 'Informe');
      Swal.fire('Enviado', 'Informe subido exitosamente', 'success');
      navigate('/informes/mis-informes');
    } catch (error) {
      console.error(error);
      Swal.fire('Error', error?.response?.data?.message || 'No se pudo subir el informe', 'error');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen p-6 md:p-12 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-2xl mx-auto">
        {/* HEADER */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="bg-white px-4 py-2 rounded-xl font-bold border border-gray-200 hover:bg-gray-100 shadow-sm transition-all text-gray-700 mb-4"
          >
            ← Volver
          </button>
          <h1 className="text-4xl font-bold text-gray-800 flex items-center gap-3">
            <span>📋</span>
            Subir Informe
          </h1>
          <p className="text-gray-600 mt-2">Sube tu informe de prácticas profesionales</p>
        </div>

        {/* FORMULARIO */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8">
          {/* Subida de archivo */}
          <div className="mb-6">
            <label className="block text-lg font-bold text-gray-800 mb-2">
              Archivo PDF *
            </label>
            <div className="border-2 border-dashed border-blue-300 rounded-lg p-8 bg-blue-50 text-center cursor-pointer hover:bg-blue-100 transition-colors relative">
              <input
                type="file"
                accept="application/pdf"
                onChange={handleArchivoChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="text-5xl mb-2">📄</div>
              {archivo ? (
                <div>
                  <p className="text-lg font-bold text-blue-700">{archivo.name}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    {(archivo.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-lg font-bold text-gray-700">Haz clic para seleccionar el archivo</p>
                  <p className="text-sm text-gray-600 mt-1">o arrastra tu PDF aquí</p>
                  <p className="text-xs text-gray-500 mt-2">Solo se aceptan archivos PDF</p>
                </div>
              )}
            </div>
          </div>

          {/* Botones */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-bold hover:bg-gray-200 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={cargando}
              className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 disabled:opacity-60 transition-colors"
            >
              {cargando ? 'Subiendo...' : '📤 Subir Informe'}
            </button>
          </div>
        </form>

        {/* BOTÓN MI INFORME */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={() => navigate('/informes/mis-informes')}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg"
          >
            📋 Mi Informe
          </button>
        </div>

        {/* INFORMACIÓN */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-2xl p-6">
          <h3 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
            <span>ℹ️</span>
            Información importante
          </h3>
          <ul className="text-sm text-gray-700 space-y-2">
            <li>✓ Solo puedes subir archivos en formato PDF</li>
            <li>✓ El informe será revisado por el encargado</li>
            <li>✓ Puedes editar tu informe mientras esté pendiente</li>
            <li>✓ Una vez aprobado, no podrá ser modificado</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SubirInforme;
