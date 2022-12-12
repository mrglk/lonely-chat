import "./Chat.scss";
import Message from "../Message/Message";
import { useState, useEffect, useCallback } from "react";
import { Alert, Form, Button } from "react-bootstrap";

export default function Chat() {
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [isLogged, setIsLogged] = useState(false);
  const [error, setError] = useState("");
  const sessionName = JSON.parse(sessionStorage.getItem("name"));

  const chat = JSON.parse(localStorage.getItem("chat") || "[]");
  const [messages, setMessages] = useState(chat);

  useEffect(() => {
    const handleStorageChange = (e) => {
      const { newValue, key } = e;
  
      if (key !== "lastMessage" || !newValue) {
        return;
      }
  
      const newMessage = JSON.parse(newValue);
  
      setMessages((oldMessages) => [newMessage, ...oldMessages]);
    }
  
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  useEffect(() => {
    localStorage.setItem("chat", JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    sessionName && setIsLogged(true);
  }, [sessionName]);

  const handleSetName = () => {
    if (!validation(name)) {
      setError("Минимум два символа");
      return;
    }

    const newName = {
      id: generateId(),
      name: name,
    };
    sessionStorage.setItem("name", JSON.stringify(newName));
    setIsLogged(true);
    setError("");
  };

  const handleAddMessage = useCallback(() => {
    if (!validation(message)) {
      setError("Введите хотя бы два символа");
      return;
    }

    const newMessage = {
      id: generateId(),
      message,
      name: sessionName.name,
      userId: sessionName.id,
      timestamp: new Date().getTime(),
    };
    setMessages((oldMessages) => [newMessage, ...oldMessages]);
    localStorage.setItem("lastMessage", JSON.stringify(newMessage));

    setError("");
    setMessage("");
  }, [message, sessionName]);

  const validation = (value) => {
    return value.length >= 2;
  };

  return (
    <div className="chat">
      <div className="chat__inner">
        {isLogged ? (
          <div className="chat__content">
            <div className="chat__messages">
              {messages?.map((item) => (
                <Message
                  key={item.id}
                  name={item.name}
                  message={item.message}
                  userId={item.userId}
                  sessionId={sessionName?.id}
                  timestamp={item.timestamp}
                />
              ))}
            </div>
            <div className="chat__form">
              <div className="chat__inputWrapper">
                <Form.Group className="mb-2">
                  <Form.Control
                    name="comment"
                    value={message}
                    placeholder="Собщение..."
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAddMessage()}
                    className="chat__input"
                  />
                </Form.Group>
              </div>
              <div className="chat__buttonWrapper">
                <Button
                  className="chat__button"
                  variant="primary"
                  type="submit"
                  onClick={handleAddMessage}>
                  Отправить
                </Button>
              </div>
            </div>
            <div className="chat__error">
              {error && (
                <Alert variant="warning">{error}</Alert>
              )}
            </div>
          </div>
        ) : (
          <div className="chat__login">
            <div className="chat__inputWrapper">
              <Form.Group className="mb-2">
                <Form.Label>Введите имя:</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="chat__input"
                  onKeyDown={(e) => e.key === "Enter" && handleSetName()}
                />
              </Form.Group>
            </div>
            <div className="chat__buttonWrapper">
              <Button
                className="chat__buttonLogin"
                variant="primary"
                type="button"
                onClick={handleSetName}>
                Войти
              </Button>
            </div>
            <div className="chat__error">
              {error && (
                <Alert variant="warning">{error}</Alert>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function generateId() {
  return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
}
