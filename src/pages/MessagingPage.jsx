import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import ChatList from '../components/Chat/ChatList';
import { ChatProvider } from '../context/ChatContext';
import ChatContainer from '../components/Chat/ChatContainer';
import Sidebar from '../components/Sidebar';
import '../styles/MessagingLayout.css';

const MessagingPage = ({ userRole = 'client' }) => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Auto-select chat if userId is in URL (e.g., /messages?userId=user2)
  useEffect(() => {
    const userId = searchParams.get('userId');
    if (userId) {
      // TODO: When backend is ready, fetch user details by userId
      // For now, auto-select if user exists in chat list
      setSelectedChat({
        id: userId,
        name: 'Developer', // Will come from backend
        online: true
      });
    }
  }, [searchParams]);

  const handleSelectChat = (chat) => {
    setSelectedChat(chat);
  };

  const handleBackClick = () => {
    navigate(-1); // Go back to previous page (project detail, dashboard, etc.)
  };

  return (
    <div className="messaging-page-wrapper">
      <Sidebar role={userRole} />
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
        onSelectChat={handleSelectChat} 
        activeChat={selectedChat?.id}
        userRole={userRole}
      />

      {/* Right Panel - Chat Interface */}
      <div className="chat-main-area">
        {selectedChat ? (
          <ChatProvider>
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
                {userRole === 'client' 
                  ? 'DevConnect Client Messaging' 
                  : 'DevConnect Developer Messaging'}
              </h2>
              <p>
                {userRole === 'client'
                  ? 'Select a developer to start messaging'
                  : 'Select a client to start messaging'}
              </p>
              <p className="subtitle">
                {userRole === 'client'
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
