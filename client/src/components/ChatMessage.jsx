import React from 'react';
import '../styles/chatroom.css';
import { userAPI } from '../services/api';

export default function ChatMessage({ classname, message, id, phone, n, socket }) {

  const handleChange = async (event) => {
    if (event === "delete") {
      try {
        await userAPI.deleteMessage(phone, n, id);
        socket.emit("del");
      } catch (err) {
        console.log(err);
      }
    }
  };

  const isLeft = classname === 'mboxleft';

  return (
    <div className={`message-container ${isLeft ? 'left' : 'right'}`}>

      {isLeft && <div className="bubble">{message}</div>}

      <div className="menu">
          ⋮
          <div className="menu-options">
            <div onClick={() => handleChange("delete")}>Delete</div>
          </div>
        </div>

      {!isLeft && <div className="bubble">{message}</div>}
    </div>
  );
}