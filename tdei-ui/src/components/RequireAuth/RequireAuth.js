import React from 'react'
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useLocation } from 'react-router-dom';

function RequireAuth({children}) {
    const { user } = useAuth();
    const location = useLocation();
    if (!user) {
      return <Navigate to="/login" replace state={{ from: location }}/>;
    }
  
    return children;
}

export default RequireAuth