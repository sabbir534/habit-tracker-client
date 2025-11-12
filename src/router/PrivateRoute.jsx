import React, { useContext } from "react"; // 1. FIXED: Import 'useContext'
import { AuthContext } from "../context/AuthContext";
import { Navigate, useLocation } from "react-router-dom"; // 2. FIXED: Import from 'react-router-dom' and add 'useLocation'
import Loading from "../components/Loading"; // Assuming you have this component

const PrivateRoute = ({ children }) => {
  // 3. FIXED: Use 'useContext', not 'use'
  const { user, loading } = useContext(AuthContext);
  // 4. ADDED: Get the current location
  const location = useLocation();

  if (loading) {
    // Show a loading spinner while auth state is being checked
    return <Loading />;
  }

  if (user) {
    // If user is logged in, show the component they want to access
    return children;
  }

  // 5. FIXED: If user is not logged in, redirect to /login
  // We pass the *current location* in the 'state' prop.
  // LoginPage will be able to access this and redirect back.
  return <Navigate to="/login" state={{ from: location }} replace></Navigate>;
};

export default PrivateRoute;
