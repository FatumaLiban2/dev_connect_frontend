// Updated MessageInput with typing indicator
import { useState, useEffect, useRef } from 'react';
import { useChat } from '../../context/ChatContext';
import '../../styles/Chat.css';

const MessageInput = ({ disabled }) => {
  const { sendMessage, sendTypingIndicator } = useChat();
  const [text, setText] = useState('');
  const typingTimeoutRef = useRef(null);
  const isTypingRef = useRef(false);

  useEffect(() => {
    return () => {
      // Cleanup: send "not typing" when component unmounts
      if (isTypingRef.current) {
        sendTypingIndicator(false);
      }
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [sendTypingIndicator]);

  const handleTextChange = (e) => {
    setText(e.target.value);
    
    // Send typing indicator
    if (!isTypingRef.current && e.target.value.trim()) {
      sendTypingIndicator(true);
      isTypingRef.current = true;
    }
    
    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    // Set timeout to stop typing indicator after 1 second of no typing
    typingTimeoutRef.current = setTimeout(() => {
      if (isTypingRef.current) {
        sendTypingIndicator(false);
        isTypingRef.current = false;
      }
    }, 1000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim() && !disabled) {
      sendMessage(text);
      setText('');
      
      // Stop typing indicator
      if (isTypingRef.current) {
        sendTypingIndicator(false);
        isTypingRef.current = false;
      }
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form className="message-input-container" onSubmit={handleSubmit}>
      <div className="input-wrapper">
        <input
          type="text"
          value={text}
          onChange={handleTextChange}
          onKeyPress={handleKeyPress}
          placeholder="Type a message..."
          disabled={disabled}
          className="message-input"
        />
        <button 
          type="submit" 
          disabled={!text.trim() || disabled}
          className="send-button"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M22 2L11 13M22 2L15 22L11 13M22 2L2 8L11 13"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </form>
  );
};

export default MessageInput;
