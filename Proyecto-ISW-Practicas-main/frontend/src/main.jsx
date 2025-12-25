import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from '@pages/Login';
import Home from '@pages/Home';
import Users from '@pages/Users';
import Solicitudes from '@pages/Solicitudes'; 
import Error404 from '@pages/Error404';
import Root from '@pages/Root';
import ProtectedRoute from '@components/ProtectedRoute'; 
import '@styles/styles.css';
import Evaluacion from '@pages/Evaluacion';

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
      // --- GESTIÓN DE SOLICITUDES ---
      {
        path: '/encargado/solicitudes',
        element: (
          <ProtectedRoute>
            <Solicitudes />
          </ProtectedRoute>
        )
      },
      {
        path: '/encargado/solicitudes/:id', // Los dos puntos : indican que "id" es variable
        element: (
          <ProtectedRoute>
            <Evaluacion />
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