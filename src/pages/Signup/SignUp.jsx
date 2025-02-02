import React from 'react'
import './SignUp.css'
import { useNavigate } from 'react-router'

const SignUp = () => {
  const navigate = useNavigate()
  const handleSignIn=()=>{
       navigate('/')
  }
 
  const handleHome=()=>{
       navigate('/home')
   }
  return (
    <div className='signUpBody'>
     <div className="signInNav">
        <div className="signInlogoHolder">
        <img src="/management-logo.png" alt="" className='signLogo'/>
        <h1>Bookworm</h1>
        <h3>Libary</h3>
        </div>
       <div className="signInText">
       <p>Already have Account? Sign In now.</p>
       <button className='signInBtn' onClick={handleSignIn}>SIGN IN</button>
       </div>
       </div>
       <div className="loginNav">
        <div className="loginHead">
          <h1>Sign up</h1>
          <img src="/black-logo.png" alt="" />
        </div>
        <p style={{fontSize:'18px'}}>Please provide your information to sign up.</p>
        <div className="loginInputArea">
          <input type="text" placeholder='Name' className='loginInput' />
          <input type="text" placeholder='Email' className='loginInput'/>
          <div className="dataInput">
          <input type="text" placeholder='Username' className='datatext' />
          <input type="text" placeholder='Password' className='datatext' />
        </div>
        </div>
        <button className='mySignUp' onClick={handleHome}>SIGN UP</button>
       </div>
     </div>
  )
}

export default SignUp
