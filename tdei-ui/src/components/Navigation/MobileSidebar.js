import React from "react";
import style from "./Navigation.module.css";
import Offcanvas from 'react-bootstrap/Offcanvas';
import { NavLink } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { ADMIN_SIDE_NAV, POC_SIDE_NAV } from "../../utils";
import tdeiLogo from "./../../assets/img/tdei_logo.svg";
import useIsPoc from "../../hooks/useIsPoc";

function MobileSidebar({ show, onHide}) {
  const { user } = useAuth();
  const isPocUser = useIsPoc();
  const BASE_NAV = user?.isAdmin ? ADMIN_SIDE_NAV : POC_SIDE_NAV;
  // If the user is a POC, show all links. If not, hide the Feedback link.
  const NAVBAR = BASE_NAV.filter(item =>
    isPocUser ? true : item.to !== "/feedback"
  );

  return (
    <>
      {/* Offcanvas Sidebar for mobile */}
      <Offcanvas 
        show={show}
        onHide={onHide}
        placement="start"
        id="mobileSidebar"
      >
        <Offcanvas.Header closeButton closeVariant="white" className={style.offcanvasHeader}>
          <Offcanvas.Title>
            <img src={tdeiLogo} className={style.logoSidebar} alt="TDEI logo" />
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className={style.offcanvasBody}>
          <ul className="nav flex-column">
            {NAVBAR.map(({ to, linkName, icon }) => (
              <li key={to}>
                <NavLink
                  className={({ isActive }) =>
                    [style.menuItem, isActive ? style.active : null]
                      .filter(Boolean)
                      .join(" ")
                  }
                  to={to}
                  onClick={onHide}
                >
                  <img src={icon} className={style.menuIcon} alt="" aria-hidden="true" />
                  <span>{linkName}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}

export default MobileSidebar;
