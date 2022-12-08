import "./Message.scss";

export default function Message({ message }) {
  return (
    <div className="message_right">
      <div className="message__inner">
        <p>{message}</p>
      </div>
    </div>
  );
}
