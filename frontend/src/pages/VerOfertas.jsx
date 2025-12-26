import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../services/root.service.js';
import { useAuth } from '../context/AuthContext';

const VerOfertas = () => {
  const [ofertas, setOfertas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOferta, setSelectedOferta] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const fetchOfertas = async () => {
      try {
        const response = await axios.get('/ofertas');
        const data = response.data.data || [];
        setOfertas(data);
      } catch (error) {
        console.error("Error al cargar ofertas:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOfertas();
  }, [user]);

  const formatDate = (dateString) => {
    if (!dateString) return "Sin fecha";
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(dateString);
    return new Date(date.valueOf() + date.getTimezoneOffset() * 60 * 1000).toLocaleDateString('es-ES', options);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-12 relative">
      
      {/* HEADER */}
      <div className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
            <button 
                onClick={() => navigate('/home')}
                className="text-gray-500 hover:text-blue-600 flex items-center gap-2 transition-all duration-300 font-bold group mb-4"
            >
                <span className="group-hover:-translate-x-1 transition-transform">←</span> 
                Volver al Panel
            </button>
            <h1 className="text-3xl font-extrabold text-gray-800">Mis Publicaciones</h1>
            <p className="text-gray-500">Gestiona las ofertas de práctica de {user?.facultad?.nombre}</p>
        </div>
        <button 
            onClick={() => navigate('/publicar-oferta')}
            className="bg-green-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-green-700 shadow-lg hover:shadow-xl transition-all"
        >
            + Nueva Oferta
        </button>
      </div>

      {/* LISTADO DE OFERTAS */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : ofertas.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-gray-100 max-w-2xl mx-auto mt-10">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Aún no hay ofertas</h3>
            <p className="text-gray-500 mb-6">Parece que no has subido ninguna vacante todavía.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {ofertas.map((oferta) => (
            <div 
                key={oferta.id} 
                onClick={() => setSelectedOferta(oferta)}
                className="group bg-white rounded-2xl shadow-md hover:shadow-2xl hover:-translate-y-1 cursor-pointer transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col h-full"
            >
              <div className="h-2 bg-gradient-to-r from-blue-500 to-indigo-600 w-full group-hover:from-indigo-500 group-hover:to-purple-600 transition-all"></div>
              
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                    <span className="bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                        {oferta.empresa?.nombre || "Empresa Inc."}
                    </span>
                    
                    {/* 👇 BOTÓN EDITAR */}
                    <button 
                        onClick={(e) => {
                            e.stopPropagation(); // Evita que se abra el modal al hacer clic aquí
                            navigate('/publicar-oferta', { state: { oferta } });
                        }}
                        className="p-2 bg-amber-50 text-amber-600 rounded-lg hover:bg-amber-100 transition-colors border border-amber-100"
                        title="Editar publicación"
                    >
                        ✏️
                    </button>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {oferta.titulo}
                </h3>
                
                <p className="text-gray-500 text-sm mb-6 line-clamp-4 flex-1">
                    {oferta.descripcion}
                </p>

                <div className="border-t border-gray-100 pt-4 mt-auto">
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                        <span>📅 Cierre:</span>
                        <span className="font-semibold text-gray-800">{formatDate(oferta.fechaCierre)}</span>
                    </div>
                    
                    <div className="flex items-start gap-2 text-sm text-gray-600">
                         <span className="mt-0.5">🎓 Para:</span>
                         <div className="flex flex-wrap gap-1">
                            {oferta.carreras?.slice(0, 3).map((c, index) => (
                                <span key={index} className="bg-gray-100 text-gray-600 text-[10px] font-bold px-1.5 py-0.5 rounded border border-gray-200 uppercase">
                                    {c.abreviacion || "S/A"}
                                </span>
                            ))}
                            {(oferta.carreras?.length || 0) > 3 && (
                                <span className="text-xs text-gray-400 font-medium self-center">
                                    +{oferta.carreras.length - 3}
                                </span>
                            )}
                         </div>
                    </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 🟢 MODAL DE DETALLES */}
      {selectedOferta && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto flex flex-col animate-in zoom-in-95 duration-200">
                
                <div className="p-8 border-b border-gray-100 sticky top-0 bg-white z-10 flex justify-between items-start">
                    <div>
                        <span className="bg-indigo-50 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide mb-2 inline-block">
                            {selectedOferta.empresa?.nombre}
                        </span>
                        <h2 className="text-2xl font-bold text-gray-900 mt-1">
                            {selectedOferta.titulo}
                        </h2>
                    </div>
                    <button 
                        onClick={(e) => { e.stopPropagation(); setSelectedOferta(null); }}
                        className="bg-gray-100 hover:bg-red-50 text-gray-400 hover:text-red-500 transition-all p-2 rounded-full text-2xl leading-none"
                    >
                        &times;
                    </button>
                </div>

                <div className="p-8 space-y-6">
                    <div>
                        <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Descripción Completa</h4>
                        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                            {selectedOferta.descripcion}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-gray-50 p-4 rounded-xl">
                            <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Fecha Límite de Postulación</h4>
                            <p className="font-semibold text-gray-800">{formatDate(selectedOferta.fechaCierre)}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-xl">
                             <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Carreras Destinadas</h4>
                             <ul className="list-disc list-inside text-gray-700 text-sm space-y-1">
                                {selectedOferta.carreras?.map(c => (
                                    <li key={c.id}>
                                        <span className="font-semibold">{c.abreviacion ? `[${c.abreviacion}] ` : ''}</span>
                                        {c.nombre}
                                    </li>
                                ))}
                             </ul>
                        </div>
                    </div>
                </div>

                <div className="p-6 border-t border-gray-100 bg-gray-50 rounded-b-3xl flex justify-between gap-4">
                    {/* Botón Editar dentro del modal también por comodidad */}
                    <button 
                        onClick={() => navigate('/publicar-oferta', { state: { oferta: selectedOferta } })}
                        className="bg-amber-500 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-amber-600 transition-all shadow-md flex items-center gap-2"
                    >
                        ✏️ Editar Oferta
                    </button>
                    <button 
                        onClick={(e) => { e.stopPropagation(); setSelectedOferta(null); }}
                        className="bg-blue-600 text-white px-8 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-md"
                    >
                        Cerrar Detalles
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default VerOfertas;