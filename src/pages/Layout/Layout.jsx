import React from 'react'
import { Outlet } from 'react-router'
import Header from '../../components/header/Header'
import Navbar from '../../components/navBar/Navbar'

const Layout = () => {
  return (
    <div>
        {/* <Header /> */}
        {/* <Navbar /> */}
      <Outlet />
    </div>
  )
}

export default Layout
