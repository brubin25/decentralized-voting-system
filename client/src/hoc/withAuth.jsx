import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function withAuth(Component, allowedRoles = []) {

  return (props)=> {

    const { user } = useAuth();

    if (!user) {
      return <Navigate to="/login" replace />;
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
      return <Navigate to="/login" replace />;
    }
    return <Component {...props} />;
  };
}

