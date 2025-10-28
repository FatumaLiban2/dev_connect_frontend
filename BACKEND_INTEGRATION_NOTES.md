# Backend Integration Notes for Messaging System

## Files Cleaned Up ✅
The following demo/testing files have been removed:
- `/src/pages/ChatDemo.jsx` - Demo landing page
- `/src/pages/ChatPage.jsx` - Single chat view (using MessagingPage instead)
- `/src/services/mockChatService.js` - Mock WebSocket service
- `/src/styles/ChatDemo.css` - Demo page styling

## Files Ready for Backend Integration

### 1. ChatContext.jsx (`/src/context/ChatContext.jsx`)
**Current State:** Using mock data with TODO comments for WebSocket integration

**What to Update:**
```javascript
// Line ~23: Connect to real WebSocket
useEffect(() => {
  // Replace this:
  setIsConnected(true);
  loadInitialMessages();
  
  // With this:
  wsService.connect().then(() => {
    setIsConnected(true);
    loadMessagesFromAPI(); // Fetch from backend
  });
  
  // Add WebSocket message listener:
  const unsubscribe = wsService.onMessage((data) => {
    if (data.type === 'message') {
      setMessages(prev => [...prev, data.message]);
    } else if (data.type === 'status_update') {
      updateMessageStatus(data.message.id, data.message.status);
    } else if (data.type === 'typing') {
      setIsTyping(data.isTyping);
    }
  });
  
  return () => {
    unsubscribe();
    wsService.disconnect();
  };
}, []);

// Line ~77: Send message via WebSocket
const sendMessage = useCallback(async (text) => {
  // Add WebSocket send:
  await wsService.sendMessage(newMessage);
  
  // Remove the mock message creation, let backend handle it
}, [currentUserId, otherUserId]);

// Line ~97: Mark as read via WebSocket
const markAsRead = useCallback((messageId) => {
  wsService.markAsRead(messageId);
  updateMessageStatus(messageId, 'read');
}, []);
```

### 2. ChatList.jsx (`/src/components/Chat/ChatList.jsx`)
**Current State:** Using hardcoded mock chat data

**What to Update:**
```javascript
// Line ~4: Replace mock data with API call
const [chats, setChats] = useState([]);

useEffect(() => {
  // Fetch user's chats from backend
  fetchChats(userRole).then(data => setChats(data));
}, [userRole]);

// Backend should return chats filtered by:
// - Client: Only developers on their projects
// - Developer: Only clients whose projects they've taken
```

### 3. MessagingPage.jsx (`/src/pages/MessagingPage.jsx`)
**Current State:** Hardcoded `userRole = 'client'`

**What to Update:**
```javascript
// Line ~3: Get user role from auth context
import { useAuth } from '../context/AuthContext'; // You'll need to create this

const { user } = useAuth();
const userRole = user.role; // 'client' or 'developer'
```

## WebSocket Service Requirements

Create a new file: `/src/services/websocketService.js`

**Required Methods:**
- `connect()` - Establish WebSocket connection
- `disconnect()` - Close WebSocket connection
- `sendMessage(message)` - Send a message
- `onMessage(callback)` - Listen for incoming messages
- `markAsRead(messageId)` - Send read receipt
- `sendTypingIndicator(isTyping)` - Notify typing status

**Expected Message Format:**
```javascript
{
  id: string,
  senderId: string,
  receiverId: string,
  text: string,
  timestamp: ISO string,
  status: 'sent' | 'delivered' | 'read'
}
```

## API Endpoints Needed

### Chat List
- `GET /api/chats?role=client` - Get all chats for client (filtered to show only developers)
- `GET /api/chats?role=developer` - Get all chats for developer (filtered to show only clients)

### Messages
- `GET /api/messages/:chatId` - Get message history
- `POST /api/messages` - Send a new message (can also use WebSocket)
- `PATCH /api/messages/:messageId/read` - Mark message as read

### User Status
- WebSocket events for online/offline status
- WebSocket events for typing indicators

## Project Relationship Filtering

**Backend Logic Required:**
- Client chats should only show developers who have accepted their projects
- Developer chats should only show clients whose projects they've accepted
- Filter based on `Project` table relationships

## Authentication Context Needed

Create `/src/context/AuthContext.jsx`:
```javascript
{
  user: {
    id: string,
    name: string,
    role: 'client' | 'developer',
    avatar: string
  },
  isAuthenticated: boolean,
  login: (credentials) => Promise,
  logout: () => void
}
```

## Current Features Working (No Backend Required Yet)

✅ WhatsApp-style UI layout
✅ Message bubbles with correct colors
✅ Read receipts (3 states)
✅ Typing indicators animation
✅ Chat list with search bar
✅ Online status indicators
✅ Date grouping for messages
✅ Auto-scroll to latest message
✅ Responsive design

## Developer Messaging Interface (Separate Branch)

Current branch: `client_messaging_interface_issa`

**Next Branch:** Create `developer_messaging_interface` with same structure but:
- `userRole = 'developer'`
- Shows only clients (already filtered in ChatList.jsx)
- Same components, just different data filtering

## Notes

- All TODO comments in code mark integration points
- Message structure is already backend-ready
- UI is fully functional, just needs real data
- No breaking changes required, just replace mock data with API calls
