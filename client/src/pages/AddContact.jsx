import React from 'react'
import { useNavigate } from 'react-router-dom'
import { userAPI } from '../services/api'

export default function AddContact() {
    const navigator=useNavigate();
    const handleSubmit=async (e)=>{
        e.preventDefault();
        try {
            await userAPI.addContact(e.target.name.value, e.target.phno.value);
            navigator("/home");
        } catch (err) {
            console.log(err);
            navigator("/home");
        }
    }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Name</label>
        <input type="text" name="name" id="" />
        <label htmlFor="phno">Phone</label>
        <input type="text" name="phno" id="" />
        <button type="submit">Add</button>
      </form>
    </div>
  )
}