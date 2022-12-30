import React from 'react'
import style from './UserHeader.module.css';

const UserHeader = () => {
  return (
    <div className={style.userHeader}>
        <div className=''>Welcome back, Jhon Doe !</div>
        <div className={style.roleText}>TDEI Admin</div>
    </div>
  )
}

export default UserHeader