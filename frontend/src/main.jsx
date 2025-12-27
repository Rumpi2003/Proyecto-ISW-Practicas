import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider } from './context/AuthContext'; 

import Login from '@pages/Login';
import Home from '@pages/Home';
import Users from '@pages/Users'; 

// --- IMPORTACIONES TUYAS (OFERTAS) ---
import PublicarOferta from '@pages/PublicarOferta';
import VerOfertas from '@pages/VerOfertas';

// --- IMPORTACIONES DE MAIN (PAUTAS, EVALUACIONES, SOLICITUDES) ---
import PautasEvaluacion from '@pages/PautasEvaluacion';
import CrearPauta from '@pages/CrearPauta';
import GestionarPautas from '@pages/GestionarPautas';
import EditarPauta from '@pages/EditarPauta';
import GestionarEvaluacionesSupervisor from '@pages/GestionarEvaluacionesSupervisor';
import CrearEvaluacionSupervisor from '@pages/CrearEvaluacionSupervisor';
import EvaluarEvaluacion from '@pages/EvaluarEvaluacion';
import VerEvaluacion from '@pages/VerEvaluacion';
import SolicitudesMenu from './pages/SolicitudesMenu';
import CrearSolicitud from './pages/CrearSolicitud';
import MisSolicitudes from './pages/MisSolicitudes';

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
      {
        path: '/dashboard/users', 
        element: (
          <ProtectedRoute>
            <Users />
          </ProtectedRoute>
        )
      },
      // --- TUS RUTAS (OFERTAS) ---
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
      // --- RUTAS DE MAIN (SOLICITUDES) ---
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
      // --- RUTAS DE MAIN (PAUTAS) ---
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
      // --- RUTAS DE MAIN (EVALUACIONES) ---
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
      }
    ]
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <RouterProvider router={router} />
  </AuthProvider>
);