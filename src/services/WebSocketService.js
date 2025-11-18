// WebSocket service for real-time messaging - Backend Integration Ready
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

class WebSocketService {
  constructor() {
    this.client = null;
    this.subscriptions = new Map();
    this.userId = null;
    this.isConnected = false;
  }

  /**
   * Connect to WebSocket server
   * @param {number} userId - Current user ID
   * @returns {Promise<void>}
   */
  connect(userId) {
    this.userId = userId;

    return new Promise((resolve, reject) => {
      // Get JWT token for authentication
      const token = localStorage.getItem('accessToken') || 
                    localStorage.getItem('devconnect_token') || 
                    localStorage.getItem('token');

      if (!token) {
        console.error('❌ No authentication token found');
        reject(new Error('No authentication token'));
        return;
      }

      console.log('🔑 Connecting with authentication token');

      this.client = new Client({
        webSocketFactory: () => {
          // Create SockJS connection without token in URL
          const sockjs = new SockJS('http://localhost:8081/ws');
          return sockjs;
        },
        
        connectHeaders: {
          Authorization: `Bearer ${token}`,
          'X-Authorization': `Bearer ${token}`
        },
        
        debug: (str) => {
          console.log('[STOMP]', str);
        },
        
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,

        onConnect: () => {
          console.log('✅ WebSocket Connected');
          this.isConnected = true;
          resolve();
        },

        onStompError: (frame) => {
          console.error('❌ STOMP Error:', frame.headers['message']);
          this.isConnected = false;
          reject(new Error(frame.headers['message']));
        },

        onWebSocketError: (error) => {
          console.error('❌ WebSocket Error:', error);
          this.isConnected = false;
          reject(error);
        },

        onWebSocketClose: () => {
          console.log('🔌 WebSocket Disconnected');
          this.isConnected = false;
        }
      });

      this.client.activate();
    });
  }

  /**
   * Subscribe to incoming messages
   * @param {Function} callback - Message handler
   */
  subscribeToMessages(callback) {
    if (!this.client || !this.userId) {
      throw new Error('WebSocket not connected');
    }

    const subscription = this.client.subscribe(
      `/user/${this.userId}/queue/messages`,
      (message) => {
        try {
          const data = JSON.parse(message.body);
          callback(data);
        } catch (error) {
          console.error('Error parsing message:', error);
        }
      }
    );

    this.subscriptions.set('messages', subscription);
  }

  /**
   * Subscribe to typing indicators
   * @param {Function} callback - Typing indicator handler
   */
  subscribeToTyping(callback) {
    if (!this.client || !this.userId) {
      throw new Error('WebSocket not connected');
    }

    const subscription = this.client.subscribe(
      `/user/${this.userId}/queue/typing`,
      (message) => {
        try {
          const data = JSON.parse(message.body);
          callback(data);
        } catch (error) {
          console.error('Error parsing typing indicator:', error);
        }
      }
    );

    this.subscriptions.set('typing', subscription);
  }

  /**
   * Subscribe to read receipts
   * @param {Function} callback - Read receipt handler
   */
  subscribeToReadReceipts(callback) {
    if (!this.client || !this.userId) {
      throw new Error('WebSocket not connected');
    }

    const subscription = this.client.subscribe(
      `/user/${this.userId}/queue/read-receipts`,
      (message) => {
        try {
          const data = JSON.parse(message.body);
          callback(data);
        } catch (error) {
          console.error('Error parsing read receipt:', error);
        }
      }
    );

    this.subscriptions.set('read-receipts', subscription);
  }

  /**
   * Send a message via WebSocket
   * @param {number} senderId - Sender user ID
   * @param {number} receiverId - Receiver user ID
   * @param {string} text - Message text
   */
  sendMessage(senderId, receiverId, text) {
    if (!this.client || !this.isConnected) {
      throw new Error('WebSocket not connected');
    }

    const message = {
      senderId: senderId,
      receiverId: receiverId,
      text: text,
      timestamp: new Date().toISOString()
    };

    this.client.publish({
      destination: '/app/chat.sendMessage',
      body: JSON.stringify(message)
    });
  }

  /**
   * Send typing indicator
   * @param {number} senderId - Sender user ID
   * @param {number} receiverId - Receiver user ID
   * @param {boolean} isTyping - Is typing status
   */
  sendTypingIndicator(senderId, receiverId, isTyping) {
    if (!this.client || !this.isConnected) {
      return;
    }

    const indicator = {
      senderId: senderId,
      receiverId: receiverId,
      isTyping: isTyping
    };

    this.client.publish({
      destination: '/app/typing',
      body: JSON.stringify(indicator)
    });
  }

  /**
   * Mark messages as read
   * @param {number} conversationId - Conversation ID
   * @param {number} readerId - Reader user ID
   */
  markMessagesAsRead(conversationId, readerId) {
    if (!this.client || !this.isConnected) {
      return;
    }

    const readRequest = {
      conversationId: conversationId,
      readerId: readerId
    };

    this.client.publish({
      destination: '/app/messages-read',
      body: JSON.stringify(readRequest)
    });
  }

  /**
   * Disconnect from WebSocket
   */
  disconnect() {
    // Unsubscribe all
    this.subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    });
    this.subscriptions.clear();

    // Deactivate client
    if (this.client) {
      this.client.deactivate();
      this.client = null;
    }

    this.isConnected = false;
  }

  /**
   * Check connection status
   * @returns {boolean}
   */
  getConnectionStatus() {
    return this.isConnected;
  }
}

// Export singleton instance
export default new WebSocketService();
