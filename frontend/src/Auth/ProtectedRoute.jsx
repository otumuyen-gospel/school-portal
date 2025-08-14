// ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  // Replace with your actual authentication check
  const {access} = localStorage.getItem('auth'); // Example using localStorage

  if (!access) {
    return <Navigate to="/"/>;
  }

  return <>{children}</>;
};

export default ProtectedRoute;