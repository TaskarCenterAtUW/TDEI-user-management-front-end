import React from 'react'
import style from './Navigation.module.css'

function Navigation() {
  return (
    <div className={style.container}>
        <div>DASHBOARD</div>
        <div>ORGANISATION</div>
        <div>STATIONS</div>
        <div>SERVICES</div>
        <div>USER MANGEMENT</div>
    </div>
  )
}

export default Navigation