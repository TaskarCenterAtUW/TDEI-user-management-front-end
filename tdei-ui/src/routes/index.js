import React from "react";
import { Route, Routes } from "react-router-dom";
import Root from "./Root";
import Register from "./Register";
import LoginPage from "./LoginPage";
import RequireAuth from "../components/RequireAuth/RequireAuth";
import Dashboard from "./Dashboards/Dashboard";
import Organization from "./Organization";
import Services from "./Services";
import Stations from "./Stations";

const Router = () => {
  return (
    <Routes>
      <>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<Register />} />
        <Route element={<RequireAuth />}>
          <Route path="/" element={<Root />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/organization" element={<Organization />} />
            <Route path="/services" element={<Services />} />
            <Route path="/stations" element={<Stations />} />
          </Route>
        </Route>
      </>
    </Routes>
  );
};

export default Router;
