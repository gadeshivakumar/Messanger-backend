import {React,useEffect,useState} from 'react'
import "../styles/profile.css"
import { useNavigate } from 'react-router-dom'
import { useContext } from 'react';
import AuthContext from '../contexts/AuthContext';
import { userAPI } from '../services/api';

export default function Profile() {

  const [prof,setProf]=useState({})
  const navigator=useNavigate();
  const {user}=useContext(AuthContext);
  const handleUpdate=async (e)=>{
    e.preventDefault();
    const formData=new FormData();
    formData.append("dp",e.target.dp.files[0])
    try{
        const res = await userAPI.updateProfile(formData);
        setProf(await res.json());
    }
    catch(err){
      console.log(err)
    }

  }

  useEffect(()=>{
    const fetchUserDetails = async () => {
      try {
        const res = await userAPI.getUserDetails(user.phone);
        const data = await res.json();
        setProf(data);
      } catch (err) {
        console.log(err);
      }
    }
    fetchUserDetails();
  },[user.phone])

   const handleBack=()=>{
      navigator('/home')
    }

return (
  <div className="whatsapp-profile">
    <form className="profile-header" onSubmit={handleUpdate}>
      <img src={prof.profile || "/constact.jpg"} alt="Profile Photo" className="profile-img" />
      <label htmlFor="dp" className="file-label">Change Photo</label>
      <input
        type="file"
        name="dp"
        id="dp"
        accept="image/*"
        className="file-input"
      />
      <button type="submit" className="update-btn">Update Profile</button>
    </form>
    <div className="profile-info">
      <div className="info-block">
        <label>Name</label>
        <p>{prof.name}</p>
      </div>
      <div className="info-block">
        <label>Phone</label>
        <p>{prof.phone}</p>
      </div>
    </div>
     <button type="button" onClick={handleBack} className='back'>Back</button>
  </div>
);
}