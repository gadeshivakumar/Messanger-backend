import {React,useState} from 'react'
import { useNavigate } from 'react-router-dom'
import "../styles/register.css"
export default function Register() {
    const navigator=useNavigate();
    const [errMsg,setErrMsg]=useState("")
    const handleSubmit=async (e)=>{
        e.preventDefault();
        try{
            const res=await fetch("https://messanger-backend-cu42.onrender.com/api/auth/register",{
                method:"POST",
                credentials:"include",
                headers:{"Content-Type":"application/json"},
                body:JSON.stringify({
                    username:e.target.usernameInput.value,
                    phone:e.target.phoneInput.value,
                    password:e.target.passwordInput.value
                }),
            })
            if(res.ok){
                navigator("/login")
            }
            else{
                setErrMsg("User Already Exists!!");
                navigator("/register")
            }
        }
        catch{
            setErrMsg("server is busy right now try after some time")
            navigator("/register")
        }

    }

     const handleBack=()=>{
      navigator('/')
    }
  return (
    <div>
         {errMsg && <p className="error-message">{errMsg}</p>}
     <form name="registerForm" id="registerForm" onSubmit={handleSubmit}>
        <label htmlFor="usernameInput" name="usernameLabel">Username:</label>
        <input type="text" id="usernameInput" name="username" />

        <label htmlFor="passwordInput" name="passwordLabel">Password:</label>
        <input type="password" id="passwordInput" name="password" />

        <label htmlFor="phoneInput" name="phoneLabel">Phone:</label>
        <input type="text" id="phoneInput" name="phno" />

        <button type="submit" name="submitBtn">Register</button>
      </form>
     <button type="button" onClick={handleBack} className="back" >Back</button>
    </div>
  )
}