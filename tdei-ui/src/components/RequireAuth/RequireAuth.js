import React from "react";
import { matchPath, Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useLocation } from "react-router-dom";
import { buildShareDatasetAuthPath, isShareDatasetRoute, SHOW_SHARE_DATASET_FLOW } from "../../utils";

function RequireAuth() {
  const { user } = useAuth();
  const location = useLocation();
  if (!user) {
    if (SHOW_SHARE_DATASET_FLOW && isShareDatasetRoute(location.pathname)) {
      const shareMatch = matchPath(
        "/share-dataset/:data_type/:tdei_dataset_id",
        location.pathname
      );

      if (shareMatch?.params?.data_type && shareMatch?.params?.tdei_dataset_id) {
        return (
          <Navigate
            to={buildShareDatasetAuthPath(
              "/login",
              shareMatch.params.data_type,
              shareMatch.params.tdei_dataset_id
            )}
            replace
          />
        );
      }

      return (
        <Navigate
          to="/login"
          replace
        />
      );
    }
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}

export default RequireAuth;
