import React from 'react';
import style from './Header.module.css';
import tempLogo from './../../assets/img/tdei-temp-logo.png'

const Header = () => {
  return (
    <div className={style.container}>
        <img src={tempLogo} className={style.logoImage} />
    </div>
  )
}

export default Header