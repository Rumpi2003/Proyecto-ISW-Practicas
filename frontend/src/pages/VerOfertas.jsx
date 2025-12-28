import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../services/root.service.js';
import { useAuth } from '../context/AuthContext';

const VerOfertas = () => {
  const [ofertas, setOfertas] = useState([]);
  const [loading, setLoading] = useState(true);

  // Estados de Filtros
  const [filterEmpresa, setFilterEmpresa] = useState("");
  const [filterCarrera, setFilterCarrera] = useState("");
  const [filterEstado, setFilterEstado] = useState("todos");
  
  // Estados de Modales
  const [selectedOferta, setSelectedOferta] = useState(null); 
  const [ofertaAEliminar, setOfertaAEliminar] = useState(null); 
  const [showSuccessDelete, setShowSuccessDelete] = useState(false);
  
  const navigate = useNavigate();
  const { user } = useAuth();
  const esEncargado = user?.rol === 'encargado';

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
    const date = new Date(dateString);
    return new Date(date.valueOf() + date.getTimezoneOffset() * 60 * 1000)
      .toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const getEstadoOferta = (oferta) => {
    const fechaCierre = new Date(oferta.fechaCierre);
    fechaCierre.setMinutes(fechaCierre.getMinutes() + fechaCierre.getTimezoneOffset());
    fechaCierre.setHours(23, 59, 59);

    const hoy = new Date();

    if (oferta.estado === 'cerrada') {
      return { label: '🔴 Cerrada', color: 'bg-red-100 text-red-700 border-red-200', active: false };
    }
    if (fechaCierre < hoy) {
      return { label: '⏳ Expirada', color: 'bg-gray-100 text-gray-600 border-gray-200', active: false };
    }
    return { label: '🟢 Activa', color: 'bg-green-100 text-green-700 border-green-200', active: true };
  };

  // logica para filtrar 
  const empresasUnicas = useMemo(() => {
    const empresas = ofertas.map(o => o.empresa?.nombre).filter(Boolean);
    return [...new Set(empresas)].sort();
  }, [ofertas]);

  const carrerasUnicas = useMemo(() => {
    const carreras = ofertas.flatMap(o => o.carreras?.map(c => c.abreviacion)).filter(Boolean);
    return [...new Set(carreras)].sort();
  }, [ofertas]);

  const ofertasFiltradas = ofertas.filter(oferta => {
    const estadoCalc = getEstadoOferta(oferta);
    
    if (filterEmpresa && oferta.empresa?.nombre !== filterEmpresa) return false;
    if (filterCarrera && !oferta.carreras?.some(c => c.abreviacion === filterCarrera)) return false;
    
    if (filterEstado !== "todos") {
        if (filterEstado === "activa" && !estadoCalc.active) return false;
        if (filterEstado === "cerrada" && estadoCalc.active) return false;
    }
    return true;
  });

  const handleResetFilters = () => {
    setFilterEmpresa("");
    setFilterCarrera("");
    setFilterEstado("todos");
  };

  const handleConfirmDelete = async () => {
    if (!ofertaAEliminar) return;
    try {
        await axios.delete(`/ofertas/${ofertaAEliminar}`);
        setOfertas(prev => prev.filter(o => o.id !== ofertaAEliminar));
        if (selectedOferta?.id === ofertaAEliminar) setSelectedOferta(null);
        setOfertaAEliminar(null);
        setShowSuccessDelete(true);
        setTimeout(() => setShowSuccessDelete(false), 2000);
    } catch (error) {
        console.error("Error al eliminar:", error);
        alert("Hubo un error al intentar eliminar la oferta.");
    }
  };

  return (
    <div className="min-h-screen p-6 md:p-12 relative">
      
      {/* HEADER */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
                <button 
                    onClick={() => navigate('/home')}
                    className="text-white/80 hover:text-white flex items-center gap-2 transition-all duration-300 font-bold group mb-4"
                >
                    <span className="group-hover:-translate-x-1 transition-transform">←</span> 
                    Volver al Panel
                </button>
                <h1 className="text-3xl font-extrabold text-white mb-2 drop-shadow-md">
                    {esEncargado ? "Mis Publicaciones" : "Ofertas de Práctica"}
                </h1>
                <p className="text-blue-100 font-medium">
                    Mostrando {ofertasFiltradas.length} de {ofertas.length} ofertas
                </p>
            </div>
            
            {esEncargado && (
                <button 
                    onClick={() => navigate('/publicar-oferta')}
                    className="bg-green-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-green-400 shadow-lg hover:shadow-xl transition-all border border-green-400/30"
                >
                    + Nueva Oferta
                </button>
            )}
        </div>

        {/* BARRA DE FILTROS */}
        <div className="bg-white/95 backdrop-blur-sm p-6 rounded-3xl shadow-xl border border-white/50 grid grid-cols-1 md:grid-cols-4 gap-4 items-end animate-in fade-in slide-in-from-top-4 duration-300">
            <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Empresa</label>
                <select 
                    value={filterEmpresa}
                    onChange={(e) => setFilterEmpresa(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 text-gray-700 py-2.5 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
                >
                    <option value="">Todas las empresas</option>
                    {empresasUnicas.map(emp => (
                        <option key={emp} value={emp}>{emp}</option>
                    ))}
                </select>
            </div>
            <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Carrera</label>
                <select 
                    value={filterCarrera}
                    onChange={(e) => setFilterCarrera(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 text-gray-700 py-2.5 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
                >
                    <option value="">Todas las carreras</option>
                    {carrerasUnicas.map(carrera => (
                        <option key={carrera} value={carrera}>{carrera}</option>
                    ))}
                </select>
            </div>
            <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Estado</label>
                <select 
                    value={filterEstado}
                    onChange={(e) => setFilterEstado(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 text-gray-700 py-2.5 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
                >
                    <option value="todos">Todos los estados</option>
                    <option value="activa">🟢 Solo Activas</option>
                    <option value="cerrada">🔴 Cerradas / Expiradas</option>
                </select>
            </div>
            <div>
                <button 
                    onClick={handleResetFilters}
                    className="w-full bg-blue-50 text-blue-600 font-bold py-2.5 px-4 rounded-xl hover:bg-blue-100 transition-colors flex items-center justify-center gap-2 border border-blue-100"
                >
                    ↺ Limpiar
                </button>
            </div>
        </div>
      </div>

      {/* LISTADO DE OFERTAS */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
             <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-white"></div>
        </div>
      ) : ofertasFiltradas.length === 0 ? (
        <div className="bg-white/90 backdrop-blur rounded-3xl p-12 text-center shadow-lg border border-white/50 max-w-2xl mx-auto mt-10">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">No se encontraron resultados</h3>
            <p className="text-gray-500 mb-6">Prueba cambiando los filtros o limpiando la búsqueda.</p>
            <button onClick={handleResetFilters} className="text-blue-600 font-bold hover:underline">Limpiar filtros</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto pb-12">
          {ofertasFiltradas.map((oferta) => {
            const estado = getEstadoOferta(oferta);
            
            return (
              <div 
                key={oferta.id} 
                onClick={() => setSelectedOferta(oferta)}
                className={`group bg-white rounded-3xl shadow-lg hover:shadow-2xl hover:-translate-y-2 cursor-pointer transition-all duration-300 border-none overflow-hidden flex flex-col h-full ${!estado.active ? 'opacity-80 grayscale-[0.5]' : ''}`}
              >
                <div className={`h-2 w-full ${estado.active ? 'bg-gradient-to-r from-blue-500 to-indigo-600' : 'bg-gray-300'}`}></div>
                
                <div className="p-6 flex-1 flex flex-col relative">
                  <div className={`absolute top-4 right-4 text-[10px] font-bold px-3 py-1 rounded-full border uppercase shadow-sm ${estado.color}`}>
                    {estado.label}
                  </div>

                  <div className="flex justify-between items-start mb-4 pr-16">
                      <span className="bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide border border-blue-100">
                          {oferta.empresa?.nombre || "Empresa Inc."}
                      </span>
                  </div>

                  <h3 className={`text-xl font-bold mb-2 line-clamp-2 transition-colors mt-2 ${estado.active ? 'text-gray-900 group-hover:text-blue-600' : 'text-gray-500'}`}>
                      {oferta.titulo}
                  </h3>
                  
                  <p className="text-gray-500 text-sm mb-6 line-clamp-4 flex-1 break-words">
                      {oferta.descripcion}
                  </p>

                  <div className="border-t border-gray-100 pt-4 mt-auto flex justify-between items-end gap-4">
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <span>📅 Cierre:</span>
                            <span className={`font-semibold ${estado.active ? 'text-gray-800' : 'text-red-500'}`}>
                                {formatDate(oferta.fechaCierre)}
                            </span>
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

                      {esEncargado && (
                        <div className="flex gap-2 shrink-0">
                            <button 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    navigate('/publicar-oferta', { state: { oferta } });
                                }}
                                className="p-2 bg-amber-50 text-amber-600 rounded-lg hover:bg-amber-100 transition-colors border border-amber-100 shadow-sm"
                                title="Editar"
                            >
                                ✏️
                            </button>
                            <button 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setOfertaAEliminar(oferta.id); 
                                }}
                                className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors border border-red-100 shadow-sm"
                                title="Eliminar"
                            >
                                🗑️
                            </button>
                        </div>
                      )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL DETALLES */}
      {selectedOferta && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto flex flex-col animate-in zoom-in-95 duration-200">
                <div className="p-8 border-b border-gray-100 sticky top-0 bg-white z-10 flex justify-between items-start">
                    <div>
                        <div className="flex gap-2 mb-2">
                            <span className="bg-indigo-50 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide inline-block border border-indigo-100">
                                {selectedOferta.empresa?.nombre}
                            </span>
                            <span className={`text-[10px] font-bold px-3 py-1 rounded-full border uppercase ${getEstadoOferta(selectedOferta).color}`}>
                                {getEstadoOferta(selectedOferta).label}
                            </span>
                        </div>
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
                        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap break-words">
                            {selectedOferta.descripcion}
                        </p>
                    </div>

                    <div className="bg-indigo-50 p-5 rounded-xl border border-indigo-100">
                        <h4 className="text-sm font-bold text-indigo-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                            🏢 Sobre la Empresa
                        </h4>
                        <div className="space-y-2 text-sm text-indigo-800">
                            <p><span className="font-semibold text-indigo-900">Empresa:</span> {selectedOferta.empresa?.nombre}</p>
                            {selectedOferta.empresa?.razonSocial && (
                                <p><span className="font-semibold text-indigo-900">Razón Social:</span> {selectedOferta.empresa.razonSocial}</p>
                            )}
                            {selectedOferta.empresa?.direccion && (
                                <p className="flex items-center gap-2"><span>📍</span> <span>{selectedOferta.empresa.direccion}</span></p>
                            )}
                            {selectedOferta.empresa?.web && (
                                <a 
                                    href={selectedOferta.empresa.web.startsWith('http') ? selectedOferta.empresa.web : `https://${selectedOferta.empresa.web}`} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="text-blue-600 hover:underline hover:text-blue-800 font-medium flex items-center gap-2 w-fit mt-1"
                                >
                                    <span>🌐</span> Visitar Sitio Web
                                </a>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-gray-50 p-4 rounded-xl">
                            <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Fecha Límite</h4>
                            <p className="font-semibold text-gray-800">{formatDate(selectedOferta.fechaCierre)}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-xl">
                             <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Carreras</h4>
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

                <div className="p-6 border-t border-gray-100 bg-gray-50 rounded-b-3xl flex flex-wrap justify-between gap-4">
                    {esEncargado ? (
                        <div className="flex gap-2 w-full md:w-auto">
                            <button 
                                onClick={() => navigate('/publicar-oferta', { state: { oferta: selectedOferta } })}
                                className="flex-1 md:flex-none bg-amber-500 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-amber-600 transition-all shadow-md flex items-center justify-center gap-2"
                            >
                                ✏️ Editar
                            </button>
                            <button 
                                onClick={() => setOfertaAEliminar(selectedOferta.id)} 
                                className="flex-1 md:flex-none bg-red-500 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-red-600 transition-all shadow-md flex items-center justify-center gap-2"
                            >
                                🗑️ Eliminar
                            </button>
                        </div>
                    ) : (
                        <div className="w-full md:w-auto"></div>
                    )}
                    <button 
                        onClick={(e) => { e.stopPropagation(); setSelectedOferta(null); }}
                        className="w-full md:w-auto bg-blue-600 text-white px-8 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-md"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
      )}

      {/* MODAL ELIMINAR */}
      {ofertaAEliminar && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 transform scale-100 animate-in zoom-in duration-200">
                <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                        <span className="text-3xl">⚠️</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">¿Eliminar esta oferta?</h3>
                    <p className="text-gray-500 text-sm mb-6">Esta acción borrará la publicación permanentemente.</p>
                    <div className="flex gap-3 w-full">
                        <button onClick={() => setOfertaAEliminar(null)} className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-xl font-bold hover:bg-gray-200 transition-colors">Cancelar</button>
                        <button onClick={handleConfirmDelete} className="flex-1 bg-red-600 text-white py-2.5 rounded-xl font-bold hover:bg-red-700 transition-colors shadow-lg hover:shadow-red-500/30">Sí, Eliminar</button>
                    </div>
                </div>
            </div>
        </div>
      )}

      {/* MODAL ÉXITO */}
      {showSuccessDelete && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60] animate-in fade-in duration-300">
          <div className="bg-white p-8 rounded-3xl shadow-2xl flex flex-col items-center max-w-sm w-full transform scale-100 animate-in zoom-in duration-300">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6"><span className="text-4xl">✅</span></div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">¡Eliminada!</h3>
            <p className="text-gray-500 text-center mb-6">La oferta ha sido borrada correctamente.</p>
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden"><div className="bg-green-500 h-full w-full animate-[wiggle_2s_linear]"></div></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VerOfertas;