import "./Chat.scss";
import Message from "../Message/Message";
import useLocalStorage from "../../hooks/useLocalStorage";
import { useState, useEffect } from "react";

export default function Chat() {
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [isNameSet, setIsNameSet] = useState(false);
  const [localMessages, setLocalMessages] = useLocalStorage("message", []);
  const [error, setError] = useState(false);
  let sessionName = JSON.parse(sessionStorage.getItem("name"));

  useEffect(() => {
    sessionName && setIsNameSet(true);
  }, [sessionName]);

  const addMessage = (message) => {
    const newMessage = {
      id: new Date().getTime(),
      message: message,
      name: name,
      userId: sessionName.id,
    };
    setLocalMessages((localMessages) => [newMessage, ...localMessages]);
  };

  const handleName = () => {
    if (!validation(name)) {
      setError(true);
      return;
    }

    const newName = {
      id: new Date().getTime(),
      name: name,
    };
    sessionStorage.setItem("name", JSON.stringify(newName));
    setIsNameSet(true);
    setError("");
  };

  const handleMessage = () => {
    if (!validation(message)) {
      setError(true);
      return;
    }

    addMessage(message);
    setError(false);
  };

  const validation = (value) => {
    return value.length < 2 ? false : true;
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      isNameSet ? handleMessage() : handleName();
    }
  };

  return (
    <div className="chat">
      <div className="chat__inner">
        <h1 className="chat__header">Сообщения</h1>
        <div className="chat__mesages">
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
            {isNameSet ? (
              <textarea
                id="comment"
                name="comment"
                value={message}
                rows="1"
                cols="1"
                placeholder="Собщение..."
                minLength={3}
                required={true}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                className="chat__input"
              />
            ) : (
              <input
                type="text"
                value={name}
                placeholder="Введите имя"
                onChange={(e) => setName(e.target.value)}
                className="chat__input"
                onKeyDown={handleKeyPress}
              />
            )}
          </div>
          <div className="chat__buttonWrapper">
            <button
              className="chat__button"
              onClick={isNameSet ? handleMessage : handleName}>
              Отправить
            </button>
          </div>
        </div>
        {error && <div>Введите хотя бы два символа</div>}
      </div>
    </div>
  );
}
