import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const PautasEvaluacion = () => {
  const navigate = useNavigate();

	const handleAction = (action) => {
		if (action === 'Crear Pauta') return navigate('/dashboard/pautas/crear');
		if (action === 'Gestionar Pautas') return navigate('/dashboard/pautas/gestionar');
		Swal.fire({
			title: action,
			text: 'Funcionalidad en desarrollo.',
			icon: 'info',
			confirmButtonColor: '#3b82f6'
		});
	};

  return (
	<div className="min-h-screen flex items-center justify-center p-6">
	  <div className="bg-white rounded-3xl shadow-2xl w-full max-w-7xl min-h-[80vh] p-8 md:p-12 flex flex-col">
        
		{/* ENCABEZADO CON BOTÓN "VOLVER" */}
		<div className="flex items-center gap-4 mb-10 border-b border-gray-100 pb-6">
			<button 
				onClick={() => navigate('/dashboard')}
				className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-4 py-2 rounded-xl transition-all font-bold text-xl"
			>
				←
			</button>
			<div>
				<h1 className="text-3xl font-extrabold text-gray-800">
					Pautas de Evaluación
				</h1>
				<p className="text-gray-500">
					Gestiona las pautas utilizadas para evaluar a los estudiantes.
				</p>
			</div>
		</div>

		{/* GRID DE BOTONES ESPECÍFICOS */}
		<div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-4">
            
			{/* 1. CREAR */}
			<div 
				onClick={() => handleAction('Crear Pauta')}
				className="group bg-blue-50 border-2 border-blue-100 rounded-2xl p-8 cursor-pointer hover:bg-blue-600 hover:border-blue-600 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
			>
				<div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
					➕
				</div>
				<h3 className="text-2xl font-bold text-gray-800 group-hover:text-white mb-2">
					Crear Pauta
				</h3>
				<p className="text-gray-500 group-hover:text-blue-100">
					Agregar una nueva pauta de evaluación al sistema.
				</p>
			</div>

			{/* 2. GESTIONAR */}
			<div 
				onClick={() => handleAction('Gestionar Pautas')}
				className="group bg-amber-50 border-2 border-amber-100 rounded-2xl p-8 cursor-pointer hover:bg-amber-600 hover:border-amber-600 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
			>
				<div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
					⚙️
				</div>
				<h3 className="text-2xl font-bold text-gray-800 group-hover:text-white mb-2">
					Gestionar Pautas
				</h3>
				<p className="text-gray-500 group-hover:text-amber-100">
					Ver, editar y eliminar pautas desde un único punto de gestión.
				</p>
			</div>
		</div>
	  </div>
	</div>
  );
};

export default PautasEvaluacion;

