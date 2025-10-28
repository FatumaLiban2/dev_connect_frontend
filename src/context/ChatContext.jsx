import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const ChatContext = createContext();

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within ChatProvider');
  }
  return context;
};

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [otherUserStatus, setOtherUserStatus] = useState('online'); // online/offline
  const currentUserId = 'user1';
  const otherUserId = 'user2';

  // Initialize connection - Will be replaced with real WebSocket
  useEffect(() => {
    // TODO: Connect to real WebSocket service
    // Example: wsService.connect().then(() => { setIsConnected(true); });
    
    setIsConnected(true);
    loadInitialMessages();

    // TODO: Subscribe to WebSocket messages
    // Example: const unsubscribe = wsService.onMessage((data) => { ... });

    return () => {
      // TODO: Clean up WebSocket connection
      // Example: wsService.disconnect();
    };
  }, []);

  // Load initial mock messages
  const loadInitialMessages = () => {
    const initialMessages = [
      {
        id: '1',
        senderId: otherUserId,
        receiverId: currentUserId,
        text: "Hey! I saw your project proposal. It looks interesting!",
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        status: 'read'
      },
      {
        id: '2',
        senderId: currentUserId,
        receiverId: otherUserId,
        text: "Thanks! I'm looking for a developer to help build it.",
        timestamp: new Date(Date.now() - 3500000).toISOString(),
        status: 'read'
      },
      {
        id: '3',
        senderId: otherUserId,
        receiverId: currentUserId,
        text: "I have experience with React and Node.js. What's the timeline?",
        timestamp: new Date(Date.now() - 3400000).toISOString(),
        status: 'read'
      },
      {
        id: '4',
        senderId: currentUserId,
        receiverId: otherUserId,
        text: "Looking to get it done in about 6 weeks. Does that work for you?",
        timestamp: new Date(Date.now() - 3300000).toISOString(),
        status: 'read'
      },
    ];
    setMessages(initialMessages);
  };

  // Send a message
  const sendMessage = useCallback(async (text) => {
    if (!text.trim()) return;

    const newMessage = {
      id: Date.now().toString(),
      senderId: currentUserId,
      receiverId: otherUserId,
      text,
      timestamp: new Date().toISOString(),
      status: 'sent'
    };

    // TODO: Send message through WebSocket
    // Example: wsService.sendMessage(newMessage);
    
    setMessages(prev => [...prev, newMessage]);

    // TODO: Remove auto-response when backend is ready
    // This is just for testing the UI
  }, [currentUserId, otherUserId]);

  // Update message status
  const updateMessageStatus = (messageId, status) => {
    setMessages(prev => 
      prev.map(msg => 
        msg.id === messageId ? { ...msg, status } : msg
      )
    );
  };

  // Mark message as read
  const markAsRead = useCallback((messageId) => {
    // TODO: Send read receipt through WebSocket
    // Example: wsService.markAsRead(messageId);
    updateMessageStatus(messageId, 'read');
  }, []);

  const value = {
    messages,
    sendMessage,
    markAsRead,
    isConnected,
    isTyping,
    currentUserId,
    otherUserId,
    otherUserStatus,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
