// frontend/src/main.jsx
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from '@pages/Login';
import Home from '@pages/Home';
import Users from '@pages/Users'; 
import Error404 from '@pages/Error404';
import Root from '@pages/Root';
import ProtectedRoute from '@components/ProtectedRoute'; 
import '@styles/styles.css';
import SolicitudesMenu from './pages/SolicitudesMenu';
import CrearSolicitud from './pages/CrearSolicitud';
import MisSolicitudes from './pages/MisSolicitudes';

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
      }
    ]
  }
]);

//enrutador
ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
);