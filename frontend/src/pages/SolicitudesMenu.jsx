import { useNavigate } from 'react-router-dom';

const SolicitudesMenu = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* TARJETA 1: CREAR */}
        <div 
            onClick={() => navigate('/solicitudes/crear')}
            className="bg-white p-10 rounded-3xl shadow-xl cursor-pointer hover:shadow-2xl hover:scale-[1.02] transition-all border-l-8 border-blue-600 flex flex-col items-center text-center group"
        >
            <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">📄</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Nueva Solicitud</h2>
            <p className="text-gray-500">
                Redacta una nueva solicitud y adjunta tus documentos PDF.
            </p>
            <button className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-full font-bold">
                Crear Ahora
            </button>
        </div>

        {/* TARJETA 2: VER Y EDITAR */}
        <div 
            onClick={() => navigate('/solicitudes/mis-solicitudes')}
            className="bg-white p-10 rounded-3xl shadow-xl cursor-pointer hover:shadow-2xl hover:scale-[1.02] transition-all border-l-8 border-indigo-600 flex flex-col items-center text-center group"
        >
            <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">📂</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Mis Solicitudes</h2>
            <p className="text-gray-500">
                Revisa el estado (Aprobada/Rechazada) y edita si es necesario.
            </p>
            <button className="mt-6 bg-indigo-600 text-white px-6 py-2 rounded-full font-bold">
                Ver Historial
            </button>
        </div>

      </div>
    </div>
  );
};

export default SolicitudesMenu;