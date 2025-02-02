import React from 'react'
import { createHashRouter } from 'react-router'
import { RouterProvider } from 'react-router-dom'
import Login from './pages/Login/Login'
import SignUp from './pages/Signup/SignUp'
import HomePage from './pages/homepage/HomePage'
import Layout from './pages/Layout/Layout'


const App = () => {
  const router = createHashRouter([
    {
      path: 'home',
      element: <Layout />,
      children:[
        {
          index: true,
          element: <HomePage />
        }
      ]
    },
    {
      path: '',
      element: <Login />
    },
    {
      path: 'SignUp',
      element: <SignUp />
    },
    {
      path: '*', 
      element: <div>404: Page Not Found</div>,
    },
  ])
 
  return (
    <div className='MainBody'>
      <RouterProvider router={router}/>
    </div>
  )
}

export default App
