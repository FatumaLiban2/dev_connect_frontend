import { useEffect, useRef } from 'react';
import { useChat } from '../../context/ChatContext';
import ChatHeader from './ChatHeader';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';
import { groupMessagesByDate, scrollToBottom } from '../../utils/chatHelpers';
import '../../styles/Chat.css';

const ChatContainer = () => {
  const { 
    messages, 
    sendMessage, 
    currentUserId, 
    otherUserStatus,
    isTyping,
    isConnected 
  } = useChat();

  const messagesEndRef = useRef(null);
  const messageContainerRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom(messageContainerRef);
  }, [messages]);

  const handleSendMessage = (text) => {
    sendMessage(text);
  };

  const groupedMessages = groupMessagesByDate(messages);

  return (
    <div className="chat-container">
      <ChatHeader 
        userName="Alex Developer" 
        userStatus={otherUserStatus}
      />

      <div className="messages-container" ref={messageContainerRef}>
        {!isConnected && (
          <div className="connection-status">
            <p>Connecting...</p>
          </div>
        )}

        {Object.entries(groupedMessages).map(([date, msgs]) => (
          <div key={date} className="message-group">
            <div className="date-separator">
              <span>{date}</span>
            </div>
            {msgs.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
                isSent={message.senderId === currentUserId}
              />
            ))}
          </div>
        ))}

        {isTyping && (
          <div className="typing-indicator">
            <div className="typing-bubble">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <MessageInput onSend={handleSendMessage} disabled={!isConnected} />
    </div>
  );
};

export default ChatContainer;
