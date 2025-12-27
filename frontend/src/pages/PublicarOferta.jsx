import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Form from '../components/Form';
import { useAuth } from '../context/AuthContext';
import axios from '../services/root.service.js'; 

const PublicarOferta = () => {
  const [carrerasOptions, setCarrerasOptions] = useState([]);
  const [empresasOptions, setEmpresasOptions] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  
  const navigate = useNavigate();
  const location = useLocation(); 
  const { user } = useAuth(); 

  const ofertaAEditar = location.state?.oferta;
  const esEdicion = !!ofertaAEditar;
  const today = new Date();
  const todayString = today.toLocaleDateString('en-CA');

  useEffect(() => {
    const fetchData = async () => {
      const facultadId = user?.facultad?.id; 
      if (!facultadId) return;

      try {
        const [resCarreras, resEmpresas] = await Promise.all([
          axios.get(`/carreras?facultadId=${facultadId}`),
          axios.get('/empresas')
        ]);

        if (resCarreras.data.data) {
          setCarrerasOptions(resCarreras.data.data.map(c => ({
            label: c.nombre, 
            value: String(c.id) // 👈 FORZAMOS A STRING AQUÍ (ID de la opción)
          })));
        }

        if (resEmpresas.data.data) {
          setEmpresasOptions(resEmpresas.data.data.map(e => ({
            label: e.nombre, 
            value: String(e.id) // 👈 FORZAMOS A STRING AQUÍ TAMBIÉN
          })));
        }
      } catch (error) {
        console.error("Error al cargar datos:", error);
      } finally {
        setLoadingData(false);
      }
    };
    fetchData();
  }, [user]); 

  const fields = [
    {
      name: "titulo",
      label: "Título de la Oferta",
      fieldType: "input",
      type: "text",
      placeholder: "Ej: Práctica Desarrollo Web",
      required: true,
      minLength: 10,
      defaultValue: esEdicion ? ofertaAEditar.titulo : ""
    },
    {
      name: "fechaCierre",
      label: "Fecha Límite de Postulación",
      fieldType: "input",
      type: "date",
      required: true,
      min: todayString,
      defaultValue: esEdicion && ofertaAEditar.fechaCierre 
        ? new Date(ofertaAEditar.fechaCierre).toISOString().split('T')[0] 
        : "",
      validate: (value) => {
        if (value < todayString) return "No puedes elegir una fecha del pasado";
        return true;
      }
    },
    {
      name: "empresaId",
      label: "Empresa Oferente",
      fieldType: "select",
      options: empresasOptions,
      required: true,
      // 👈 FORZAMOS A STRING PARA QUE COINCIDA CON LA OPCIÓN DE ARRIBA
      defaultValue: esEdicion ? String(ofertaAEditar.empresa?.id) : ""
    },
    ...(esEdicion ? [{
      name: "estado",
      label: "Estado de la Oferta",
      fieldType: "select",
      options: [
        { label: "🟢 Activa", value: "activa" },
        { label: "🔴 Cerrada", value: "cerrada" }
      ],
      required: true,
      defaultValue: ofertaAEditar.estado || "activa"
    }] : []),
    {
      name: "descripcion",
      label: "Descripción de la Práctica",
      fieldType: "textarea",
      rows: 8,
      placeholder: "Detalla las responsabilidades, requisitos y beneficios...",
      required: true,
      minLength: 30,
      defaultValue: esEdicion ? ofertaAEditar.descripcion : ""
    },
    {
      name: "carreras",
      label: `Carreras Destinadas (${user?.facultad?.nombre || 'Cargando...'})`, 
      fieldType: "checkbox-group", 
      options: carrerasOptions,
      required: true,
      // 👈 EL ARREGLO DEFINITIVO:
      // 1. Verificamos que exista el array.
      // 2. Mapeamos cada ID convirtiéndolo a String explícitamente.
      defaultValue: esEdicion 
        ? (ofertaAEditar.carreras?.map(c => String(c.id)) || []) 
        : []
    }
  ];

  const handleSubmit = async (formData) => {
    try {
      if (esEdicion) {
        await axios.put(`/ofertas/${ofertaAEditar.id}`, formData);
      } else {
        await axios.post('/ofertas', formData);
      }
      
      setShowSuccess(true);
      
      setTimeout(() => {
        navigate('/ofertas'); 
      }, 2000);

    } catch (error) {
      console.error("Error al procesar:", error);
      const mensajeError = error.response?.data?.message || "Ocurrió un error al procesar la solicitud.";
      alert(`Error: ${mensajeError}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 relative">
      <div className="max-w-2xl w-full mb-4 text-left">
        <button 
          onClick={() => navigate(-1)}
          className="text-gray-500 hover:text-purple-600 flex items-center gap-2 transition-all duration-300 font-bold group"
        >
          <span className="group-hover:-translate-x-1 transition-transform">←</span> 
          Cancelar y Volver
        </button>
      </div>

      {loadingData ? (
         <div className="bg-white p-12 rounded-3xl shadow-xl flex flex-col items-center animate-in fade-in zoom-in duration-300">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mb-4"></div>
            <p className="text-gray-500 font-medium">Cargando datos del formulario...</p>
         </div>
      ) : (
        <Form 
          title={esEdicion ? "✏️ Editar Oferta" : "🚀 Nueva Oferta de Práctica"}
          fields={fields}
          buttonText={esEdicion ? "💾 Guardar Cambios" : "📢 Publicar Oferta"}
          onSubmit={handleSubmit}
        />
      )}

      {showSuccess && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-300">
          <div className="bg-white p-8 rounded-3xl shadow-2xl flex flex-col items-center max-w-sm w-full transform scale-100 animate-in zoom-in duration-300">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <span className="text-4xl">✅</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
                {esEdicion ? "¡Cambios Guardados!" : "¡Oferta Publicada!"}
            </h3>
            <p className="text-gray-500 text-center mb-6">
              La operación se realizó correctamente.
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
               <div className="bg-green-500 h-full w-full animate-[wiggle_2s_linear]"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PublicarOferta;