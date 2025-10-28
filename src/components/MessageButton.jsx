import { useNavigate } from 'react-router-dom';
import '../styles/MessageButton.css';

/**
 * MessageButton Component
 * 
 * Usage Examples:
 * 
 * 1. Client messaging a developer:
 *    <MessageButton 
 *      userId={developer.id} 
 *      userName={developer.name}
 *      buttonText="Message Developer"
 *    />
 * 
 * 2. Developer messaging a client:
 *    <MessageButton 
 *      userId={client.id} 
 *      userName={client.name}
 *      buttonText="Message Client"
 *    />
 * 
 * 3. On project card:
 *    <MessageButton 
 *      userId={project.developerId} 
 *      userName={project.developerName}
 *    />
 */
const MessageButton = ({ 
  userId, 
  userName, 
  buttonText = "Message", 
  variant = "primary" // primary, secondary, icon-only
}) => {
  const navigate = useNavigate();

  const handleMessageClick = () => {
    // Navigate to messaging page with userId parameter
    navigate(`/messages?userId=${userId}`);
  };

  return (
    <button 
      className={`message-button ${variant}`}
      onClick={handleMessageClick}
      title={`Message ${userName}`}
    >
      {variant === 'icon-only' ? (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path 
            d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        </svg>
      ) : (
        <>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path 
              d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
          {buttonText}
        </>
      )}
    </button>
  );
};

export default MessageButton;
