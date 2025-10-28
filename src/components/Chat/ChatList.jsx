import { useState } from 'react';
import '../../styles/ChatList.css';

const ChatList = ({ onSelectChat, activeChat, userRole = 'client' }) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Mock chat data - will be replaced with real data later
  // For CLIENT: Shows only developers they've worked with on projects
  // For DEVELOPER: Shows only clients whose projects they've taken
  const allChats = [
    // Developers (shown to clients)
    {
      id: 'dev1',
      name: 'Alex Developer',
      lastMessage: 'That sounds good!',
      timestamp: '10:56',
      unread: 2,
      online: true,
      avatar: null,
      type: 'developer',
      projectId: 'proj1'
    },
    {
      id: 'dev2',
      name: 'Mike Frontend',
      lastMessage: 'I have experience with React...',
      timestamp: 'Yesterday',
      unread: 0,
      online: false,
      avatar: null,
      type: 'developer',
      projectId: 'proj2'
    },
    {
      id: 'dev3',
      name: 'Sarah Fullstack',
      lastMessage: 'I can help with the API integration',
      timestamp: 'Friday',
      unread: 0,
      online: false,
      avatar: null,
      type: 'developer',
      projectId: 'proj3'
    },
    // Clients (shown to developers)
    {
      id: 'client1',
      name: 'John Client',
      lastMessage: 'When can you start the project?',
      timestamp: '11:30',
      unread: 1,
      online: true,
      avatar: null,
      type: 'client',
      projectId: 'proj4'
    },
    {
      id: 'client2',
      name: 'Emma Business',
      lastMessage: 'Thanks for the update!',
      timestamp: 'Yesterday',
      unread: 0,
      online: true,
      avatar: null,
      type: 'client',
      projectId: 'proj5'
    },
    {
      id: 'client3',
      name: 'David Startup',
      lastMessage: 'Can we discuss the budget?',
      timestamp: 'Monday',
      unread: 3,
      online: false,
      avatar: null,
      type: 'client',
      projectId: 'proj6'
    },
  ];

  // Filter chats based on user role
  // Client sees only developers, Developer sees only clients
  const chats = userRole === 'client' 
    ? allChats.filter(chat => chat.type === 'developer')
    : allChats.filter(chat => chat.type === 'client');

  const filteredChats = chats.filter(chat =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="chat-list-panel">
      {/* Header */}
      <div className="chat-list-header">
        <h2>Messages</h2>
        <div className="header-actions">
          <button className="icon-btn" title="New chat">
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
              {userRole === 'client' 
                ? 'No developers on your projects yet' 
                : 'No clients for your projects yet'}
            </p>
          </div>
        ) : (
          filteredChats.map((chat) => (
            <div
              key={chat.id}
              className={`chat-item ${activeChat === chat.id ? 'active' : ''}`}
              onClick={() => onSelectChat(chat)}
            >
              <div className="chat-avatar">
                {chat.avatar ? (
                  <img src={chat.avatar} alt={chat.name} />
                ) : (
                  <div className="avatar-placeholder">
                    {chat.name.charAt(0).toUpperCase()}
                  </div>
                )}
                {chat.online && <span className="online-dot"></span>}
              </div>
              
              <div className="chat-info">
                <div className="chat-header-row">
                  <h3 className="chat-name">{chat.name}</h3>
                  <span className="chat-time">{chat.timestamp}</span>
                </div>
                <div className="chat-message-row">
                  <p className="chat-last-message">
                    {chat.lastMessage}
                  </p>
                  {chat.unread > 0 && (
                    <span className="unread-badge">{chat.unread}</span>
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
