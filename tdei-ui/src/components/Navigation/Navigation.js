import React from "react";
import style from "./Navigation.module.css";
import menuIcon from "./../../assets/img/layout.svg";
import { NavLink } from "react-router-dom";

function Navigation() {
  return (
    <div className={style.container}>
      <NavLink className={({ isActive }) =>
        [style.menuItem, isActive ? style.active : null].filter(Boolean).join(" ")
      } to="/">
        <img src={menuIcon} className={style.menuIcon} alt="menu-icon" />
        <span>Dashboard</span>
      </NavLink>
      <NavLink className={({ isActive }) =>
        [style.menuItem, isActive ? style.active : null].filter(Boolean).join(" ")
      } to="/organization">
        <img src={menuIcon} className={style.menuIcon} alt="menu-icon" />
        <span>Organization</span>
      </NavLink>
      <NavLink className={({ isActive }) =>
        [style.menuItem, isActive ? style.active : null].filter(Boolean).join(" ")
      } to="/stations">
        <img src={menuIcon} className={style.menuIcon} alt="menu-icon" />
        <span>Stations</span>
      </NavLink>
      <NavLink className={({ isActive }) =>
        [style.menuItem, isActive ? style.active : null].filter(Boolean).join(" ")
      } to="/services">
        <img src={menuIcon} className={style.menuIcon} alt="menu-icon" />
        <span>Services</span>
      </NavLink>
    </div>
  );
}

export default Navigation;
