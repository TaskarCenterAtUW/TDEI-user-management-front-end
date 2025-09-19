import React from "react";
import style from "./Header.module.css";
import tempLogo from "./../../assets/img/tdei_logo.svg";
import { useAuth } from "../../hooks/useAuth";
import { Dropdown } from "react-bootstrap";
import userIcon from "./../../assets/img/user.png";
import ProjectGroupSwitcherDropDown from "../ProjectGroupSwitcher/ProjectGroupSwitcherDropDown";
import { useDispatch } from "react-redux";
import { toggle } from "../../store/sideMenuBar.slice";
import resetPasswordIcon from "../../assets/img/reset_pass.svg";
import logoutIcon from "../../assets/img/logout.svg";
import iconMenu from "../../assets/img/icon-mobile-menu.svg";
import ResetPassword from "../ResetPassword/ResetPassword";
import useResetPassword from "../../hooks/useResetPassword";
import { clear } from "../../store";

const Header = () => {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const authenticated = !!user?.name;
  const [showModal, setShowModal] = React.useState(false);

  const handleLogout = () => {
    //Broadcast a 'forceLogout' event to other tabs
    localStorage.setItem("forceLogout", Date.now().toString());
    setTimeout(() => {
      localStorage.removeItem("forceLogout");
    }, 0);
    dispatch(clear());
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    window.location.reload();
  };
  
  const handleResetPassword = () => {
    setShowModal(true);
  };
  return (
    <div className={style.container}>
      <div className={style.imgContainer}>
        {authenticated && (
          <button
            className={`${style.mobileMenuIcon} btn btn-outline-light d-md-none`}
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#mobileSidebar"
          >
            <img src={iconMenu} alt="Menu icon" />
          </button>
        )}
        <img src={tempLogo} className={`${style.logoImage} ${authenticated && style.logoHidden}`} alt="TDEI logo" />
      </div>
      {authenticated ? (
        <div className={style.rightContainer}>
          {!user?.isAdmin ? (
            <div>
              <ProjectGroupSwitcherDropDown />
            </div>
          ) : null}
          <div className={style.horizontalLine}></div>
          <div>
            <Dropdown align="end">
              <Dropdown.Toggle as={ProfileImage}>
                <div>{user?.name}</div>
              </Dropdown.Toggle>
              <Dropdown.Menu align="end">
                <Dropdown.Item onClick={handleResetPassword}>
                  <img src={resetPasswordIcon} className="iconImg" />
                  Reset Password
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item onClick={handleLogout}>
                  <img src={logoutIcon} className="iconImg" />
                  Logout
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>
      ) : null}
      <ResetPassword
        show={showModal}
        onHide={() => setShowModal(false)}
      />
    </div>
  );
};

const ProfileImage = React.forwardRef(({ children, onClick }, ref) => (
  <button
    type="button"
    onClick={onClick}
    ref={ref}
    className={style.userProfile}
  >
    {children}
    <img src={userIcon} className={style.userIcon} alt="user-icon" />
  </button>
));

export default Header;
