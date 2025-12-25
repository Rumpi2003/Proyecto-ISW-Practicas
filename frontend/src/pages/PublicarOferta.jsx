import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Form from '../components/Form';
import { useAuth } from '../context/AuthContext';
// VOLVEMOS A IMPORTAR EL NOMBRE ORIGINAL
import { getCarreras } from '../services/carrera.service.js'; 

const PublicarOferta = () => {
  const [carrerasOptions, setCarrerasOptions] = useState([]);
  const navigate = useNavigate();
  const { user } = useAuth(); 

  useEffect(() => {
    const fetchCarreras = async () => {
      const id = user?.facultad?.id; 

      // MANTENEMOS EL BLOQUEO DE SEGURIDAD
      if (!id) return;

      try {
        // LLAMAMOS A LA FUNCIÓN ORIGINAL (PERO QUE AHORA TIENE LA LÓGICA NUEVA)
        const data = await getCarreras(id);
        
        if (data) {
          const formatted = data.map(c => ({
            label: c.nombre, 
            value: c.id
          }));
          setCarrerasOptions(formatted);
        }
      } catch (error) {
        console.error("Error cargando carreras:", error);
      }
    };

    fetchCarreras();
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
      name: "descripcion",
      label: "Descripción de la Práctica",
      fieldType: "textarea",
      rows: 8,
      placeholder: "Detalla las responsabilidades, requisitos y beneficios...",
      required: true,
      minLength: 30
    },
    {
      name: "carreraId",
      label: `Carrera Destinada (${user?.facultad?.nombre || 'Cargando...'})`, 
      fieldType: "select", 
      options: carrerasOptions,
      required: true
    }
  ];

  const handlePublish = (formData) => {
    console.log("Datos para enviar:", formData);
    alert("¡Oferta enviada (simulación)!");
    navigate('/home'); 
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