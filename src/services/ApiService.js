// API service for REST endpoints
const API_BASE_URL = 'http://localhost:8081/api';

class ApiService {
  /**
   * Register a new user
   */
  async register(username, email, password, role) {
    const response = await fetch(`${API_BASE_URL}/users/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password, role })
    });
    
    if (!response.ok) {
      throw new Error('Registration failed');
    }
    
    return response.json();
  }

  /**
   * Login user
   */
  async login(email, password) {
    const response = await fetch(`${API_BASE_URL}/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    if (!response.ok) {
      throw new Error('Login failed');
    }
    
    return response.json();
  }

  /**
   * Get user by ID
   */
  async getUser(userId) {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch user');
    }
    
    return response.json();
  }

  /**
   * Get all chats for a user
   */
  async getUserChats(userId) {
    const response = await fetch(`${API_BASE_URL}/messages/chats/${userId}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch chats');
    }
    
    return response.json();
  }

  /**
   * Get conversation between two users
   */
  async getConversation(userId1, userId2) {
    const response = await fetch(
      `${API_BASE_URL}/messages/conversation?userId1=${userId1}&userId2=${userId2}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch conversation');
    }
    
    return response.json();
  }

  /**
   * Send a message via REST API (alternative to WebSocket)
   */
  async sendMessage(senderId, receiverId, text, projectId) {
    const response = await fetch(`${API_BASE_URL}/messages/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ senderId, receiverId, text, projectId })
    });
    
    if (!response.ok) {
      throw new Error('Failed to send message');
    }
    
    return response.json();
  }

  /**
   * Get user status
   */
  async getUserStatus(userId) {
    const response = await fetch(`${API_BASE_URL}/messages/status/${userId}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch user status');
    }
    
    const data = await response.json();
    return data.status;
  }

  /**
   * Mark messages as read
   */
  async markMessagesAsRead(receiverId, senderId) {
    const response = await fetch(
      `${API_BASE_URL}/messages/read?senderId=${senderId}&receiverId=${receiverId}`,
      { method: 'PUT' }
    );
    
    if (!response.ok) {
      throw new Error('Failed to mark messages as read');
    }
    
    return response.json();
  }
}

export default new ApiService();
