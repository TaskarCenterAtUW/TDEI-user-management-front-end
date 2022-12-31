import React from 'react';
import style from './Header.module.css';
import tempLogo from './../../assets/img/tdei-temp-logo.png';
import { useAuth } from '../../hooks/useAuth';
import { Dropdown } from 'react-bootstrap';

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
      <img src={tempLogo} className={style.logoImage} />
      {authenticated ? <div>
        <Dropdown align='end'>
          <Dropdown.Toggle as={ProfileImage}>
          </Dropdown.Toggle>
          <Dropdown.Menu align='end'>
            <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div> : null}
    </div>
  )
}

const ProfileImage = React.forwardRef(({ children, onClick }, ref) => (
  <div className={style.profileImage} onClick={onClick} ref={ref}>{children}</div>
));

export default Header