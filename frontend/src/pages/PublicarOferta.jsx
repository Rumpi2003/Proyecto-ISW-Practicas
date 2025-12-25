// frontend/src/pages/PublicarOferta.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Form from '../components/Form';
import { useAuth } from '../context/AuthContext';
import axios from '../services/root.service.js'; 

const PublicarOferta = () => {
  const [carrerasOptions, setCarrerasOptions] = useState([]);
  const [empresasOptions, setEmpresasOptions] = useState([]);
  const navigate = useNavigate();
  const { user } = useAuth(); 

  // 1. Calculamos la fecha actual para validaciones (Formato YYYY-MM-DD)
  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    const fetchData = async () => {
      const facultadId = user?.facultad?.id; 

      if (!facultadId) return;

      try {
        // Carga paralela de datos
        const [resCarreras, resEmpresas] = await Promise.all([
          axios.get(`/carreras?facultadId=${facultadId}`),
          axios.get('/empresas')
        ]);

        // Formatear Carreras
        if (resCarreras.data.data) {
          setCarrerasOptions(resCarreras.data.data.map(c => ({
            label: c.nombre, 
            value: c.id
          })));
        }

        // Formatear Empresas
        if (resEmpresas.data.data) {
          setEmpresasOptions(resEmpresas.data.data.map(e => ({
            label: e.nombre, 
            value: e.id
          })));
        }

      } catch (error) {
        console.error("Error al cargar datos del formulario:", error);
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
      min: today, // Bloquea días pasados en el calendario visual
      validate: (value) => {
        // Validador lógico: Muestra error si la fecha escrita es menor a hoy
        if (value < today) {
          return "No puedes elegir una fecha del pasado";
        }
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
      alert("¡Oferta publicada exitosamente!");
      navigate('/home'); 

    } catch (error) {
      console.error("Error al publicar:", error);
      const mensajeError = error.response?.data?.message || "Ocurrió un error al guardar la oferta.";
      alert(`Error: ${mensajeError}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <div className="max-w-2xl w-full mb-4 text-left">
        <button 
          onClick={() => navigate(-1)}
          className="text-gray-500 hover:text-purple-600 flex items-center gap-2 transition-all duration-300 font-bold group"
        >
          <span className="group-hover:-translate-x-1 transition-transform">←</span> 
          Volver al Panel
        </button>
      </div>

      <Form 
        title="Nueva Oferta de Práctica"
        fields={fields}
        buttonText="Publicar en UBB"
        onSubmit={handlePublish}
      />
    </div>
  );
};

export default PublicarOferta;