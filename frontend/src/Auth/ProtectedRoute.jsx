// ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  // Replace with your actual authentication check
  const auth = JSON.parse(localStorage.getItem('auth')); // Example using localStorage
  if (!auth) {
    return <Navigate to="/"/>;
  }

  return children;
};

export default ProtectedRoute;