import { createBrowserRouter } from "react-router-dom";
import Root from '../pages/Root';
import Login from '../pages/Login';
import Home from '../pages/Home';
import Users from '../pages/Users';
import CreateUser from '../pages/CreateUser';
import Solicitudes from '../pages/Solicitudes';
import GestionPracticas from '../pages/GestionPracticas';
import Evaluacion from '../pages/Evaluacion';
import Historial from '../pages/Historial';
import Error404 from '../pages/Error404';
import ProtectedRoute from '../components/ProtectedRoute';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <Root />,
        errorElement: <Error404 />,
        children: [
            // Rutas públicas
            { path: '/', element: <Login /> },
            { path: '/auth', element: <Login /> },

            // Dashboard y Home
            {
                path: '/home',
                element: <ProtectedRoute><Home /></ProtectedRoute>
            },
            {
                path: '/dashboard',
                element: <ProtectedRoute><Home /></ProtectedRoute>
            },

            // Gestión de Usuarios (Administración)
            {
                path: '/dashboard/users',
                element: <ProtectedRoute><Users /></ProtectedRoute>
            },
            {
                path: '/dashboard/users/create',
                element: <ProtectedRoute><CreateUser /></ProtectedRoute>
            },

            // Flujo del Encargado (Solicitudes y Evaluaciones)
            {
                path: '/encargado/solicitudes',
                element: <ProtectedRoute><Solicitudes /></ProtectedRoute>
            },
            {
                path: '/encargado/practicas',
                element: <ProtectedRoute><GestionPracticas /></ProtectedRoute>
            },
            {
                path: '/encargado/solicitudes/:id',
                element: <ProtectedRoute><Evaluacion /></ProtectedRoute>
            },
            {
                path: '/encargado/historial',
                element: <ProtectedRoute><Historial /></ProtectedRoute>
            }
        ]
    }
]);