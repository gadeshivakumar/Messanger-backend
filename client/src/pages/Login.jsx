import React, { useContext, useState } from 'react'
import {useNavigate}  from "react-router-dom"
import "../styles/login.css"
import AuthContext from '../contexts/AuthContext';
export default function Login() {
    const navigator=useNavigate();
    const [errMsg,setErrMsg]=useState("")
    const {login} =useContext(AuthContext)
    const handleSubmit= async (e)=>{
        e.preventDefault();
        const result = await login(e.target.phoneInput.value, e.target.passwordInput.value);

        if(result.success){
          console.log(result.user)  
          navigator("/");
        }
        else{
            if(result.message.includes('404') || result.message.includes('Register')){
                setErrMsg("Please Register before trying to login");
            }
            else{
                setErrMsg(result.message || "Invalid credentials")
            }
        }
    }

    const handleBack=()=>{
      navigator('/')
    }
  return (
    <div>
      {errMsg && <p className="error-message">{errMsg}</p>}
      <form name="loginForm" id="loginForm" onSubmit={handleSubmit}>
        <label htmlFor="phoneInput" name="phoneLabel">Phone:</label>
        <input type="text" id="phoneInput" name="phone" />

        <label htmlFor="passwordInput" name="passwordLabel">Password:</label>
        <input type="password" id="passwordInput" name="password" />

        <button type="submit" name="submitBtn">Login</button>
      </form>
      <button type="button" onClick={handleBack} className='back'>Back</button>
    </div>
  )
}