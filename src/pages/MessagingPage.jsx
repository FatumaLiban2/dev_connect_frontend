// Updated MessagingPage.jsx with backend integration - Preserving Sidebar
import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import ChatList from '../components/Chat/ChatList';
import { ChatProvider } from '../context/ChatContext';
import ChatContainer from '../components/Chat/ChatContainer';
import Sidebar from '../components/Sidebar';
import ApiService from '../services/ApiService'; // ADD THIS
import '../styles/MessagingLayout.css';

const MessagingPage = ({ userRole = 'client', currentUser, onSwitchUser }) => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Fallback currentUser if not provided (for development/testing)
  const effectiveUser = currentUser || {
    id: 1,
    username: 'Test User',
    role: userRole,
    avatar: null,
    status: 'online'
  };

  // Auto-select chat if userId is in URL (e.g., /messages?userId=2)
  useEffect(() => {
    const userId = searchParams.get('userId');
    if (userId) {
      // Load user details and auto-select
      const loadUser = async () => {
        try {
          const user = await ApiService.getUser(parseInt(userId));
          setSelectedChat({
            userId: user.id,
            userName: user.username,
            userAvatar: user.avatar,
            userRole: user.role,
            userStatus: user.status,
            projectId: searchParams.get('projectId') || 1
          });
        } catch (error) {
          console.error('Failed to load user:', error);
          // Fallback if API fails
          setSelectedChat({
            userId: parseInt(userId),
            userName: 'Developer',
            userRole: 'developer',
            userStatus: 'online',
            projectId: searchParams.get('projectId') || 1
          });
        }
      };
      loadUser();
    }
  }, [searchParams]);

  const handleSelectChat = (chat) => {
    setSelectedChat(chat);
  };

  const handleBackClick = () => {
    navigate(-1); // Go back to previous page
  };

  return (
    <div className="messaging-page-wrapper">
      {/* TEMPORARY: User Switcher Button for Testing - Only on Messages Page */}
      {currentUser && onSwitchUser && (
        <div 
          style={{
            position: 'fixed',
            top: '10px',
            right: '10px',
            zIndex: 9999,
            background: '#007bff',
            color: 'white',
            padding: '10px 15px',
            borderRadius: '5px',
            cursor: 'pointer',
            boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
            fontSize: '14px',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }} 
          onClick={onSwitchUser}
        >
          <span>🔄</span>
          <span>Switch to {currentUser.role === 'client' ? 'Developer' : 'Client'}</span>
        </div>
      )}

      <Sidebar role={effectiveUser.role} />
      <div className="messaging-layout">
        {/* Back Button */}
        <button className="messaging-back-button" onClick={handleBackClick}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path 
              d="M19 12H5M5 12L12 19M5 12L12 5" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
          Back
        </button>

        {/* Middle Panel - Chat List */}
        <ChatList 
          currentUserId={effectiveUser.id}
          onSelectChat={handleSelectChat} 
          activeChat={selectedChat?.userId}
          userRole={effectiveUser.role}
        />

        {/* Right Panel - Chat Interface */}
        <div className="chat-main-area">
          {selectedChat ? (
            <ChatProvider
              currentUserId={effectiveUser.id}
              otherUserId={selectedChat.userId}
              projectId={selectedChat.projectId}
            >
              <ChatContainer />
            </ChatProvider>
          ) : (
            <div className="no-chat-selected">
              <div className="no-chat-content">
                <svg width="120" height="120" viewBox="0 0 24 24" fill="none">
                  <path 
                    d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" 
                    stroke="#ccc" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  />
                </svg>
                <h2>
                  {effectiveUser.role === 'client' 
                    ? 'DevConnect Client Messaging' 
                    : 'DevConnect Developer Messaging'}
                </h2>
                <p>
                  {effectiveUser.role === 'client'
                    ? 'Select a developer to start messaging'
                    : 'Select a client to start messaging'}
                </p>
                <p className="subtitle">
                  {effectiveUser.role === 'client'
                    ? 'Chat with developers working on your projects'
                    : 'Chat with clients whose projects you\'ve taken'}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessagingPage;
