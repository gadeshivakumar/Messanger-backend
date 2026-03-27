import React, { useEffect, useState,useRef} from 'react'
import "../styles/chatroom.css"
import { useLocation } from 'react-router-dom'
import {io} from 'socket.io-client';
import ChatMessage from '../components/ChatMessage';
import { userAPI } from '../services/api';
export default function ChatRoom() {

  const locator=useLocation();
  const [message,setMessage]=useState("");
  const {profile,name,phone}=locator.state||{};
  const [messages,setMessages]=useState([])
  const socket=useRef(null);
  const handleSend=()=>{
    socket.current.emit('send_message',{phone:phone,message:message});
    setMessage("")
  }

  useEffect(()=>{
    socket.current=io("https://messanger.shiva.jo3.org",{
      withCredentials:true,
    })
    console.log(socket.current);
    const fetchMessages = async () => {
      try {
        const res = await userAPI.getMessages(phone);
        const messages = await res.json();
        setMessages(messages);
      } catch (err) {
        console.log(err);
      }
    }
    fetchMessages();

    socket.current.on('akn',(msg)=>{
      const curMsg={
        n:2,
        message:msg.message,
        id:msg._id,
        time:msg.timestamp
      }
      console.log(msg);
      setMessages(prev=>[...prev,curMsg])
    })

    socket.current.on("sent",(msg)=>{
      const curMsg={
        n:1,
        message:msg.message,
        id:msg._id,
        time:msg.timestamp
      }
      console.log(msg);
      setMessages(prev=>[...prev,curMsg])
    })

    socket.current.on("deleted",async ()=>{
      try {
        const res = await userAPI.getMessages(phone);
        const messages = await res.json();
        setMessages(messages);
      } catch (err) {
        console.log(err);
      }
    })
    return ()=>{
      socket.current.off("akn");
      socket.current.off("sent");
      socket.current.off("deleted");
      socket.current.disconnect();
    }

  },[])

  return (
    <div className='room'>
      <div className="header">
        <div className="profile" style={{backgroundImage:`url(${profile})`,
            backgroundPosition:"center",
            backgroundRepeat:"no-repeat",
            backgroundSize:"cover"
        }}></div>
        <div className="name">{name}</div>
      </div>
      <div className="chats">
        {messages.map((m)=>{
          if(m.n==1){
            return <ChatMessage classname={"mboxleft"} socket={socket.current} message={m.message} key={m.id} id={m.id} phone={phone} n={m.n}/>
          }
          else{
            return  <ChatMessage classname={"mboxright"} socket={socket.current} message={m.message} key={m.id} id={m.id} phone={phone} n={m.n}/>
          }

        })}
      </div>
      <div className="text">
        <input type="text" name="chat" id="" value={message} onChange={(e)=>setMessage(e.target.value)} />
        <button id="send" onClick={handleSend}>send</button>
      </div>
    </div>
  )
}
