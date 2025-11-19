# 🧪 Messaging Integration Test Guide

## Prerequisites Checklist

### Backend Requirements
- [ ] Spring Boot backend running on `http://localhost:8081`
- [ ] Database populated with test users (at least 2: 1 CLIENT, 1 DEVELOPER)
- [ ] WebSocket endpoint active: `ws://localhost:8081/ws`
- [ ] CORS enabled for `http://localhost:5175`

### Frontend Requirements
- [ ] Dev server running on `http://localhost:5175`
- [ ] Browser console open (F12) for debugging
- [ ] Two browser instances ready (normal + incognito for 2 users)

---

## 🔍 Backend Endpoints Verification

Run these cURL commands or use Postman to verify backend is ready:

```bash
# 1. Health check
curl http://localhost:8081/actuator/health

# 2. Get all developers (should return array)
curl http://localhost:8081/api/developers \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# 3. Search developers
curl http://localhost:8081/api/developers/search?query=john \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# 4. Get available projects
curl http://localhost:8081/api/projects/available \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# 5. Get user chats
curl http://localhost:8081/api/messages/chats/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## 📝 Test Scenarios

### Test 1: Registration & Login Flow

**Objective**: Verify username generation and localStorage setup

**Steps**:
1. Navigate to `http://localhost:5175/signup`
2. Register new CLIENT user:
   - First Name: John
   - Last Name: Doe
   - Email: john@test.com
   - Password: Test123!
   - Role: CLIENT
3. **Check browser console for**:
   ```
   Generated username: john.doe
   ```
4. After registration, verify localStorage:
   ```javascript
   // In browser console:
   console.log(JSON.parse(localStorage.getItem('devconnect_user')))
   // Should show: { id, username: 'john.doe', email, role: 'CLIENT', ... }
   
   console.log(localStorage.getItem('devconnect_token'))
   // Should show JWT token
   ```

**Expected Result**: ✅ User registered with username, token stored

---

### Test 2: Find Developers & Message

**Objective**: Client searches developers and initiates chat

**Steps**:
1. Log in as CLIENT (john@test.com)
2. Navigate to **Find Developers** page (`/find-developers`)
3. **Check browser console for**:
   ```
   Loaded developers: [{ id: 2, username: 'jane.smith', ... }]
   ```
4. If you see "Failed to load developers":
   - Check Network tab → Look for `GET /api/developers` call
   - Verify response status (401 = auth issue, 404 = endpoint not found)
5. Search for a developer name in search box
6. Click **MESSAGE** button on any developer card
7. **Verify navigation**: URL should be `/messages?userId=2&userName=Jane%20Smith&userRole=DEVELOPER`
8. **Check console logs**:
   ```
   MessagingPage: Setting userId: 1 role: CLIENT
   ChatList: Loading chats for userId: 1
   WebSocketService: Connecting to ws://localhost:8081/ws
   ```

**Expected Result**: ✅ Developer list loads, MESSAGE button navigates to chat

---

### Test 3: WebSocket Connection

**Objective**: Verify real-time messaging infrastructure

**Steps**:
1. On messaging page, open browser console
2. Look for WebSocket connection logs:
   ```
   ✅ WebSocket Connected
   WebSocketService: Subscribed to /user/1/queue/messages
   ```
3. If connection fails:
   ```
   ❌ WebSocket Connection Error
   ```
   - Check: Is backend WebSocket endpoint `/ws` accessible?
   - Check: CORS settings in backend SecurityConfig
   - Check: JWT token in localStorage

**Expected Result**: ✅ WebSocket connects successfully

---

### Test 4: Developer Views Projects & Messages Client

**Objective**: Developer browses projects and contacts client

**Steps**:
1. Open **incognito window** (to test as different user)
2. Navigate to `http://localhost:5175/signup`
3. Register as DEVELOPER:
   - First Name: Jane
   - Last Name: Smith
   - Email: jane@test.com
   - Role: DEVELOPER
4. After login, go to **My Projects** (`/developer/projects`)
5. Backend should return projects assigned to this developer
6. **Check console**:
   ```
   📥 Fetching projects for developer ID: 2
   📦 Received projects: [{ id: 1, clientId: 1, projectName: '...' }]
   ```
7. Find project card with **💬 Message Client** button
8. Click the button
9. **Verify navigation**: `/messages?userId=1&userName=John%20Doe&userRole=CLIENT&projectId=1`

**Expected Result**: ✅ Project list loads, message button works

---

### Test 5: Send Messages (Real-Time)

**Objective**: Test bidirectional messaging between users

**Setup**:
- Window 1: CLIENT (John) at `/messages` talking to Developer Jane
- Window 2 (Incognito): DEVELOPER (Jane) at `/messages` talking to Client John

**Steps**:
1. **Window 1 (John/CLIENT)**: Type "Hello Jane!" and send
2. **Check console**:
   ```
   WebSocketService: Sending message via WebSocket
   Sent: { senderId: 1, recipientId: 2, content: 'Hello Jane!', ... }
   ```
3. **Window 2 (Jane/DEVELOPER)**: Should receive message **instantly**
4. **Check console**:
   ```
   WebSocketService: Message received
   Received: { senderId: 1, content: 'Hello Jane!', ... }
   ```
5. **Window 2**: Reply "Hi John, how can I help?"
6. **Window 1**: Should see reply appear in real-time

