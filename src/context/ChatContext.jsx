// Updated ChatContext.jsx with proper message sending and WebSocket integration
import { createContext, useContext, useState, useEffect } from 'react';
import ApiService from '../services/ApiService';
import WebSocketService from '../services/WebSocketService';

const ChatContext = createContext();

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

export const ChatProvider = ({ children, currentUserId, otherUserId, projectId }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [typing, setTyping] = useState(false);
  const [otherUserStatus, setOtherUserStatus] = useState('offline');

  // Initialize WebSocket connection when component mounts
  useEffect(() => {
    if (!currentUserId) return;

    console.log(`🔌 Connecting to WebSocket for user ${currentUserId}...`);
    
    try {
      WebSocketService.connect(currentUserId);
      console.log('✅ WebSocket connection initiated');
    } catch (error) {
      console.error('❌ Failed to connect to WebSocket:', error);
    }

    return () => {
      console.log('🔌 Disconnecting WebSocket...');
      WebSocketService.disconnect();
    };
  }, [currentUserId]);

  // Mock messages for fallback
  const mockMessages = [
    {
      id: 1,
      senderId: otherUserId,
      receiverId: currentUserId,
      text: 'Hi! I saw your project and I\'m interested in working on it.',
      content: 'Hi! I saw your project and I\'m interested in working on it.',
      timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
      status: 'READ'
    },
    {
      id: 2,
      senderId: currentUserId,
      receiverId: otherUserId,
      text: 'Great! When can you start?',
      content: 'Great! When can you start?',
      timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      status: 'READ'
    },
    {
      id: 3,
      senderId: otherUserId,
      receiverId: currentUserId,
      text: 'I can start tomorrow. Should we discuss the requirements first?',
      content: 'I can start tomorrow. Should we discuss the requirements first?',
      timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
      status: 'READ'
    }
  ];

  // Load conversation when component mounts or users change
  useEffect(() => {
    if (!currentUserId || !otherUserId) {
      setLoading(false);
      return;
    }

    const loadConversation = async () => {
      try {
        setLoading(true);
        console.log(`🔄 Loading conversation between user ${currentUserId} and ${otherUserId}...`);
        
        const conversation = await ApiService.getConversation(currentUserId, otherUserId);
        console.log('✅ Loaded messages from backend:', conversation);
        
        setMessages(conversation);
        
        // Mark messages as read when opening conversation
        await ApiService.markMessagesAsRead(currentUserId, otherUserId);
      } catch (error) {
        console.error('❌ Failed to load conversation from backend:', error);
        console.log('📝 Using mock message data instead');
        
        // Use mock data as fallback
        setMessages(mockMessages);
      } finally {
        setLoading(false);
      }
    };

    loadConversation();
  }, [currentUserId, otherUserId]);

  // Subscribe to WebSocket events
  useEffect(() => {
    if (!currentUserId || !otherUserId) return;

    try {
      // Subscribe to new messages
      const handleMessage = (message) => {
        console.log('📨 Received message via WebSocket:', message);
        
        // Only add message if it's part of this conversation
        if ((message.senderId === otherUserId && message.receiverId === currentUserId) ||
            (message.senderId === currentUserId && message.receiverId === otherUserId)) {
          
          console.log('✅ Message is for this conversation, adding to UI');
          
          setMessages(prev => {
            // Avoid duplicates - check if message already exists
            const exists = prev.some(m => m.id === message.id);
            if (exists) {
              console.log('⚠️ Duplicate message, skipping');
              return prev;
            }
            console.log('✨ New message added to chat');
            return [...prev, message];
          });

          // Mark as read if we received it
          if (message.receiverId === currentUserId) {
            console.log('📖 Marking message as read');
            ApiService.markMessagesAsRead(currentUserId, otherUserId).catch(err => 
              console.error('Failed to mark as read:', err)
            );
          }
        } else {
          console.log('⏭️ Message is for different conversation, ignoring');
        }
      };

      // Subscribe to typing indicators
      const handleTyping = (indicator) => {
        console.log('⌨️ Typing indicator received:', indicator);
        if (indicator.senderId === otherUserId && indicator.receiverId === currentUserId) {
          setTyping(indicator.isTyping);
          console.log(`${indicator.isTyping ? '✍️ User is typing...' : '✅ User stopped typing'}`);
          
          // Auto-clear typing after 3 seconds
          if (indicator.isTyping) {
            setTimeout(() => setTyping(false), 3000);
          }
        }
      };

      // Subscribe to user status changes
      const handleStatus = (status) => {
        if (status.userId === otherUserId) {
          setOtherUserStatus(status.status.toLowerCase());
        }
      };

      // Subscribe to read receipts
      const handleRead = (receipt) => {
        if (receipt.senderId === otherUserId) {
          // Update message statuses to 'read'
          setMessages(prev => prev.map(msg => 
            msg.senderId === currentUserId && msg.receiverId === otherUserId
              ? { ...msg, status: 'READ' }
              : msg
          ));
        }
      };

      // Subscribe using the correct WebSocketService API
      WebSocketService.subscribe('onMessage', handleMessage);
      WebSocketService.subscribe('onTyping', handleTyping);
      WebSocketService.subscribe('onUserStatus', handleStatus);
      WebSocketService.subscribe('onReadReceipt', handleRead);

      // Cleanup subscriptions
      return () => {
        WebSocketService.unsubscribe('onMessage', handleMessage);
        WebSocketService.unsubscribe('onTyping', handleTyping);
        WebSocketService.unsubscribe('onUserStatus', handleStatus);
        WebSocketService.unsubscribe('onReadReceipt', handleRead);
      };
    } catch (error) {
      console.error('❌ WebSocket subscription error:', error);
      // Continue without WebSocket if it fails
      return () => {}; // Return empty cleanup function
    }
  }, [currentUserId, otherUserId]);

  // Send a message
  const sendMessage = async (content) => {
    if (!content.trim() || !currentUserId || !otherUserId) {
      console.error('Cannot send message: missing content or user IDs');
      return;
    }

    try {
      console.log(`📤 Sending message from user ${currentUserId} to user ${otherUserId}:`, content);
      
      // Send via API
      const sentMessage = await ApiService.sendMessage(
        currentUserId,
        otherUserId,
        content.trim(),
        projectId || 1
      );

      console.log('✅ Message sent successfully via API:', sentMessage);

      // Optimistically add to UI (WebSocket will also send it, but this makes UI instant)
      setMessages(prev => {
        const exists = prev.some(m => m.id === sentMessage.id);
        if (exists) return prev;
        return [...prev, sentMessage];
      });

      return sentMessage;
    } catch (error) {
      console.error('❌ Failed to send message:', error);
      throw error;
    }
  };

  // Send typing indicator
  const sendTypingIndicator = (isTyping) => {
    if (!currentUserId || !otherUserId) return;
    
    try {
      WebSocketService.sendTypingIndicator(otherUserId, isTyping);
    } catch (error) {
      console.error('Failed to send typing indicator:', error);
    }
  };

  const value = {
    messages,
    loading,
    typing,
    otherUserStatus,
    sendMessage,
    sendTypingIndicator,
    currentUserId,
    otherUserId,
    projectId
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};
