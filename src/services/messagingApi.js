// Messaging API Service - Backend Integration Ready
import axios from 'axios';

const API_BASE = 'http://localhost:8081/api/messages';

class MessagingApi {
  constructor() {
    this.axiosInstance = axios.create({
      baseURL: API_BASE
    });

    // Add JWT token to all requests
    this.axiosInstance.interceptors.request.use(
      (config) => {
        // Try multiple token storage keys (in priority order)
        const token = localStorage.getItem('accessToken') ||        // Backend key (primary)
                     localStorage.getItem('devconnect_token') ||    // App key
                     localStorage.getItem('token');                 // Fallback
        
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );
  }

  /**
   * Get all chats for a user
   * @param {number} userId - User ID
   * @returns {Promise<Array>} List of chats
   */
  async getUserChats(userId) {
    try {
      const response = await this.axiosInstance.get(`/chats/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching chats:', error);
      throw error;
    }
  }

  /**
   * Get conversation between two users
   * @param {number} userId1 - First user ID
   * @param {number} userId2 - Second user ID
   * @returns {Promise<Array>} List of messages
   */
  async getConversation(userId1, userId2) {
    try {
      const response = await this.axiosInstance.get(
        `/conversation?userId1=${userId1}&userId2=${userId2}`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching conversation:', error);
      throw error;
    }
  }

  /**
   * Get messages by conversation ID
   * @param {number} conversationId - Conversation ID
   * @param {number} userId - User ID
   * @returns {Promise<Array>} List of messages
   */
  async getConversationMessages(conversationId, userId) {
    try {
      const response = await this.axiosInstance.get(
        `/conversation/${conversationId}?userId=${userId}`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching messages:', error);
      throw error;
    }
  }

  /**
   * Send a message (REST fallback)
   * @param {Object} message - Message object {senderId, receiverId, text}
   * @returns {Promise<Object>} Sent message
   */
  async sendMessage(message) {
    try {
      const response = await this.axiosInstance.post('/send', message);
      return response.data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  /**
   * Mark messages as read
   * @param {number} conversationId - Conversation ID
   * @param {number} readerId - Reader user ID
   */
  async markMessagesAsRead(conversationId, readerId) {
    try {
      await this.axiosInstance.put(
        `/read?conversationId=${conversationId}&readerId=${readerId}`
      );
    } catch (error) {
      console.error('Error marking messages as read:', error);
      throw error;
    }
  }

  /**
   * Update user status
   * @param {number} userId - User ID
   * @param {string} status - 'online' or 'offline'
   */
  async updateUserStatus(userId, status) {
    try {
      await this.axiosInstance.put(`/status/${userId}?status=${status}`);
    } catch (error) {
      console.error('Error updating status:', error);
      throw error;
    }
  }

  /**
   * Get user status
   * @param {number} userId - User ID
   * @returns {Promise<string>} User status
   */
  async getUserStatus(userId) {
    try {
      const response = await this.axiosInstance.get(`/status/${userId}`);
      return response.data.status;
    } catch (error) {
      console.error('Error fetching status:', error);
      throw error;
    }
  }
}

// Export singleton instance
export default new MessagingApi();
