// frontend/src/pages/PublicarOferta.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Form from '../components/Form';
import { useAuth } from '../context/AuthContext';
import axios from '../services/root.service.js'; 

const PublicarOferta = () => {
  const [carrerasOptions, setCarrerasOptions] = useState([]);
  const [empresasOptions, setEmpresasOptions] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false); // 👈 Nuevo estado para el modal
  const navigate = useNavigate();
  const { user } = useAuth(); 

  const today = new Date().toISOString().split("T")[0];

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

  const fields = [
    {
      name: "titulo",
      label: "Título de la Oferta",
      fieldType: "input",
      type: "text",
      placeholder: "Ej: Práctica Desarrollo Web",
      required: true,
      minLength: 10
    },
    {
      name: "fechaCierre",
      label: "Fecha Límite de Postulación",
      fieldType: "input",
      type: "date",
      required: true,
      min: today,
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
      required: true
    },
    {
      name: "descripcion",
      label: "Descripción de la Práctica",
      fieldType: "textarea",
      rows: 8,
      placeholder: "Detalla las responsabilidades, requisitos y beneficios...",
      required: true,
      minLength: 30
    },
    {
      name: "carreras",
      label: `Carreras Destinadas (${user?.facultad?.nombre || 'Cargando...'})`, 
      fieldType: "checkbox-group", 
      options: carrerasOptions,
      required: true
    }
  ];

  const handlePublish = async (formData) => {
    try {
      await axios.post('/ofertas', formData);
      
      // 1. Mostrar el modal de éxito
      setShowSuccess(true);
      
      // 2. Esperar 2 segundos y redirigir
      setTimeout(() => {
        navigate('/home'); 
      }, 2000);

    } catch (error) {
      console.error("Error al publicar:", error);
      const mensajeError = error.response?.data?.message || "Ocurrió un error al guardar la oferta.";
      alert(`Error: ${mensajeError}`); // El error sí lo dejamos como alert por ahora
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 relative">
      
      {/* HEADER / BOTÓN VOLVER */}
      <div className="max-w-2xl w-full mb-4 text-left">
        <button 
          onClick={() => navigate(-1)}
          className="text-gray-500 hover:text-purple-600 flex items-center gap-2 transition-all duration-300 font-bold group"
        >
          <span className="group-hover:-translate-x-1 transition-transform">←</span> 
          Volver al Panel
        </button>
      </div>

      {/* FORMULARIO */}
      <Form 
        title="Nueva Oferta de Práctica"
        fields={fields}
        buttonText="Publicar Oferta"
        onSubmit={handlePublish}
      />

      {/* MODAL DE ÉXITO (Overlay) */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-300">
          <div className="bg-white p-8 rounded-3xl shadow-2xl flex flex-col items-center max-w-sm w-full transform scale-100 animate-in zoom-in duration-300">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <span className="text-4xl">✅</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">¡Oferta Publicada!</h3>
            <p className="text-gray-500 text-center mb-6">
              Tu oferta ha sido creada correctamente. 
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