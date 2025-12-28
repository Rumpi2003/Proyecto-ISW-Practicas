import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider } from './context/AuthContext'; 

import Login from '@pages/Login';
import Home from '@pages/Home';
// --- (OFERTAS) ---
import PublicarOferta from '@pages/PublicarOferta';
import VerOfertas from '@pages/VerOfertas';

// --- (PAUTAS, EVALUACIONES) ---
import PautasEvaluacion from '@pages/PautasEvaluacion';
import CrearPauta from '@pages/CrearPauta';
import GestionarPautas from '@pages/GestionarPautas';
import EditarPauta from '@pages/EditarPauta';
import GestionarEvaluacionesSupervisor from '@pages/GestionarEvaluacionesSupervisor';
import CrearEvaluacionSupervisor from '@pages/CrearEvaluacionSupervisor';
import EvaluarEvaluacion from '@pages/EvaluarEvaluacion';
import VerEvaluacion from '@pages/VerEvaluacion';
// --- (SOLICITUDES) ---
import SolicitudesMenu from './pages/SolicitudesMenu';
import CrearSolicitud from './pages/CrearSolicitud';
import MisSolicitudes from './pages/MisSolicitudes';
import MenuGestionSolicitudes from './pages/MenuGestionSolicitudes';
import ListaSolicitudesEncargado from './pages/ListaSolicitudesEncargado';
//--- (Usuarios) ---
import UsersMenu from './pages/MenuUsers';
import UserList from './pages/ListaUsers'; 
import CreateUser from './pages/CrearUser';

import Error404 from '@pages/Error404';
import Root from '@pages/Root';
import ProtectedRoute from '@components/ProtectedRoute'; 
import '@styles/styles.css';


const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />, 
    errorElement: <Error404 />,
    children: [
      {
        path: '/',
        element: <Login />
      },
      {
        path: '/auth', 
        element: <Login />
      },
      {
        path: '/home',
        element: (
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        )
      },
      {
        path: '/dashboard', 
        element: (
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        )
      },
      // --- (OFERTAS) ---
      {
        path: '/publicar-oferta', 
        element: (
          <ProtectedRoute>
            <PublicarOferta />
          </ProtectedRoute>
        )
      },
      {
        path: '/ofertas', 
        element: (
          <ProtectedRoute>
            <VerOfertas />
          </ProtectedRoute>
        )
      },
      // --- (SOLICITUDES) ---
      {
        path: '/solicitudes',
        element: (
          <ProtectedRoute>
             <SolicitudesMenu />
          </ProtectedRoute>
        )
      },
      {
        path: '/solicitudes/crear',
        element: (
          <ProtectedRoute>
             <CrearSolicitud />
          </ProtectedRoute>
        )
      },
      {
        path: '/solicitudes/mis-solicitudes',
        element: (
          <ProtectedRoute>
             <MisSolicitudes />
          </ProtectedRoute>
        )
      },
      {
        path: '/dashboard/solicitudes-encargado',
        element: (
          <ProtectedRoute>
             <MenuGestionSolicitudes />
          </ProtectedRoute>
        )
      },
      {
        path: '/dashboard/solicitudes-encargado/:filtro', //'pendientes' o 'historial'
        element: (
          <ProtectedRoute>
             <ListaSolicitudesEncargado />
          </ProtectedRoute>
        )
      },
      // --- (PAUTAS) ---
      {
        path: '/dashboard/pautas', 
        element: (
          <ProtectedRoute>
            <PautasEvaluacion />
          </ProtectedRoute>
        )
      },
      {
        path: '/dashboard/pautas/crear',
        element: (
          <ProtectedRoute>
            <CrearPauta />
          </ProtectedRoute>
        )
      },
      {
        path: '/dashboard/pautas/gestionar',
        element: (
          <ProtectedRoute>
            <GestionarPautas />
          </ProtectedRoute>
        )
      },
      {
        path: '/dashboard/pautas/editar/:id',
        element: (
          <ProtectedRoute>
            <EditarPauta />
          </ProtectedRoute>
        )
      },
      // --- (EVALUACIONES) ---
      {
        path: '/dashboard/evaluaciones/gestionar',
        element: (
          <ProtectedRoute>
            <GestionarEvaluacionesSupervisor />
          </ProtectedRoute>
        )
      },
      {
        path: '/dashboard/evaluaciones/crear',
        element: (
          <ProtectedRoute>
            <CrearEvaluacionSupervisor />
          </ProtectedRoute>
        )
      },
      {
        path: '/dashboard/evaluaciones/evaluar/:id',
        element: (
          <ProtectedRoute>
            <EvaluarEvaluacion />
          </ProtectedRoute>
        )
      },
      {
        path: '/dashboard/evaluaciones/ver/:id',
        element: (
          <ProtectedRoute>
            <VerEvaluacion />
          </ProtectedRoute>
        )
      },
      //--- (USUARIOS) ---
      {
        path: '/dashboard/users',
        element: (
          <ProtectedRoute>
            <UsersMenu /> 
          </ProtectedRoute>
        )
      },
      {
        path: '/dashboard/users/:tipo', 
        element: (
          <ProtectedRoute>
            <UserList /> 
          </ProtectedRoute>
        )
      },
      {
        path: '/dashboard/users/create',
        element: (
          <ProtectedRoute>
            <CreateUser />
          </ProtectedRoute>
        )
      }
    ]
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <RouterProvider router={router} />
  </AuthProvider>
);