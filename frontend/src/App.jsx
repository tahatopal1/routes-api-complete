import { createBrowserRouter, RouterProvider, Navigate, Outlet } from 'react-router-dom';
import Layout from './components/Layout';
import Locations from './pages/Locations';
import Transportations from './pages/Transportations';
import RoutesPage from './pages/Routes';
import Login from './pages/Login';
import { AuthProvider, useAuth } from './context/AuthContext';

// Add a ProtectedRoute wrapper
const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <Outlet />;
};

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/",
    element: <ProtectedRoute />,
    children: [
      {
        path: "/",
        element: <Layout />,
        children: [
          {
            index: true,
            element: <Navigate to="/locations" replace />
          },
          {
            path: "locations",
            element: <Locations />
          },
          {
            path: "transportations",
            element: <Transportations />
          },
          {
            path: "routes",
            element: <RoutesPage />
          }
        ]
      }
    ]
  }
]);

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
