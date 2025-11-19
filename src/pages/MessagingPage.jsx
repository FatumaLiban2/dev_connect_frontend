// Updated MessagingPage.jsx with backend integration
import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import ChatList from '../components/Chat/ChatList';
import ChatInterface from '../components/Chat/ChatInterface';
import NewChatModal from '../components/Chat/NewChatModal';
import messagingApi from '../services/messagingApi';
import '../styles/MessagingLayout.css';

const MessagingPage = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Get logged-in user from localStorage
  useEffect(() => {
    console.log('MessagingPage: Checking for logged-in user...');
    const userStr = localStorage.getItem('devconnect_user');
    console.log('MessagingPage: devconnect_user from localStorage:', userStr);
    
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        console.log('MessagingPage: Parsed user:', user);
        const userId = user.id || user.userId;
        const role = user.userRole || user.role;
        console.log('MessagingPage: Setting userId:', userId, 'role:', role);
        setCurrentUserId(userId);
        setUserRole(role);
      } catch (error) {
        console.error('MessagingPage: Error parsing user data:', error);
      }
    } else {
      console.log('MessagingPage: No user found in localStorage');
    }
  }, []);

  // Auto-select chat if userId is in URL (e.g., /messages?userId=2)
  useEffect(() => {
    const userId = searchParams.get('userId');
    if (userId && currentUserId) {
      // Load user details and auto-select
      const loadUser = async () => {
        try {
          const status = await messagingApi.getUserStatus(parseInt(userId));
          setSelectedChat({
            userId: parseInt(userId),
            userName: searchParams.get('userName') || 'User',
            userAvatar: null,
            userRole: searchParams.get('userRole') || 'developer',
            userStatus: status,
            projectId: searchParams.get('projectId') || null
          });
        } catch (error) {
          console.error('Failed to load user status:', error);
          // Fallback without status
          setSelectedChat({
            userId: parseInt(userId),
            userName: searchParams.get('userName') || 'User',
            userRole: searchParams.get('userRole') || 'developer',
            userStatus: 'offline',
            projectId: searchParams.get('projectId') || null
          });
        }
      };
      loadUser();
    }
  }, [searchParams, currentUserId]);

  const handleSelectChat = (chat) => {
    setSelectedChat(chat);
  };

  const handleNewChat = (user) => {
    setSelectedChat(user);
  };

  const handleBackClick = () => {
    navigate(-1); // Go back to previous page
  };

  if (!currentUserId) {
    return (
      <div className="messaging-error">
        <p>Please log in to access messaging</p>
        <button onClick={() => navigate('/login')}>Go to Login</button>
      </div>
    );
  }

  return (
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
        currentUserId={currentUserId}
        onSelectChat={handleSelectChat} 
        activeChat={selectedChat?.userId}
        userRole={userRole}
        onNewChat={() => setShowNewChatModal(true)}
      />

      {/* New Chat Modal */}
      <NewChatModal
        isOpen={showNewChatModal}
        onClose={() => setShowNewChatModal(false)}
        currentUserId={currentUserId}
        userRole={userRole}
        onSelectUser={handleNewChat}
      />

      {/* Right Panel - Chat Interface */}
      <div className="chat-main-area">
        {selectedChat ? (
          <ChatInterface
            currentUserId={currentUserId}
            recipientUserId={selectedChat.userId}
            recipientName={selectedChat.userName}
          />
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
                {userRole === 'CLIENT' 
                  ? 'DevConnect Client Messaging' 
                  : 'DevConnect Developer Messaging'}
              </h2>
              <p>
                {userRole === 'CLIENT'
                  ? 'Select a developer to start messaging'
                  : 'Select a client to start messaging'}
              </p>
              <p className="subtitle">
                {userRole === 'CLIENT'
                  ? 'Chat with developers working on your projects'
                  : 'Chat with clients whose projects you\'ve taken'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagingPage;
