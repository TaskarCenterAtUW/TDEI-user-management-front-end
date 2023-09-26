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
import Members from "./Members";
import Maps from "./Maps";
import { useAuth } from "../hooks/useAuth";
import NotFound from "./NotFound";

const Router = () => {
  const { user } = useAuth();

  return (
    <Routes>
      <>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<Register />} />
        <Route element={<RequireAuth />}>
          <Route path="/" element={<Root />}>
            <Route path="/" element={<Dashboard />} />
            {user?.isAdmin && (
              <Route path="/organization" element={<Organization />} />
            )}
            <Route path="/services" element={<Services />} />
            <Route path="/stations" element={<Stations />} />
            {!user?.isAdmin && <Route path="/members" element={<Members />} />}
            <Route path="*" element={<NotFound />} />
            <Route path="station/edit/:id" element={<Maps />}/>       
            <Route path="/maps" element={<Maps />}/>          
          </Route>
        </Route>
      </>
    </Routes>
  );
};

export default Router;
