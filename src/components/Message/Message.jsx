import "./Message.scss";
import * as cx from "classnames";

export default function Message({
  name,
  message,
  userId,
  sessionId,
  timestamp,
}) {
  const classMessage = cx("message", {
    message_right: userId === sessionId,
  });

  const time = new Date(timestamp);

  return (
    <div className={classMessage}>
      <div className="message__inner">
        <div className="message__content">
          <div className="message__name">{name}</div>
          <div className="message__message">{message}</div>
          <div className="message_time">
            {time.getHours()}:{time.getMinutes()}
          </div>
        </div>
      </div>
    </div>
  );
}
