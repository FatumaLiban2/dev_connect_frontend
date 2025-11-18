# 🔌 Backend Endpoints Required for Frontend Integration

## Quick Reference for Backend Team

### ✅ Already Implemented (Based on screenshot)
- DeveloperController.java
- ProjectController.java  
- DeveloperService.java
- ProjectService.java
- DeveloperResponseDTO.java

---

## 📋 Endpoint Specifications

### 1️⃣ Get All Developers

**Endpoint**: `GET /api/developers`

**Purpose**: Client searches for developers to message

**Authentication**: Required (JWT Bearer token)

**Request**:
```http
GET http://localhost:8081/api/developers
Authorization: Bearer {jwt_token}
```

**Response**: `200 OK`
```json
[
  {
    "id": 2,
    "username": "jane.smith",
    "email": "jane@example.com",
    "firstName": "Jane",
    "lastName": "Smith",
    "userRole": "DEVELOPER",
    "specialization": "Full Stack Developer",
    "bio": "10 years of experience...",
    "rating": 4.8,
    "createdAt": "2024-01-15T10:30:00"
  }
]
```

**Frontend Usage**:
```javascript
// In ApiService.js
async getAllDevelopers() {
  const response = await fetch(`${API_BASE_URL}/developers`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return response.json();
}
```

---

### 2️⃣ Search Developers

**Endpoint**: `GET /api/developers/search?query={searchTerm}`

**Purpose**: Filter developers by name, skills, specialization

**Authentication**: Required (JWT Bearer token)

**Request**:
```http
GET http://localhost:8081/api/developers/search?query=john
Authorization: Bearer {jwt_token}
```

**Response**: `200 OK`
```json
[
  {
    "id": 3,
    "username": "john.developer",
    "firstName": "John",
    "lastName": "Developer",
    "specialization": "Backend Developer",
    "rating": 4.5
  }
]
```

**Search Logic** (Backend should match):
- Username contains query
- First name contains query
- Last name contains query  
- Specialization contains query
- Email contains query

---

### 3️⃣ Get Available Projects (For Developers)

**Endpoint**: `GET /api/projects/available`

**Purpose**: Developers browse projects they can claim

**Authentication**: Required (JWT Bearer token)

**Request**:
```http
GET http://localhost:8081/api/projects/available
Authorization: Bearer {jwt_token}
```

**Response**: `200 OK`
```json
[
  {
    "id": 1,
    "projectName": "E-commerce Website",
    "description": "Build a full-stack e-commerce platform",
    "projectBudget": 5000.00,
    "timeline": "3 months",
    "status": "AVAILABLE",
    "clientId": 1,
    "clientName": "John Doe",
    "createdAt": "2024-01-20T14:00:00"
  }
]
```

**Important**: Include `clientId` and `clientName` so developers can message the client

---

### 4️⃣ Get User Chats

**Endpoint**: `GET /api/messages/chats/{userId}`

**Purpose**: Load all conversations for a user

**Authentication**: Required (JWT Bearer token)

**Request**:
```http
GET http://localhost:8081/api/messages/chats/1
Authorization: Bearer {jwt_token}
```

**Response**: `200 OK`
```json
[
  {
    "userId": 2,
    "userName": "Jane Smith",
    "userAvatar": null,
    "userRole": "DEVELOPER",
    "userStatus": "online",
    "lastMessage": "Hello, I'm interested in your project",
    "lastMessageTime": "2024-01-20T15:30:00",
    "unreadCount": 2,
    "projectId": null
  }
]
```

**Notes**:
- Returns empty array `[]` if no chats exist (this is normal)
- Frontend handles empty state gracefully

---

### 5️⃣ Get Conversation Messages

**Endpoint**: `GET /api/messages/conversation?userId1={id1}&userId2={id2}`

**Purpose**: Load message history between two users

**Authentication**: Required (JWT Bearer token)

**Request**:
```http
GET http://localhost:8081/api/messages/conversation?userId1=1&userId2=2
Authorization: Bearer {jwt_token}
```

**Response**: `200 OK`
```json
[
  {
    "id": 1,
    "senderId": 1,
    "recipientId": 2,
    "content": "Hello, are you available for a project?",
    "timestamp": "2024-01-20T15:25:00",
    "messageType": "CHAT",
    "read": false
  },
  {
    "id": 2,
    "senderId": 2,
    "recipientId": 1,
    "content": "Yes, I am! Tell me more about it.",
    "timestamp": "2024-01-20T15:26:00",
    "messageType": "CHAT",
    "read": true
  }
]
```

---

### 6️⃣ Send Message (REST Fallback)

**Endpoint**: `POST /api/messages/send`

**Purpose**: Send message via REST (if WebSocket unavailable)

**Authentication**: Required (JWT Bearer token)

**Request**:
```http
POST http://localhost:8081/api/messages/send
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "senderId": 1,
  "recipientId": 2,
  "content": "Hello from REST API!",
  "messageType": "CHAT"
}
```

