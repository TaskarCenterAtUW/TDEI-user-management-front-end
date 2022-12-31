import React from 'react'
import style from './UserHeader.module.css';
import { useAuth } from '../../hooks/useAuth';

const UserHeader = () => {
  const { user } = useAuth();
  const role = user.isAdmin ? 'TDEI Admin' : 'POC'
  return (
    <div className={style.userHeader}>
      <div className=''>{`Welcome back, ${user.name} !`}</div>
      <div className={style.roleText}>{role}</div>
    </div>
  )
}

export default UserHeader