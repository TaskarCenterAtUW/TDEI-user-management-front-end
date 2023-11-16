import React from "react";
import { Route, Routes } from "react-router-dom";
import Root from "./Root";
import Register from "./Register";
import LoginPage from "./LoginPage";
import RequireAuth from "../components/RequireAuth/RequireAuth";
import Dashboard from "./Dashboards/Dashboard";
import ProjectGroup from "./ProjectGroup";
import Services from "./Services";
import Stations from "./Stations";
import Members from "./Members";
import CreateUpdateStation from "./Stations/CreateUpdateStation";
import CreateUpdateService from "./Services/CreateUpdateService";
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
              <Route path="/projectGroup" element={<ProjectGroup />} />
            )}
            <Route path="/services" element={<Services />} />
            <Route path="/stations" element={<Stations />} />
            {!user?.isAdmin && <Route path="/members" element={<Members />} />}
            <Route path="*" element={<NotFound />} />
            <Route path="station/edit/:id" element={<CreateUpdateStation />}/>       
            <Route path="/CreateUpdateStation" element={<CreateUpdateStation />}/>
            <Route path="station/edit/:id" element={<CreateUpdateStation />}/>       
            <Route path="/CreateUpdateService" element={<CreateUpdateService />}/>   
            <Route path="service/edit/:id" element={<CreateUpdateService />}/>                  
          </Route>
        </Route>
      </>
    </Routes>
  );
};

export default Router;
