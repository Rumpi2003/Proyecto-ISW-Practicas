import { useNavigate } from 'react-router-dom';

const MenuGestionSolicitudes = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* HEADER BOTON VOLVER */}
        <div className="col-span-1 md:col-span-2 mb-4">
             <button onClick={() => navigate('/dashboard')} className="bg-white px-4 py-2 rounded-lg font-bold shadow text-gray-600 hover:bg-gray-100">← Volver al Panel</button>
        </div>

        {/* POR EVALUAR */}
        <div 
            onClick={() => navigate('/dashboard/solicitudes-encargado/pendientes')}
            className="bg-white p-10 rounded-3xl shadow-xl cursor-pointer hover:shadow-2xl hover:scale-[1.02] transition-all border-l-8 border-yellow-500 flex flex-col items-center text-center group"
        >
            <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">⚡</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Por Evaluar</h2>
            <p className="text-gray-500">
                Solicitudes que requieren tu aprobación o rechazo.
            </p>
            <button className="mt-6 bg-yellow-500 text-white px-6 py-2 rounded-full font-bold">
                Revisar Pendientes
            </button>
        </div>

        {/* EVALUADAS */}
        <div 
            onClick={() => navigate('/dashboard/solicitudes-encargado/historial')}
            className="bg-white p-10 rounded-3xl shadow-xl cursor-pointer hover:shadow-2xl hover:scale-[1.02] transition-all border-l-8 border-gray-500 flex flex-col items-center text-center group"
        >
            <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">📂</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Historial Evaluado</h2>
            <p className="text-gray-500">
                Consulta las solicitudes que ya fueron procesadas.
            </p>
            <button className="mt-6 bg-gray-600 text-white px-6 py-2 rounded-full font-bold">
                Ver Archivo
            </button>
        </div>

      </div>
    </div>
  );
};

export default MenuGestionSolicitudes;