import React from "react";
import style from "./Navigation.module.css";
import { Offcanvas } from 'bootstrap';
import { NavLink } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { ADMIN_SIDE_NAV, POC_SIDE_NAV } from "../../utils";
import tdeiLogo from "./../../assets/img/tdei_logo.svg";

function Navigation() {
  const { user } = useAuth();
  const NAVBAR = user?.isAdmin ? ADMIN_SIDE_NAV : POC_SIDE_NAV;
  const handleLinkClick = () => {
    const offcanvasEl = document.querySelector('.offcanvas.show');
    if (offcanvasEl) {
      const offcanvas = Offcanvas.getInstance(offcanvasEl);
      offcanvas?.hide();
    }
  }
  return (
    <>
      <nav id="sidebar" className={`${style.bsNavBlock} col-md-3 col-lg-2 d-none d-md-block sidebar`}>
        <div className="position-sticky pt-3">
          <ul className="nav flex-column">
            {NAVBAR.map(({ to, linkName, icon }) => (
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
            ))}
          </ul>
        </div>
      </nav>

      {/* Offcanvas Sidebar for mobile */}
      <div className="offcanvas offcanvas-start" tabindex="-1" id="mobileSidebar">
        <div className={style.offcanvasHeader}>
          <img src={tdeiLogo} className={style.logoSidebar} alt="TDEI logo" />
          <button type="button" className="btn-close btn-close-white" data-bs-dismiss="offcanvas"></button>
        </div>
        <div className={style.offcanvasBody}>
          <ul className="nav flex-column">
            {NAVBAR.map(({ to, linkName, icon }) => (
              <NavLink
                className={({ isActive }) =>
                  [style.menuItem, isActive ? style.active : null]
                    .filter(Boolean)
                    .join(" ")
                }
                to={to}
                onClick={handleLinkClick}
              >
                <img src={icon} className={style.menuIcon} alt="menu-icon" />
                <span>{linkName}</span>
              </NavLink>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}

export default Navigation;
