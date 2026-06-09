import React from "react";
import { matchPath, Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { SHOW_REFERRALS, buildShareDatasetPath } from "../../utils";

const RequireGuest = () => {
  const { user } = useAuth();
  const location = useLocation();
  const searchParams = React.useMemo(
    () => new URLSearchParams(location.search),
    [location.search]
  );
  const referralCode = (
    searchParams.get("code")
    || searchParams.get("referral_code")
    || searchParams.get("refferal_code")
    || ""
  ).trim();

  // If already logged in, don't allow guest pages
  if (user) {
  
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

    const to = (location.state && location.state.from) || "/";
    if (SHOW_REFERRALS && referralCode) {
      return (
        <Navigate
          to={to}
          replace
          state={{
            ...(typeof location.state === "object" && location.state !== null ? location.state : {}),
            loggedInReferralCode: referralCode,
          }}
        />
      );
    }
    return <Navigate to={to} replace />;
  }
  return <Outlet />;
};

export default RequireGuest;
