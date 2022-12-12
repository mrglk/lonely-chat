import "./Chat.scss";
import Message from "../Message/Message";
import { useState, useEffect, useCallback } from "react";
import Alert from "react-bootstrap/Alert";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

export default function Chat() {
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [isLogged, setIsLogged] = useState(false);
  const [error, setError] = useState("");
  let sessionName = JSON.parse(sessionStorage.getItem("name"));

  const chat = JSON.parse(localStorage.getItem("chat") || "[]");
  const [messages, setMessages] = useState(chat);

  useEffect(() => {
    window.addEventListener("storage", function (e) {
      const { newValue, key } = e;

      if (key !== "lastMessage" || !newValue) {
        return;
      }

      const newMessage = JSON.parse(newValue);

      setMessages((oldMessages) => {
        if (oldMessages.find(({ id }) => id === newMessage.id)) {
          return oldMessages;
        }

        return [newMessage, ...oldMessages];
      });
    });
  }, []);

  useEffect(() => {
    localStorage.setItem("chat", JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    sessionName && setIsLogged(true);
  }, [sessionName]);

  const handleName = () => {
    if (!validation(name)) {
      setError("Введите хотя бы два символа");
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

  const handleMessage = useCallback(() => {
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
                    onKeyDown={(e) => e.key === "Enter" && handleMessage()}
                    className="chat__input"
                  />
                </Form.Group>
              </div>
              <div className="chat__buttonWrapper">
                <Button
                  className="chat__button"
                  variant="primary"
                  type="submit"
                  onClick={handleMessage}>
                  Отправить
                </Button>
              </div>
            </div>
            <div className="chat__error">
              {error && (
                <Alert variant="warning">Введите хотя бы два символа</Alert>
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
                  onKeyDown={(e) => e.key === "Enter" && handleName()}
                />
              </Form.Group>
            </div>
            <div className="chat__buttonWrapper">
              <Button
                className="chat__buttonLogin"
                variant="primary"
                type="button"
                onClick={handleName}>
                Войти
              </Button>
            </div>
            <div className="chat__error">
              {error && (
                <Alert variant="warning">Введите хотя бы два символа</Alert>
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
