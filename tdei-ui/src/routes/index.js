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
import CreateJobService from "./Jobs/CreateJob";
import { useAuth } from "../hooks/useAuth";
import NotFound from "./NotFound";
import Datasets from "./Datasets";
import UploadDataset from "./UploadDataset/UploadDataset";
import Jobs from "./Jobs";
import EditMetadata from "./EditMetaData/EditMetaData";
import CloneDataset from "./CloneDataset/CloneDataset";
import ForgotPassword from "./ForgotPassword/ForgotPassword";
import PasswordResetConfirm from "../components/VerifyComponent/PasswordResetConfirm";
import EmailVerification from "../components/VerifyComponent/EmailVerification";
import ProjectGroupSwitch from "../components/ProjectGroupSwitcher/ProjectGroupSwitch";
import Feedback from "./Feedback";
import Reports from "./Reports/Reports";
import Referral from "./Referral/Referral";
import CreateUpdateReferralCode from "./Referral/CreateUpdateReferralCode";
import RequireGuest from "../components/RequireGuest/RequireGuest";
import InviteInstructions from "./Referral/InviteInstructions";
import AppLinkFallback from "../AppLinkFallback";
import { SHOW_REFERRALS } from "../utils/helper";

const Router = () => {
  const { user } = useAuth();

  return (
    <Routes>
      <>
        <Route element={<RequireGuest />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/ForgotPassword" element={<ForgotPassword />} />
          <Route path="/passwordReset" element={<PasswordResetConfirm />} />
          <Route path="/emailVerify" element={<EmailVerification />} />
          {SHOW_REFERRALS && (
            <>
              <Route path="/invite-instructions" element={<InviteInstructions />} />
              <Route path="/app-link/*" element={<AppLinkFallback />} />
            </>
          )}
        </Route>
        <Route element={<RequireAuth />}>
          <Route path="/" element={<Root />}>
            <Route path="/" element={<Dashboard />} />
            {user?.isAdmin && (
              <Route path="/projectGroup" element={<ProjectGroup />} />
            )}
            <Route path="/services" element={<Services />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/stations" element={<Stations />} />
            <Route path="/datasets" element={<Datasets />} />
            <Route path="/feedback" element={<Feedback />} />
            {user?.isAdmin && (
              <Route path="/reports" element={<Reports />} />
            )}
            <Route
              path="/projectGroupSwitch"
              element={<ProjectGroupSwitch />}
            />
            <Route path="/members" element={<Members />} />
            <Route path="*" element={<NotFound />} />
            <Route path="station/edit/:id" element={<CreateUpdateStation />} />
            <Route
              path="/CreateUpdateStation"
              element={<CreateUpdateStation />}
            />
            <Route path="station/edit/:id" element={<CreateUpdateStation />} />
            <Route
              path="/CreateUpdateService"
              element={<CreateUpdateService />}
            />
            <Route
              path="service/edit/:id/:serviceType"
              element={<CreateUpdateService />}
            />
            <Route path="/UploadDataset" element={<UploadDataset />} />
            <Route path="/CreateJob" element={<CreateJobService />} />
            <Route path="/EditMetadata" element={<EditMetadata />} />
            <Route path="/CloneDataset" element={<CloneDataset />} />
            {SHOW_REFERRALS && (
              <>
                <Route path="/:id/referralCodes" element={<Referral />} />
                <Route path="/:id/referralCodes/new" element={<CreateUpdateReferralCode />} />
                <Route path="/:id/referralCodes/:codeId/edit" element={<CreateUpdateReferralCode />} />
              </>
            )}
          </Route>
        </Route>
      </>
    </Routes>
  );
};

export default Router;