**Expected Result**: ✅ Messages deliver instantly via WebSocket

---

### Test 6: REST Fallback (if WebSocket fails)

**Objective**: Verify REST API fallback mechanism

**Steps**:
1. Disconnect WebSocket (in browser console):
   ```javascript
   // Force disconnect
   window.location.reload()
   ```
2. Send a message while WebSocket is connecting
3. **Check console**:
   ```
   WebSocket not connected, using REST API
   Sending via REST: POST /api/messages/send
   ```
4. Message should still send via REST endpoint

**Expected Result**: ✅ Messages send via REST if WebSocket unavailable

---

## 🐛 Common Issues & Solutions

### Issue 1: "Cannot connect to backend server"

**Symptoms**: ChatList shows error message

**Solution**:
```bash
# Check if backend is running
curl http://localhost:8081/actuator/health

# If not running, start Spring Boot:
cd /path/to/backend
./mvnw spring-boot:run
```

---

### Issue 2: "Failed to load developers" (401 Unauthorized)

**Symptoms**: Network tab shows 401 response

**Root Cause**: JWT token missing or invalid

**Solution**:
1. Log out and log in again
2. Check localStorage in console:
   ```javascript
   localStorage.getItem('devconnect_token')
   ```
3. If null, user needs to re-authenticate
4. Verify backend SecurityConfig allows `/api/developers` endpoint

---

### Issue 3: "No developers found" (Empty list)

**Symptoms**: FindDevelopers page shows empty state

**Root Cause**: Database has no DEVELOPER role users

**Solution**:
```sql
-- Check database
SELECT * FROM users WHERE user_role = 'DEVELOPER';

-- If empty, register some test developers via signup page
```

---

### Issue 4: WebSocket connection fails

**Symptoms**: Console shows WebSocket error

**Possible Causes**:
1. Backend WebSocket endpoint not configured
2. CORS blocking WebSocket handshake
3. Wrong WebSocket URL

**Solution**:
```java
// Backend WebSocketConfig.java should have:
@Override
public void registerStompEndpoints(StompEndpointRegistry registry) {
    registry.addEndpoint("/ws")
        .setAllowedOrigins("http://localhost:5175", "http://localhost:5173")
        .withSockJS();
}
```

---

### Issue 5: "No clients for your projects yet"

**Symptoms**: Messaging page shows this message after login

**Root Cause**: This is NORMAL for:
- Fresh database with no chat history
- User has no active conversations yet

**Solution**:
- This is expected behavior
- Start a conversation by:
  1. CLIENT: Go to Find Developers → Click MESSAGE
  2. DEVELOPER: Go to My Projects → Click MESSAGE CLIENT
- After first message, chat will appear in list

---

## 📊 Success Criteria

### ✅ Integration Complete When:

- [ ] Client can search and message developers
- [ ] Developer can message clients from project cards
- [ ] WebSocket connects successfully
- [ ] Messages deliver in real-time (< 1 second)
- [ ] Chat list shows all conversations
- [ ] Unread counts update correctly
- [ ] No console errors
- [ ] Backend logs show message delivery

---

## 🔧 Debug Commands

### Frontend Debugging

```javascript
// In browser console:

// 1. Check current user
console.log('User:', JSON.parse(localStorage.getItem('devconnect_user')))

// 2. Check JWT token
console.log('Token:', localStorage.getItem('devconnect_token'))

// 3. Manually test API call
fetch('http://localhost:8081/api/developers', {
  headers: {
    'Authorization': 'Bearer ' + localStorage.getItem('devconnect_token')
  }
})
.then(r => r.json())
.then(data => console.log('Developers:', data))

// 4. Check WebSocket connection
// (Look for websocketService in console logs)

// 5. Clear localStorage and retry
localStorage.clear()
window.location.reload()
```

---

## 📞 Backend Team Questions

If issues persist, ask your backend team:

1. **"What is the exact endpoint path to get all developers?"**
   - Current assumption: `GET /api/developers`
   - Alternative: `GET /api/users/developers`?

2. **"What fields does DeveloperResponseDTO contain?"**
   - Need: `id`, `username`, `email`, `firstName`, `lastName`
   - Optional: `specialization`, `rating`, `bio`

3. **"Is the WebSocket endpoint `/ws` active?"**
   - Test: `ws://localhost:8081/ws`
   - Needs SockJS support

4. **"Are CORS headers allowing localhost:5175?"**
   - Frontend runs on port 5175
   - WebSocket handshake needs CORS approval

5. **"What authentication is required?"**
   - JWT in Authorization header?
   - Format: `Bearer {token}`

---

## 📝 Test Report Template

After testing, fill this out:

```
Test Date: _______________
Tester: _______________

✅ / ❌ Registration with username generation
✅ / ❌ Login and JWT token storage
✅ / ❌ Find Developers page loads
✅ / ❌ Search developers works
✅ / ❌ MESSAGE button navigates correctly
✅ / ❌ Developer views projects
✅ / ❌ MESSAGE CLIENT button works
✅ / ❌ WebSocket connects
✅ / ❌ Messages send real-time
✅ / ❌ Chat list updates
✅ / ❌ No console errors

Issues Found:
1. ___________________________
2. ___________________________
3. ___________________________

Notes:
___________________________________
```

---

**Good luck with testing! 🚀**
