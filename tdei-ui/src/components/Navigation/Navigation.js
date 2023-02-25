import React from "react";
import style from "./Navigation.module.css";
import dashboardIcon from "./../../assets/img/dashboard-icon.svg";
import servicesIcon from "./../../assets/img/services-icon.svg";
import stationsIcon from "./../../assets/img/stations-icon.svg";
import organizationIcon from "./../../assets/img/organization-icon.svg";
import { NavLink } from "react-router-dom";

const SIDE_NAV = [
  {
    linkName: "Dashboard",
    to: "/",
    icon: dashboardIcon,
  },
  {
    linkName: "Organization",
    to: "/organization",
    icon: organizationIcon,
  },
  {
    linkName: "Services",
    to: "/services",
    icon: servicesIcon,
  },
  {
    linkName: "Stations",
    to: "/stations",
    icon: stationsIcon,
  },
];

function Navigation() {
  return (
    <div className={style.container}>
      {SIDE_NAV.map(({ to, linkName, icon }) => (
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
