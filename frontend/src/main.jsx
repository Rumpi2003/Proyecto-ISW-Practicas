// frontend/src/main.jsx
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from '@pages/Login';
import Home from '@pages/Home';
import Users from '@pages/Users'; // <--- 1. IMPORTANTE: Importamos la nueva página
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
      }
    ]
  }
]);

//enrutador
ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
);