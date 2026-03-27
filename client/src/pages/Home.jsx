import React, { useContext, useEffect, useState } from 'react'
import '../styles/home.css'
import Contact from '../components/Contact'
import {useNavigate,Link} from "react-router-dom"
import AuthContext from '../contexts/AuthContext'
import { userAPI } from '../services/api'


export default function Home() {
  const {logout}=useContext(AuthContext)
  const navigator=useNavigate();

  const handleAdd=()=>{
    navigator("/add")
  }

  const handleLogout=async ()=>{
    logout();
  }
  const [contacts,setContacts]=useState([]);

  const handleDelete=async (e,key_id)=>{
      e.preventDefault();
      e.stopPropagation();
      try {
        const res = await userAPI.deleteContact(key_id);
        if(res.ok){
          console.log('successfully deleted');
          setContacts((prev)=>{
            return prev.filter((contact)=>contact.phone!==key_id)
          })
        }
        else
          throw new Error("something went wrong")
      } catch (err) {
        console.log(err)
      }
    }

  useEffect(()=>{
      const fetchContacts = async () => {
        try {
          const res = await userAPI.getContacts();
          const contacts = await res.json();
          setContacts(contacts);
        } catch (err) {
          console.log(err);
        }
      }
      fetchContacts();
    }
  ,[])

  return (
    <>

    <nav id="navbar">
        <div className="logo">Hi!!</div>
        <div className="s">
            <Link to="/home">Home</Link>
            <Link to="/profile">Profile</Link>
            <button onClick={handleLogout}>LogOut</button>
        </div>
    </nav>

    <main id="main">
        <div className="head">
          <div className="sec">Contacts</div>
          <div className="but">
            <button onClick={handleAdd}>Add Contact</button>
          </div>
        </div>
        <div className="content">
          {
            contacts.map((contact)=>{
                return <Contact key={contact.phone} key_id={contact.phone} onDelete={handleDelete}  name={contact.name}/>
            })
          }
        </div>
    </main>
    </>
  )
}