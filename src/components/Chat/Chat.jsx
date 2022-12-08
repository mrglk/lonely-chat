import "./Chat.scss";
import Message from "../Message/Message";
import useLocalStorage from "../../hooks/useLocalStorage";
import { useState } from "react";

export default function Chat() {
  const [localMessages, setLocalMessages] = useLocalStorage("message", []);
  const [message, setMessage] = useState("");
  const [name, setName] = useState("Маша");

  const addMessage = (message) => {
    if (message) {
      const newMessage = {
        id: new Date().getTime(),
        name: name,
        message: message,
      };
      setLocalMessages((localMessages) => [newMessage, ...localMessages]);
    }
  };

  const handleClick = () => {
    addMessage(message);
      // setNameToLocal(name);
      // setMessage("");
  }
  
console.log(localMessages)
// понять, как определять направление сообщений
// при вводе имени sessionStorage.setItem('name', name);
// при заборе имени sessionStorage.getItem('name')
    return (
      <div className="chat">
        <div className="chat__inner">
          <h1 className="chat__header">Сообщения</h1>
          <div className="chat__mesages">
          {localMessages.map((item) => (
          <Message
            key={item.id}
            // name={item.name}
            message={item.message}
          />
        ))}
          </div>
          <div className="chat__form">
            <div className="chat__inputWrapper">
              <textarea
              id="comment"
              name="comment"
              value={message}
              rows="1"
              cols="50"
              placeholder="Собщение..."
              minLength={3}
              required={true}
              onChange={(e) => setMessage(e.target.value)}
              // onKeyDown={handleKeyPress}
              className="chat__input"
              />
            </div>
            <div className="chat__buttonWrapper">
              <button className="chat__button" onClick={handleClick}>Отправить</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  