import React from "react";
import style from "./Navigation.module.css";

import { NavLink } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { ADMIN_SIDE_NAV, POC_SIDE_NAV } from "../../utils";

function Navigation() {
  const { user } = useAuth();
  const NAVBAR = user?.isAdmin ? ADMIN_SIDE_NAV : POC_SIDE_NAV;
  return (
    <div className={style.container}>
      {NAVBAR.map(({ to, linkName, icon }) => (
        <div key={linkName} className={style.menuItems}>
          <NavLink
            className={({ isActive }) =>
              [style.menuItem, isActive ? style.active : null]
                .filter(Boolean)
                .join(" ")
            }
            to={to}
          >
            <img src={icon} className={style.menuIcon} alt="menu-icon" />
            <span>{linkName}</span>
          </NavLink>
        </div>
      ))}
    </div>
  );
}

export default Navigation;
