// NewChatModal.jsx - Search users and start new conversations
import React, { useState, useEffect } from 'react';
import ApiService from '../../services/ApiService';
import '../../styles/Chat.css';

const NewChatModal = ({ isOpen, onClose, currentUserId, userRole, onSelectUser }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadUsers();
    }
  }, [isOpen]);

  // Real-time search with debounce
  useEffect(() => {
    if (!searchQuery) {
      loadUsers(); // Load all users when search is empty
      return;
    }

    const timer = setTimeout(() => {
      searchUsersWithQuery(searchQuery);
    }, 300); // 300ms debounce

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Load different users based on current user role using unified search endpoint
      let data;
      if (userRole === 'DEVELOPER') {
        // Developers search for clients: GET /api/users/search?role=CLIENT
        data = await ApiService.getUsersByRole('CLIENT');
      } else {
        // Clients search for developers: GET /api/users/search?role=DEVELOPER
        data = await ApiService.getUsersByRole('DEVELOPER');
      }
      
      // Filter out current user
      const filteredUsers = data.filter(user => {
        const userId = user.id || user.userId;
        return userId !== currentUserId;
      });
      
      console.log('✅ Loaded users for chat:', filteredUsers);
      setUsers(filteredUsers);
    } catch (err) {
      console.error('❌ Failed to load users:', err);
      setError(err.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const searchUsersWithQuery = async (query) => {
    try {
      setIsSearching(true);
      setError(null);
      
      const targetRole = userRole === 'DEVELOPER' ? 'CLIENT' : 'DEVELOPER';
      
      // Search users with query and role: GET /api/users/search?query=john&role=DEVELOPER
      const data = await ApiService.searchUsers(targetRole, query);
      
      // Filter out current user
      const filteredUsers = data.filter(user => {
        const userId = user.id || user.userId;
        return userId !== currentUserId;
      });
      
      console.log(`✅ Search results for "${query}":`, filteredUsers);
      setUsers(filteredUsers);
    } catch (err) {
      console.error('❌ Failed to search users:', err);
      setError(err.message || 'Failed to search users');
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSelectUser = (user) => {
    const userId = user.id || user.userId;
    const userName = user.username || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'User';
    const otherUserRole = userRole === 'DEVELOPER' ? 'CLIENT' : 'DEVELOPER';
    
    onSelectUser({
      userId: userId,
      userName: userName,
      userAvatar: user.avatar || null,
      userRole: otherUserRole,
      userStatus: 'offline'
    });
    
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="new-chat-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Start New Conversation</h3>
          <button className="modal-close-btn" onClick={onClose}>×</button>
        </div>

        <div className="modal-search">
          <input
            type="text"
            placeholder={`Search ${userRole === 'DEVELOPER' ? 'clients' : 'developers'}...`}
            value={searchQuery}
            onChange={handleSearch}
            autoFocus
          />
          {isSearching && (
            <div className="search-spinner">
              <div className="spinner-small"></div>
            </div>
          )}
        </div>

        <div className="modal-content">
          {loading && (
            <div className="modal-loading">
              <div className="spinner"></div>
              <p>Loading users...</p>
            </div>
          )}

          {error && (
            <div className="modal-error">
              <p>{error}</p>
              <button onClick={loadUsers}>Retry</button>
            </div>
          )}

          {!loading && !error && users.length === 0 && (
            <div className="modal-empty">
              <p>
                {searchQuery 
                  ? 'No users found matching your search' 
                  : `No ${userRole === 'DEVELOPER' ? 'clients' : 'developers'} available`}
              </p>
            </div>
          )}

          {!loading && !error && users.length > 0 && (
            <div className="users-list">
              {users.map(user => {
                const userId = user.id || user.userId;
                const displayName = user.username || 
                                  `${user.firstName || ''} ${user.lastName || ''}`.trim() || 
                                  'User';
                const displayRole = user.role || user.userRole || (userRole === 'DEVELOPER' ? 'CLIENT' : 'DEVELOPER');

                return (
                  <div 
                    key={userId} 
                    className="user-item"
                    onClick={() => handleSelectUser(user)}
                  >
                    <div className="user-avatar">
                      {displayName.charAt(0).toUpperCase()}
                    </div>
                    <div className="user-info">
                      <div className="user-name">{displayName}</div>
                      <div className="user-email">{user.email}</div>
                      <div className="user-role-badge">{displayRole}</div>
                    </div>
                    <div className="user-action">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewChatModal;
