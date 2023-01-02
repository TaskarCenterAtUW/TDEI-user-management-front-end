import React from 'react'
import style from './Navigation.module.css'
import menuIcon from './../../assets/img/layout.svg'

function Navigation() {
  return (
    <div className={style.container}>
        <div className={`${style.menuItem} ${style.active}`}>
          <img src={menuIcon} className={style.menuIcon} />
          <span>Dashboard</span>
        </div>
        <div className={style.menuItem}>
          <img src={menuIcon} className={style.menuIcon} />
          <span>Organization</span>
        </div>
        <div className={style.menuItem}>
          <img src={menuIcon} className={style.menuIcon} />
          <span>Stations</span>
        </div>
        <div className={style.menuItem}>
          <img src={menuIcon} className={style.menuIcon} />
          <span>Services</span>
        </div>
    </div>
  )
}

export default Navigation