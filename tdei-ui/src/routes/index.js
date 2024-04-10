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
import CreateJobService from "./Jobs/createJob";
import { useAuth } from "../hooks/useAuth";
import NotFound from "./NotFound";
import UploadDataset from "./UploadDataset/UploadDataset";
import Jobs from "./Jobs";

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
            <Route path="/jobs" element={<Jobs/>}/>
            <Route path="/stations" element={<Stations />} />
            {!user?.isAdmin && <Route path="/members" element={<Members />} />}
            <Route path="*" element={<NotFound />} />
            <Route path="station/edit/:id" element={<CreateUpdateStation />}/>       
            <Route path="/CreateUpdateStation" element={<CreateUpdateStation />}/>
            <Route path="station/edit/:id" element={<CreateUpdateStation />}/>       
            <Route path="/CreateUpdateService" element={<CreateUpdateService />}/>   
            <Route path="service/edit/:id/:serviceType" element={<CreateUpdateService />}/>  
            <Route path="/UploadDataset" element={<UploadDataset/>}/>
            <Route path="/CreateJob" element={<CreateJobService />}/>
          </Route>
        </Route>
      </>
    </Routes>
  );
};

export default Router;
