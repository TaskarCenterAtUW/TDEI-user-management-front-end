import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const RequireGuest = () => {
  const { user } = useAuth();
  const location = useLocation();

  // If already logged in, don't allow guest pages
  if (user) {
    const to = (location.state && location.state.from && location.state.from.pathname) || "/";
    return <Navigate to={to} replace />;
  }
  return <Outlet />;
};

export default RequireGuest;
