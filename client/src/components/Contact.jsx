import React, { useEffect, useState } from 'react'
import '../styles/contact.css'
import { useNavigate } from 'react-router-dom'
import { userAPI } from '../services/api'

export default function Contact({name,key_id,onDelete}) {

  const navigator=useNavigate();
  const [prof,setProf]=useState({})

  useEffect(()=>{
      const fetchUserDetails = async () => {
        try {
          const res = await userAPI.getUserDetails(key_id);
          const data = await res.json();
          setProf(data);
        } catch (err) {
          console.log(err);
        }
      }
      fetchUserDetails();
    },[])

  const handleClick=()=>{
    navigator("/chat",{state:{profile:prof.profile,name,phone:key_id}})
  }
  return (
    <div className="card" onClick={handleClick}>
      <img className="proi" src={prof.profile} alt="profile" />
      <div className="box">
        <h1 title={name}>{name}</h1>
      </div>
      <button type="button" onClick={(e)=>onDelete(e,key_id)}>Delete</button>
    </div>
  )
}