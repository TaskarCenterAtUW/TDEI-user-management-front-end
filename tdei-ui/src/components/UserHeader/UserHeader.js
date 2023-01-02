import React from 'react'
import style from './UserHeader.module.css';
import { useAuth } from '../../hooks/useAuth';

const UserHeader = ({ authorizedUser }) => {
  const { user } = useAuth();
  const role = user.isAdmin ? 'TDEI Admin' : 'POC';
  return (
    <div className={style.userHeader}>
      {authorizedUser ? <> <div>{`Welcome back, ${user.name} !`}</div>
        <div className={style.roleText}>{role}</div></> : <div>Welcome to TDEI,  contact tdei admin or your organization POC to get roles assigned.</div>}

    </div>
  )
}

export default UserHeader