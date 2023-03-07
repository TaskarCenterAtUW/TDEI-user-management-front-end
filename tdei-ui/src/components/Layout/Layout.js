import React from "react";
import { useAuth } from "../../hooks/useAuth";
import useIsPoc from "../../hooks/useIsPoc";
import style from "./Layout.module.css";

const Layout = ({ children }) => {
  const isPocUser = useIsPoc();
  const { user } = useAuth();
  if (!isPocUser && !user?.isAdmin) {
    return <div>User is not authorised to access this page</div>;
  }
  return <div className={style.layout}>{children}</div>;
};

export default Layout;
