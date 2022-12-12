import "./Message.scss";
import * as cx from "classnames";
import { getTimeForMessage } from "../../utils/helpers";

export default function Message({
  name,
  message,
  timestamp,
  isOutgoing
}) {
  const classMessage = cx("message", {
    message_right: isOutgoing,
  });

  return (
    <div className={classMessage}>
      <div className="message__inner">
        <div className="message__content">
          <div className="message__name">{name}</div>
          <div className="message__message">{message}</div>
          <div className="message_time">{getTimeForMessage(timestamp)}</div>
        </div>
      </div>
    </div>
  );
}
