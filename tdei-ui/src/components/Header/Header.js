import React from 'react';
import style from './Header.module.css';
import tempLogo from './../../assets/img/tdei_logo.svg';
import { useAuth } from '../../hooks/useAuth';
import { Dropdown } from 'react-bootstrap';
import userIcon from './../../assets/img/user.png';
import OrgSwitcher from '../OrgSwitcher';

const Header = () => {
  const { user } = useAuth();
  const authenticated = !!user?.name;
  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    window.location.reload();
  }
  return (
    <div className={style.container}>
      <img src={tempLogo} className={style.logoImage} alt="logo" />
      {authenticated ? <div className={style.rightContainer}>{!user?.isAdmin ? <div><OrgSwitcher /></div> : null}<div>
        <Dropdown align='end'>
          <Dropdown.Toggle as={ProfileImage}>
          </Dropdown.Toggle>
          <Dropdown.Menu align='end'>
            <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div></div> : null}
    </div>
  )
}

const ProfileImage = React.forwardRef(({ children, onClick }, ref) => (
  <div onClick={onClick} ref={ref}>
    <img src={userIcon} className={style.userIcon} alt="user-icon" />
    {children}
  </div>
));

export default Header