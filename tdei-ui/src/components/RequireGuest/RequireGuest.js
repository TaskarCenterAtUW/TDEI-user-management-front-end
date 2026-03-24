import React from "react";
import { matchPath, Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { buildShareDatasetPath, SHOW_SHARE_DATASET_FLOW } from "../../utils";

const RequireGuest = () => {
  const { user } = useAuth();
  const location = useLocation();

  // If already logged in, don't allow guest pages
  if (user) {
    if (SHOW_SHARE_DATASET_FLOW) {
      const loginShareMatch = matchPath(
        "/login/share-dataset/:data_type/:tdei_dataset_id",
        location.pathname
      );
      const registerShareMatch = matchPath(
        "/register/share-dataset/:data_type/:tdei_dataset_id",
        location.pathname
      );
      const shareMatch = loginShareMatch || registerShareMatch;

      if (shareMatch?.params?.data_type && shareMatch?.params?.tdei_dataset_id) {
        return (
          <Navigate
            to={buildShareDatasetPath(
              shareMatch.params.data_type,
              shareMatch.params.tdei_dataset_id
            )}
            replace
          />
        );
      }
    }

    const to = (location.state && location.state.from) || "/";
    return <Navigate to={to} replace />;
  }
  return <Outlet />;
};

export default RequireGuest;
