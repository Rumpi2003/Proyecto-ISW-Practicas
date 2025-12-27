// frontend/src/main.jsx
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from '@pages/Login';
import Home from '@pages/Home';
import Users from '@pages/Users'; // <--- 1. IMPORTANTE: Importamos la nueva página
// import PautasEvaluacion removed: using GestionarPautas directly
import GestionarEvaluaciones from '@pages/GestionarEvaluaciones';
import CrearPauta from '@pages/CrearPauta';
import GestionarPautas from '@pages/GestionarPautas';
import EditarPauta from '@pages/EditarPauta';
import GestionarEvaluacionesSupervisor from '@pages/GestionarEvaluacionesSupervisor';
import CrearEvaluacionSupervisor from '@pages/CrearEvaluacionSupervisor';
import EvaluarEvaluacion from '@pages/EvaluarEvaluacion';
import VerEvaluacion from '@pages/VerEvaluacion';
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
      {
        path: '/dashboard/gestionar-evaluaciones',
        element: (
          <ProtectedRoute>
            <GestionarEvaluaciones />
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
      }
      ,
      {
        path: '/dashboard/pautas/gestionar',
        element: (
          <ProtectedRoute>
            <GestionarPautas />
          </ProtectedRoute>
        )
      }
      ,
      {
        path: '/dashboard/pautas/editar/:id',
        element: (
          <ProtectedRoute>
            <EditarPauta />
          </ProtectedRoute>
        )
      }
      ,
      {
        path: '/dashboard/evaluaciones/gestionar',
        element: (
          <ProtectedRoute>
            <GestionarEvaluacionesSupervisor />
          </ProtectedRoute>
        )
      }
      ,
      {
        path: '/dashboard/evaluaciones/crear',
        element: (
          <ProtectedRoute>
            <CrearEvaluacionSupervisor />
          </ProtectedRoute>
        )
      }
      ,
      {
        path: '/dashboard/evaluaciones/evaluar/:id',
        element: (
          <ProtectedRoute>
            <EvaluarEvaluacion />
          </ProtectedRoute>
        )
      }
      ,
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

//enrutador
ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
);