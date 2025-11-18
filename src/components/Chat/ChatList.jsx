// Updated ChatList component with backend integration
import { useState, useEffect } from 'react';
import messagingApi from '../../services/messagingApi';
import '../../styles/ChatList.css';

const ChatList = ({ onSelectChat, activeChat, currentUserId, userRole = 'client', onNewChat }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadChats = async () => {
    if (!currentUserId) {
      console.log('ChatList: No currentUserId provided');
      setLoading(false);
      return;
    }

    console.log('ChatList: Loading chats for userId:', currentUserId);
    
    try {
      const data = await messagingApi.getUserChats(currentUserId);
      console.log('ChatList: Loaded chats:', data);
      setChats(data);
      setError(null);
    } catch (err) {
      console.error('ChatList: Failed to load chats:', err);
      console.error('ChatList: Error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      });
      
      // Check if it's a network/backend error
      if (err.code === 'ERR_NETWORK' || !err.response) {
        setError('Cannot connect to backend server. Please ensure the backend is running on localhost:8081');
      } else if (err.response?.status === 401) {
        setError('Authentication failed. Please log in again.');
      } else {
        setError('Failed to load conversations');
      }
      
      // Fallback to empty chats on error
      setChats([]);
    } finally {
      setLoading(false);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    loadChats();
    
    // Refresh chats every 30 seconds
    const interval = setInterval(loadChats, 30000);
    
    return () => clearInterval(interval);
  }, [currentUserId]);

  const filteredChats = chats.filter(chat =>
    chat.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (chat.lastMessage && chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="chat-list-loading">
        <div className="spinner"></div>
        <p>Loading conversations...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="chat-list-error">
        <p>{error}</p>
        <button onClick={loadChats}>Retry</button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="chat-list-panel">
        <div className="chat-list-header">
          <h2>Messages</h2>
        </div>
        <div className="loading">Loading chats...</div>
      </div>
    );
  }

  return (
    <div className="chat-list-panel">
      {/* Header */}
      <div className="chat-list-header">
        <h2>Messages</h2>
        <div className="header-actions">
          <button className="icon-btn" title="New chat" onClick={onNewChat}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
          <button className="icon-btn" title="Menu">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="5" r="1.5" fill="currentColor"/>
              <circle cx="12" cy="12" r="1.5" fill="currentColor"/>
              <circle cx="12" cy="19" r="1.5" fill="currentColor"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="chat-search">
        <div className="search-input-wrapper">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
            <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <input
            type="text"
            placeholder="Search or start new chat"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="chat-filters">
        <button className="filter-btn active">All</button>
        <button className="filter-btn">Unread</button>
        <button className="filter-btn">Active Projects</button>
      </div>

      {/* Chat List */}
      <div className="chat-list-items">
        {filteredChats.length === 0 ? (
          <div className="no-chats">
            <p>
              {userRole === 'CLIENT' 
                ? 'No developers on your projects yet' 
                : 'No clients for your projects yet'}
            </p>
            <p style={{ fontSize: '0.85rem', color: '#999', marginTop: '0.5rem' }}>
              Click the <strong>+ button</strong> above to start a new conversation
            </p>
          </div>
        ) : (
          filteredChats.map((chat) => (
            <div
              key={chat.userId || chat.id}
              className={`chat-item ${activeChat === chat.userId ? 'active' : ''}`}
              onClick={() => onSelectChat(chat)}
            >
              <div className="chat-avatar">
                {chat.userAvatar ? (
                  <img src={chat.userAvatar} alt={chat.userName} />
                ) : (
                  <div className="avatar-placeholder">
                    {chat.userName.charAt(0).toUpperCase()}
                  </div>
                )}
                {chat.userStatus === 'online' && <span className="online-dot"></span>}
              </div>
              
              <div className="chat-info">
                <div className="chat-header-row">
                  <h3 className="chat-name">{chat.userName}</h3>
                  <span className="chat-time">{formatTimestamp(chat.lastMessageTime)}</span>
                </div>
                <div className="chat-message-row">
                  <p className="chat-last-message">
                    {chat.lastMessage || 'No messages yet'}
                  </p>
                  {chat.unreadCount > 0 && (
                    <span className="unread-badge">{chat.unreadCount}</span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ChatList;
