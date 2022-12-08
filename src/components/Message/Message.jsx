import "./Message.scss";
import * as cx from "classnames";

export default function Message({ name, message, userId, sessionId}) {
  const classMessage = cx("message", {
    "message_right": userId === sessionId,
  });

  return (
    <div className={classMessage}>
      <div className="message__inner">
        <p>{name}: {message}</p>
      </div>
    </div>
  );
}
