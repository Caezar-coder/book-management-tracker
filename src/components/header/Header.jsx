import React from 'react'
import { FaRegUserCircle } from "react-icons/fa";
import './Header.css'
import { useNavigate } from 'react-router';

const Header = () => {
   
  return (
    <div className='headerBody'>
      <div className="headerWrapper">
       <div className="headerLogo">
       <img src="/management-logo.png" alt="" />
       </div>
        <div className="profile">
            <FaRegUserCircle style={{fontSize: '30px'}}/>
            <h3>User</h3>
        </div>
      </div>
    </div>
  )
}

export default Header
