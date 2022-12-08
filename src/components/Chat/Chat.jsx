import "./Chat.scss";
import Message from "../Message/Message";
import useLocalStorage from "../../hooks/useLocalStorage";
import { useState, useEffect, useCallback } from "react";

export default function Chat() {
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [isLogged, setIsLogged] = useState(false);
  const [localMessages, setLocalMessages] = useLocalStorage("message", []);
  const [error, setError] = useState("");
  let sessionName = JSON.parse(sessionStorage.getItem("name"));

  console.log(sessionName)
  
  useEffect(() => {
    sessionName && setIsLogged(true);
  }, [sessionName]);

  const handleName = () => {
    if (!validation(name)) {
      setError("Введите хотя бы два символа");
      return;
    }

    const newName = {
      id: new Date().getTime(),
      name: name,
    };
    sessionStorage.setItem("name", JSON.stringify(newName));
    setIsLogged(true);
    setError("");
  };

  const addMessage = useCallback(
    () => {
      const newMessage = {
        id: new Date().getTime(),
        message: message,
        name: sessionName.name,
        userId: sessionName.id,
      };
      setLocalMessages((localMessages) => [newMessage, ...localMessages]);
    },
    [message, setLocalMessages, sessionName],
  );

  const handleMessage = useCallback(
    () => {
      if (!validation(message)) {
        setError("Введите хотя бы два символа");
        return;
      }
  
      addMessage(message);
      setError("");
    },
    [addMessage, message],
  );

  const validation = (value) => {
    return value.length >= 2;
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      isLogged ? handleMessage() : handleName();
    }
  };

  return (
    <div className="chat">
      <div className="chat__inner">
        {isLogged ? (
          <div className="chat__content">
            <h1 className="chat__header">Чат</h1>
            <div className="chat__messages">
              {localMessages.map((item) => (
                <Message
                  key={item.id}
                  name={item.name}
                  message={item.message}
                  userId={item.userId}
                  sessionId={sessionName?.id}
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
                  cols="1"
                  placeholder="Собщение..."
                  minLength={2}
                  required={true}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={handleKeyPress}
                  className="chat__input"
                />
              </div>
              <div className="chat__buttonWrapper">
                <button className="chat__button" onClick={handleMessage}>
                  Отправить
                </button>
              </div>
            </div>
            {error && <div>{error}</div>}
          </div>
        ) : (
          <div className="chat__login">
            <div className="chat__inputWrapper">
              <label htmlFor="name">Введите имя:</label>
              <input
                type="text"
                name="name"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="chat__input"
                onKeyDown={handleKeyPress}
              />
            </div>
            <div className="chat__buttonWrapper">
              <button className="chat__button" onClick={handleName}>
                Отправить
              </button>
            </div>
            {error && <div>{error}</div>}
          </div>
        )}
      </div>
    </div>
  );
}
