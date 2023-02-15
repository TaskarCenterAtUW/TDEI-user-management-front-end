import React from "react";
import { Route, Routes } from "react-router-dom";
import Root from "./Root";
import Register from "./Register";
import LoginPage from "./LoginPage";
import RequireAuth from "../components/RequireAuth/RequireAuth";
import Dashboard from "./Dashboards/Dashboard";

const Router = () => {
  return (
    <Routes>
      <>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<Register />} />
        <Route element={<RequireAuth />}>
          <Route path="/" element={<Root />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/organization" element={<div>organization</div>} />
            <Route path="/services" element={<div>services</div>} />
            <Route path="/stations" element={<div>stations</div>} />
          </Route>
        </Route>
      </>
    </Routes>
  );
};

export default Router;
