import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Form from '../components/Form';
import { useAuth } from '../context/AuthContext';
import axios from '../services/root.service.js'; 

const PublicarOferta = () => {
  const [carrerasOptions, setCarrerasOptions] = useState([]);
  const [empresasOptions, setEmpresasOptions] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation(); 
  const { user } = useAuth(); 

  const today = new Date().toISOString().split("T")[0];

  // 1. Detectar si estamos en Modo Edición
  const ofertaAEditar = location.state?.oferta;
  const esEdicion = !!ofertaAEditar;

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
            value: c.id
          })));
        }

        if (resEmpresas.data.data) {
          setEmpresasOptions(resEmpresas.data.data.map(e => ({
            label: e.nombre, 
            value: e.id
          })));
        }
      } catch (error) {
        console.error("Error al cargar datos:", error);
      }
    };
    fetchData();
  }, [user]); 

  // 2. Definir campos
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
      min: today,
      defaultValue: esEdicion && ofertaAEditar.fechaCierre 
        ? new Date(ofertaAEditar.fechaCierre).toISOString().split('T')[0] 
        : "",
      validate: (value) => {
        if (value < today) return "No puedes elegir una fecha del pasado";
        return true;
      }
    },
    {
      name: "empresaId",
      label: "Empresa Oferente",
      fieldType: "select",
      options: empresasOptions,
      required: true,
      defaultValue: esEdicion ? ofertaAEditar.empresa?.id : ""
    },
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
      defaultValue: esEdicion ? ofertaAEditar.carreras?.map(c => c.id) : []
    }
  ];

  // 3. Manejar el envío
  const handleSubmit = async (formData) => {
    try {
      if (esEdicion) {
        await axios.put(`/ofertas/${ofertaAEditar.id}`, formData);
      } else {
        await axios.post('/ofertas', formData);
      }
      
      setShowSuccess(true);
      
      setTimeout(() => {
        // Al guardar con éxito, sí queremos ir a ver la lista para confirmar que está ahí
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
      
      {/* HEADER / BOTÓN VOLVER */}
      <div className="max-w-2xl w-full mb-4 text-left">
        <button 
          // 👇 LA SOLUCIÓN: Usamos -1 para volver al historial anterior
          onClick={() => navigate(-1)}
          className="text-gray-500 hover:text-purple-600 flex items-center gap-2 transition-all duration-300 font-bold group"
        >
          <span className="group-hover:-translate-x-1 transition-transform">←</span> 
          Cancelar y Volver
        </button>
      </div>

      {/* FORMULARIO */}
      <Form 
        title={esEdicion ? "✏️ Editar Oferta" : "🚀 Nueva Oferta de Práctica"}
        fields={fields}
        buttonText={esEdicion ? "💾 Guardar Cambios" : "📢 Publicar Oferta"}
        onSubmit={handleSubmit}
      />

      {/* MODAL DE ÉXITO */}
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