**Response**: `200 OK`
```json
{
  "id": 3,
  "senderId": 1,
  "recipientId": 2,
  "content": "Hello from REST API!",
  "timestamp": "2024-01-20T15:30:00",
  "messageType": "CHAT",
  "read": false
}
```

---

### 7️⃣ Mark Messages as Read

**Endpoint**: `PUT /api/messages/read`

**Purpose**: Mark messages as read (update unread count)

**Authentication**: Required (JWT Bearer token)

**Request**:
```http
PUT http://localhost:8081/api/messages/read
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "userId": 1,
  "otherUserId": 2
}
```

**Response**: `200 OK`

---

### 8️⃣ Get User Status

**Endpoint**: `GET /api/messages/status/{userId}`

**Purpose**: Check if user is online/offline

**Authentication**: Required (JWT Bearer token)

**Request**:
```http
GET http://localhost:8081/api/messages/status/2
Authorization: Bearer {jwt_token}
```

**Response**: `200 OK`
```json
{
  "userId": 2,
  "status": "online",
  "lastSeen": "2024-01-20T15:35:00"
}
```

---

## 🔌 WebSocket Configuration

### STOMP WebSocket Endpoint

**Connection URL**: `ws://localhost:8081/ws` (with SockJS)

**Required Backend Configuration**:

```java
@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {
    
    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws")
            .setAllowedOrigins(
                "http://localhost:5173",
                "http://localhost:5174", 
                "http://localhost:5175"  // ← Frontend dev server
            )
            .withSockJS();
    }
    
    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        registry.enableSimpleBroker("/topic", "/queue");
        registry.setApplicationDestinationPrefixes("/app");
        registry.setUserDestinationPrefix("/user");
    }
}
```

### WebSocket Message Destinations

**Send Message** (Client → Server):
```
Destination: /app/chat.sendMessage
Payload: {
  "senderId": 1,
  "recipientId": 2,
  "content": "Hello!",
  "messageType": "CHAT"
}
```

**Receive Messages** (Server → Client):
```
Subscribe to: /user/{userId}/queue/messages

Received: {
  "id": 1,
  "senderId": 2,
  "recipientId": 1,
  "content": "Hello!",
  "timestamp": "2024-01-20T15:30:00",
  "messageType": "CHAT"
}
```

**Typing Indicator**:
```
Send: /app/chat.typing
Payload: { "senderId": 1, "recipientId": 2 }

Subscribe: /user/{userId}/queue/typing
```

---

## 🔐 Security Configuration

### CORS Settings

**Required in SecurityConfig.java**:

```java
@Bean
public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();
    configuration.setAllowedOrigins(Arrays.asList(
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175"
    ));
    configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
    configuration.setAllowedHeaders(Arrays.asList("*"));
    configuration.setAllowCredentials(true);
    
    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", configuration);
    return source;
}
```

### JWT Authentication

**Frontend sends**:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Backend validates** before processing any request

---

## 🎯 Testing Endpoints with cURL

```bash
# 1. Login to get token
curl -X POST http://localhost:8081/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@test.com","password":"Test123!"}'

# Copy the token from response, then:

# 2. Get all developers
curl http://localhost:8081/api/developers \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# 3. Search developers
curl "http://localhost:8081/api/developers/search?query=jane" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# 4. Get available projects
curl http://localhost:8081/api/projects/available \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# 5. Get user chats
curl http://localhost:8081/api/messages/chats/1 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# 6. Send message (REST)
curl -X POST http://localhost:8081/api/messages/send \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{"senderId":1,"recipientId":2,"content":"Test message","messageType":"CHAT"}'
```

---

## ✅ Integration Checklist

### Backend Team Must Ensure:

- [ ] All 8 REST endpoints are implemented
- [ ] WebSocket `/ws` endpoint is configured
- [ ] CORS allows `localhost:5175`
- [ ] JWT authentication works on all endpoints
- [ ] Database has test users (1 CLIENT, 1 DEVELOPER)
- [ ] DeveloperResponseDTO includes all required fields
- [ ] Empty arrays return `[]` not `null`
- [ ] Timestamps use ISO 8601 format
- [ ] WebSocket messages route correctly to recipients

### Frontend Team Must Ensure:

- [ ] Dev server runs on port 5175
- [ ] JWT token stored as `devconnect_token` in localStorage
- [ ] User object stored as `devconnect_user` in localStorage
- [ ] API calls include Authorization header
- [ ] Error handling for 401, 404, 500 responses
- [ ] Loading states show while fetching
- [ ] Empty states show when no data

---

## 📞 Contact Points

**Questions about**:
- **DeveloperController endpoints** → Check DeveloperController.java
- **Project endpoints** → Check ProjectController.java
- **Message endpoints** → Check MessageController.java (if exists)
- **WebSocket config** → Check WebSocketConfig.java
- **DTO structure** → Check DeveloperResponseDTO.java, ProjectResponseDTO.java

---

**Ready for integration! 🚀**
