import '../../styles/Chat.css';

const ChatHeader = ({ userName, userStatus, userAvatar }) => {
  return (
    <div className="chat-header">
      <div className="user-info">
        <div className="user-avatar">
          {userAvatar ? (
            <img src={userAvatar} alt={userName} />
          ) : (
            <div className="avatar-placeholder">
              {userName.charAt(0).toUpperCase()}
            </div>
          )}
          <span className={`status-indicator ${userStatus}`}></span>
        </div>
        <div className="user-details">
          <h3 className="user-name">{userName}</h3>
          <span className="user-status-text">
            {userStatus === 'online' ? 'Online' : 'Offline'}
          </span>
        </div>
      </div>
      <div className="header-actions">
        <button className="icon-button" title="Search">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
            <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
        <button className="icon-button" title="More options">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="5" r="1.5" fill="currentColor"/>
            <circle cx="12" cy="12" r="1.5" fill="currentColor"/>
            <circle cx="12" cy="19" r="1.5" fill="currentColor"/>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
