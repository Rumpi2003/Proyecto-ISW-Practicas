// frontend/src/pages/Home.jsx
import { useAuth } from '@context/AuthContext';
import HomeEncargado from './HomeEncargado';
import HomeEstudiante from './HomeEstudiante';
import HomeSupervisor from './HomeSupervisor';

const Home = () => {
  const { user } = useAuth();

  if (user?.rol === 'encargado') {
    return <HomeEncargado />;
  }

  if (user?.rol === 'estudiante') {
    return <HomeEstudiante />;
  }

  if (user?.rol === 'supervisor') {
    return <HomeSupervisor />;
  }

  //no tiene rol
  return (
    <div className="min-h-screen flex items-center justify-center">
        <p>Rol de usuario desconocido. Contacte al administrador.</p>
    </div>
  );
};

export default Home;