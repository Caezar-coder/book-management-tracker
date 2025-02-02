import React from 'react'
import './Login.css'
import { useNavigate } from 'react-router'

const Login = () => {

    const navigate = useNavigate()
   const handleSignUp=()=>{
        navigate('/SignUp')
    }
    
  const handleGoHome=()=>{
    navigate('./home')
}

  return (
    <div className='loginBody'>
        <div className="login">
        <div className="loginLogo">
            <img src="/black-logo.png" alt="" />
        </div>
        <h1>Welcome Back!!!</h1>
        <h3 className='field'>Please enter your credentials to log in</h3>

        <div className="inputArea">
            <input type="text" placeholder='Username' />
            <input type="text" placeholder='Password' />
            <p>Forgot password?</p>
        </div>
        <button className='signIn' onClick={handleGoHome}>SIGN IN</button>
      </div>
      <div className="signupNav">
        <div className="logoHolder">
        <img src="/management-logo.png" alt="" className='logo'/>
        <h1>Bookworm</h1>
        <h3>Libary</h3>
        </div>
       <div className="text">
       <p>New to our platform? Sign up now.</p>
       <button className='signUp' onClick={handleSignUp}>SIGN UP</button>
       </div>
      </div>
      
    </div>
  )
}

export default Login
