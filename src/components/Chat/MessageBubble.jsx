import ReadReceipts from './ReadReceipts';
import { formatMessageTime } from '../../utils/chatHelpers';
import '../../styles/Chat.css';

const MessageBubble = ({ message, isSent, showTime = true }) => {
  return (
    <div className={`message-wrapper ${isSent ? 'sent' : 'received'}`}>
      <div className={`message-bubble ${isSent ? 'bubble-sent' : 'bubble-received'}`}>
        <p className="message-text">{message.text}</p>
        <div className="message-meta">
          <span className="message-time">{formatMessageTime(message.timestamp)}</span>
          {isSent && <ReadReceipts status={message.status} />}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
