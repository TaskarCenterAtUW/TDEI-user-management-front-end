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
import ApplyReferralCode from "../Referral/ApplyReferralCode";
import ConfirmationNumberOutlinedIcon from '@mui/icons-material/ConfirmationNumberOutlined';
import MobileSidebar from "../Navigation/MobileSidebar";

const Header = () => {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const authenticated = !!user?.name;
  const [showModal, setShowModal] = React.useState(false);
  const [showReferralModal, setShowReferralModal] = React.useState(false);
  const [showSidebar, setShowSidebar] = React.useState(false);

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
    <header className={style.container}>
      <div className={style.imgContainer}>
        {/* Sidebar toggle button for mobile view */}
        {authenticated && (
          <>
            <button
              className={`${style.mobileMenuIcon} btn btn-outline-light d-md-none`}
              type="button"
              onClick={() => setShowSidebar(true)}
              aria-label="Open main menu"
            >
              <img src={iconMenu} alt="" aria-hidden="true" />
            </button>
            <MobileSidebar 
              show={showSidebar}
              onHide={() => setShowSidebar(false)} 
            />
          </>
        )}
        {/* End - Sidebar toggle button for mobile view */}
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
                <span className="visually-hidden">Signed in as {user?.name}. Open account menu</span>
                <div aria-hidden="true">{user?.name}</div>
              </Dropdown.Toggle>
              <Dropdown.Menu align="end" aria-label="User account menu">
                <Dropdown.Item onClick={handleResetPassword}>
                  <img src={resetPasswordIcon} className="iconImg" alt="" aria-hidden="true" />
                  Reset Password
                </Dropdown.Item>
                 <Dropdown.Divider aria-hidden="true" />
                 <Dropdown.Item onClick={() => setShowReferralModal(true)}>
                 <ConfirmationNumberOutlinedIcon className="iconImg" style={{ fontSize: '18px', color:'#8A93A3' }} aria-hidden="true" />
                  Join With Referral Code
                </Dropdown.Item>
                <Dropdown.Divider aria-hidden="true" />
                <Dropdown.Item onClick={handleLogout}>
                  <img src={logoutIcon} className="iconImg" alt="" aria-hidden="true" />
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
       <ApplyReferralCode show={showReferralModal} onHide={() => setShowReferralModal(false)} />
    </header>
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
    <img src={userIcon} className={style.userIcon} alt="" />
  </button>
));

export default Header;
