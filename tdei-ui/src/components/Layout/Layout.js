import React from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import useIsPoc from "../../hooks/useIsPoc";
import { isShareDatasetRoute } from "../../utils";
import style from "./Layout.module.css";

const Layout = ({ children }) => {
  const isPocUser = useIsPoc();
  const { user } = useAuth();
  const { pathname } = useLocation();
  const isDashboardLikeRoute = pathname === "/" || isShareDatasetRoute(pathname);

  if (!isPocUser && !user?.isAdmin && !isDashboardLikeRoute) {
    return (
      <div className="p-4">
        <div className="alert alert-warning" role="alert">
          Oops! User doesn't have permission to access this page!
        </div>
      </div>
    );
  }
  return <div className={style.layout}>{children}</div>;
};

export default Layout;
