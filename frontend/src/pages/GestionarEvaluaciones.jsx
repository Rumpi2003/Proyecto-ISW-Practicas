import { useNavigate } from 'react-router-dom';

const GestionarEvaluaciones = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-7xl min-h-[80vh] p-8 md:p-12 flex flex-col">
        <div className="flex items-center gap-4 mb-8 border-b border-gray-100 pb-6">
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-4 py-2 rounded-xl transition-all font-bold text-xl"
          >
            ←
          </button>
          <div>
            <h1 className="text-3xl font-extrabold text-gray-800">Gestionar Evaluaciones</h1>
            <p className="text-gray-500">Accede a la gestión de pautas y evaluaciones de supervisores.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
          <div
            onClick={() => navigate('/dashboard/pautas/gestionar')}
            className="group bg-emerald-50 border-2 border-emerald-100 rounded-2xl p-10 cursor-pointer hover:bg-emerald-600 hover:border-emerald-600 hover:shadow-2xl transition-all duration-300 flex items-center gap-6"
          >
            <div className="bg-white p-4 rounded-full text-4xl shadow-sm group-hover:scale-110 transition-transform">📝</div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800 group-hover:text-white transition-colors">Pautas de Evaluación</h3>
              <p className="text-gray-500 mt-1 group-hover:text-emerald-100 transition-colors">Crear y gestionar pautas de evaluación.</p>
            </div>
          </div>

          <div
            onClick={() => navigate('/dashboard/evaluaciones/gestionar')}
            className="group bg-teal-50 border-2 border-teal-100 rounded-2xl p-10 cursor-pointer hover:bg-teal-600 hover:border-teal-600 hover:shadow-2xl transition-all duration-300 flex items-center gap-6"
          >
            <div className="bg-white p-4 rounded-full text-4xl shadow-sm group-hover:scale-110 transition-transform">🧾</div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800 group-hover:text-white transition-colors">Evaluaciones Supervisor</h3>
              <p className="text-gray-500 mt-1 group-hover:text-teal-100 transition-colors">Ver y eliminar evaluaciones realizadas por supervisores.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GestionarEvaluaciones;
