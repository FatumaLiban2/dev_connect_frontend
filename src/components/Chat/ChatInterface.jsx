// ChatInterface.jsx - Backend Integration Ready
import React, { useState, useEffect, useRef } from 'react';
import websocketService from '../../services/WebSocketService';
import messagingApi from '../../services/messagingApi';
import '../../styles/Chat.css';

const ChatInterface = ({ currentUserId, recipientUserId, recipientName }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Debug logging
  useEffect(() => {
    console.log('🔍 ChatInterface Props:', {
      currentUserId,
      recipientUserId,
      recipientName,
      currentUserIdType: typeof currentUserId,
      recipientUserIdType: typeof recipientUserId
    });
  }, [currentUserId, recipientUserId, recipientName]);

  // Initialize WebSocket connection
  useEffect(() => {
    let mounted = true;

    const initWebSocket = async () => {
      try {
        await websocketService.connect(currentUserId);
        
        if (!mounted) return;
        
        setIsConnected(true);

        // Subscribe to incoming messages
        websocketService.subscribeToMessages((message) => {
          if (
            (message.senderId === recipientUserId && message.receiverId === currentUserId) ||
            (message.senderId === currentUserId && message.receiverId === recipientUserId)
          ) {
            setMessages((prev) => {
              // Avoid duplicates
              if (prev.some(m => m.id === message.id)) {
                return prev;
              }
              return [...prev, message];
            });
            scrollToBottom();
            
            // Mark incoming message as read immediately
            if (message.senderId === recipientUserId && message.receiverId === currentUserId) {
              messagingApi.markMessagesAsRead([message.id])
                .then(() => {
                  // Update message status in state
                  setMessages(prev => 
                    prev.map(msg => 
                      msg.id === message.id 
                        ? { ...msg, status: 'read' } 
                        : msg
                    )
                  );
                })
                .catch(error => console.error('Failed to mark message as read:', error));
            }
          }
        });

        // Subscribe to typing indicators
        websocketService.subscribeToTyping((indicator) => {
          if (indicator.senderId === recipientUserId) {
            setIsTyping(indicator.isTyping);
            
            // Auto-hide typing indicator after 3 seconds
            setTimeout(() => setIsTyping(false), 3000);
          }
        });

        // Set user online
        await messagingApi.updateUserStatus(currentUserId, 'online');
        
      } catch (error) {
        console.error('WebSocket connection failed:', error);
        setIsConnected(false);
      }
    };

    initWebSocket();

    return () => {
      mounted = false;
      websocketService.disconnect();
      messagingApi.updateUserStatus(currentUserId, 'offline').catch(console.error);
    };
  }, [currentUserId, recipientUserId]);

  // Load conversation history
  useEffect(() => {
    const loadMessages = async () => {
      try {
        setIsLoading(true);
        const history = await messagingApi.getConversation(
          currentUserId,
          recipientUserId
        );
        setMessages(history);
        scrollToBottom();
        
        // Mark all received messages as read
        const unreadMessageIds = history
          .filter(msg => msg.receiverId === currentUserId && msg.status !== 'read')
          .map(msg => msg.id);
        
        if (unreadMessageIds.length > 0) {
          try {
            await messagingApi.markMessagesAsRead(unreadMessageIds);
            
            // Update local state to reflect read status
            setMessages(prevMessages => 
              prevMessages.map(msg => 
                unreadMessageIds.includes(msg.id) 
                  ? { ...msg, status: 'read' } 
                  : msg
              )
            );
          } catch (error) {
            console.error('Failed to mark messages as read:', error);
          }
        }
      } catch (error) {
        console.error('Failed to load messages:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadMessages();
  }, [currentUserId, recipientUserId]);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const messageText = newMessage.trim();
    setNewMessage('');

    try {
      if (isConnected) {
        // Send via WebSocket
        websocketService.sendMessage(currentUserId, recipientUserId, messageText);
        
        // Stop typing indicator
        websocketService.sendTypingIndicator(currentUserId, recipientUserId, false);
      } else {
        // Fallback to REST API
        const message = {
          senderId: currentUserId,
          receiverId: recipientUserId,
          text: messageText
        };
        
        const sentMessage = await messagingApi.sendMessage(message);
        setMessages((prev) => [...prev, sentMessage]);
        scrollToBottom();
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      alert('Failed to send message. Please try again.');
    }
  };

  const handleTyping = (text) => {
    setNewMessage(text);

    if (isConnected && text.trim()) {
      websocketService.sendTypingIndicator(currentUserId, recipientUserId, true);

      // Clear previous timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // Stop typing indicator after 1 second of inactivity
      typingTimeoutRef.current = setTimeout(() => {
        websocketService.sendTypingIndicator(currentUserId, recipientUserId, false);
      }, 1000);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (isLoading) {
    return (
      <div className="chat-loading">
        <div className="spinner"></div>
        <p>Loading conversation...</p>
      </div>
    );
  }

  return (
    <div className="chat-container">
      {/* Chat Header */}
      <div className="chat-header">
        <div className="chat-header-info">
          <h2>{recipientName}</h2>
          <span className={`connection-status ${isConnected ? 'connected' : 'disconnected'}`}>
            {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
          </span>
        </div>
      </div>

      {/* Messages List */}
      <div className="messages-list">
        {messages.length === 0 ? (
          <div className="no-messages">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((message, index) => {
            // Ensure both IDs are numbers for comparison
            const messageSenderId = Number(message.senderId);
            const currentUserIdNum = Number(currentUserId);
            const isSent = messageSenderId === currentUserIdNum;
            
            // Debug each message
            if (index === 0) {
              console.log('📨 Message Debug:', {
                text: message.text,
                senderId: message.senderId,
                senderIdType: typeof message.senderId,
                messageSenderIdNum: messageSenderId,
                currentUserId: currentUserId,
                currentUserIdType: typeof currentUserId,
                currentUserIdNum: currentUserIdNum,
                isSent: isSent,
                comparison: `${messageSenderId} === ${currentUserIdNum} = ${messageSenderId === currentUserIdNum}`
              });
            }
            
            return (
              <div
                key={message.id || index}
                className={`message ${isSent ? 'sent' : 'received'}`}
              >
                <div className="message-bubble">
                  <div className="message-text">{message.text}</div>
                  <div className="message-meta">
                    <span className="timestamp">
                      {message.timestamp
                        ? new Date(message.timestamp).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          })
                        : 'Sending...'}
                    </span>
                    {isSent && (
                      <span className={`status ${message.status || 'sent'}`}>
                        {message.status === 'read' && '✓✓'}
                        {message.status === 'delivered' && '✓✓'}
                        {message.status === 'sent' && '✓'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
        
        {isTyping && (
          <div className="typing-indicator">
            <div className="typing-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
            <span className="typing-text">{recipientName} is typing...</span>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="message-input-container">
        <div className="message-input">
          <textarea
            value={newMessage}
            onChange={(e) => handleTyping(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            rows="1"
          />
          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className="send-button"
          >
            <span>Send</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
