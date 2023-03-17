import React from "react";
import { useAuth } from "../../hooks/useAuth";
import useIsPoc from "../../hooks/useIsPoc";
import style from "./Layout.module.css";

const Layout = ({ children }) => {
  const isPocUser = useIsPoc();
  const { user } = useAuth();
  if (!isPocUser && !user?.isAdmin) {
    return (
      <div className="p-4">
        <div className="alert alert-warning" role="alert">
          Oops! User doesn't have permission to access this page!
        </div>
      </div>
    )
  }
  return <div className={style.layout}>{children}</div>;
};

export default Layout;
