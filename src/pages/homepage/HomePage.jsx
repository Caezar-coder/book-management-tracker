import React from 'react'
import './HomePage.css'
import Navbar from '../../components/navBar/Navbar'
import BookTable from '../../components/books/Books'

const HomePage = () => {
  return (
    <div className='homePageBody'>
      <Navbar />
      <BookTable />
    </div>
  )
}

export default HomePage
