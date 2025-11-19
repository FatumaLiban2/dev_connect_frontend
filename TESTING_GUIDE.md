# Testing Guide - Messaging System with Read Receipts

## Pre-Testing Checklist

✅ Backend running on `http://localhost:8081`
✅ Frontend running on `http://localhost:5176`
✅ Database (PostgreSQL) is running
✅ WebSocket endpoint available at `ws://localhost:8081/ws`
✅ All API endpoints require JWT token

## Test Scenarios

### 1. Basic Messaging Flow

#### Steps:
1. **Login as Client**
   - Go to Login page
   - Enter credentials
   - Verify token stored as `accessToken` in localStorage
   
2. **Navigate to Messaging**
   - Click "Messages" in navigation
   - See list of conversations (or empty state)
   
3. **Start New Chat**
   - Click "New Chat" button
   - Search for a developer by name or email
   - Select developer from list
   - Verify chat interface opens

4. **Send Messages**
   - Type message in input field
   - Press Enter or click "Send"
   - **Expected**: Message appears on right side with purple gradient
   - **Expected**: Single checkmark ✓ appears (sent)

5. **Receive Messages**
   - Login as Developer in another browser/tab
   - Send message to Client
   - **Expected**: Client sees message on left side with white background
   - **Expected**: Message automatically marked as read
   - **Expected**: Developer sees green double checkmarks ✓✓

### 2. Read Receipt Testing

#### Test Case A: Opening Existing Conversation
1. Login as Client
2. Have Developer send 3 messages (don't open chat yet)
3. Open chat with Developer
4. **Expected**: All 3 messages marked as read immediately
5. **Expected**: Developer sees green checkmarks on all messages

#### Test Case B: Real-time Read Receipts
1. Keep both Client and Developer chats open
2. Developer sends message
3. **Expected**: Client receives message instantly (WebSocket)
4. **Expected**: Message automatically marked as read
5. **Expected**: Developer sees checkmark turn green instantly

#### Test Case C: Read Receipt Status Flow
```
Send message    → ✓    (Light gray - Sent)
                ↓
Message arrives → ✓✓   (Gray - Delivered)
                ↓
User opens chat → ✓✓   (Green - Read)
```

### 3. Styling Verification

#### Visual Checks:
- [ ] Chat header has purple gradient background
- [ ] Connection status shows 🟢 Connected (green)
- [ ] Sent messages have purple gradient bubbles
- [ ] Received messages have white bubbles with shadow
- [ ] Timestamps display correctly (HH:MM AM/PM format)
- [ ] Read receipts show correct colors:
  - Sent: Light gray ✓
  - Delivered: Gray ✓✓
  - Read: Green ✓✓

#### Animation Checks:
- [ ] New messages fade in smoothly
- [ ] Typing indicator shows 3 bouncing dots
- [ ] Send button lifts on hover
- [ ] Smooth scrolling to bottom when new message arrives

#### Mobile Responsive:
- [ ] Open on mobile viewport (< 768px)
- [ ] Message bubbles take 85% width
- [ ] Input font size 16px (prevents zoom)
- [ ] Chat container fills full height

### 4. WebSocket Testing

#### Connection Tests:
1. Open chat
2. Check header shows "🟢 Connected"
3. Send message
4. **Expected**: Message delivered via WebSocket instantly

#### Disconnection Recovery:
1. Stop backend server
2. **Expected**: Status changes to "🔴 Disconnected"
3. Try sending message
4. **Expected**: Falls back to REST API
5. Restart backend
6. **Expected**: Reconnects automatically

#### Typing Indicator:
1. Client starts typing
2. **Expected**: Developer sees "Client is typing..." with animated dots
3. Client stops typing for 1 second
4. **Expected**: Typing indicator disappears

### 5. Error Handling

#### Test Cases:
1. **No Internet**: Try sending message
   - **Expected**: Error alert "Failed to send message"
   
2. **Invalid Token**: Clear localStorage
   - **Expected**: API calls fail with 401
   - **Expected**: Redirect to login

3. **Empty Message**: Try sending blank message
   - **Expected**: Send button disabled
   - **Expected**: Nothing happens on Enter

4. **Large Message**: Send 1000 character message
   - **Expected**: Message wraps correctly in bubble
   - **Expected**: Doesn't break layout

### 6. Performance Testing

#### Load Tests:
1. **Message History**: Load conversation with 50+ messages
   - **Expected**: Loads within 2 seconds
   - **Expected**: Scrolls smoothly

2. **Rapid Messaging**: Send 10 messages quickly
   - **Expected**: All appear in order
   - **Expected**: No duplicates
   - **Expected**: Scroll stays at bottom

3. **Multiple Chats**: Switch between 3 different conversations
   - **Expected**: History loads correctly for each
   - **Expected**: No message mixing between chats

## API Endpoints Being Tested

### REST API (messagingApi.js)
```
✅ GET  /api/messages/user/{userId}/chats           - Get all conversations
✅ GET  /api/messages/conversation/{user1}/{user2}  - Get conversation history
✅ POST /api/messages/send                          - Send message (fallback)
✅ POST /api/messages/read                          - Mark messages as read
✅ POST /api/messages/user/{userId}/status          - Update user status
```

### WebSocket (WebSocketService.js)
```
✅ CONNECT    ws://localhost:8081/ws               - Establish connection
✅ SUBSCRIBE  /user/{userId}/queue/messages        - Receive messages
✅ SUBSCRIBE  /user/{userId}/queue/typing          - Receive typing indicators
✅ SEND       /app/sendMessage                     - Send message
✅ SEND       /app/typing                          - Send typing indicator
```

## Authorization Testing

### Token Storage Check:
```javascript
// Open browser console and check:
localStorage.getItem('accessToken')      // Should have JWT
localStorage.getItem('devconnect_token') // Should have JWT
localStorage.getItem('token')            // Should have JWT
```

### API Headers Check:
```javascript
// All requests should include:
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

## Common Issues & Solutions

### Issue 1: Messages not sending
**Symptoms**: Message doesn't appear after clicking Send
**Solutions**:
- Check WebSocket connection status
- Verify backend is running on port 8081
- Check browser console for errors
- Verify JWT token exists in localStorage

### Issue 2: Read receipts not updating
**Symptoms**: Checkmarks stay gray instead of turning green
**Solutions**:
- Check backend `/api/messages/read` endpoint
- Verify messageIds are being sent correctly
- Check browser console for API errors
- Ensure both users are in the same conversation

### Issue 3: Styling looks wrong
**Symptoms**: No purple gradient, plain styling
**Solutions**:
- Clear browser cache
- Verify Chat.css loaded (check Network tab)
- Check for CSS syntax errors
- Restart dev server

### Issue 4: WebSocket disconnects frequently
**Symptoms**: Connection status flickers red/green
**Solutions**:
- Check backend WebSocket configuration
- Verify CORS settings
- Check firewall/proxy settings
- Review backend logs for connection errors

## Expected Console Output

### Successful Connection:
```
[WebSocket] Connecting to ws://localhost:8081/ws
[WebSocket] Connected successfully
[WebSocket] Subscribed to /user/123/queue/messages
[WebSocket] Subscribed to /user/123/queue/typing
[API] Loaded 15 messages from conversation
[API] Marked 3 messages as read
```

### Successful Message Send:
```
[WebSocket] Sending message to user 456
[WebSocket] Message delivered
[API] Message status updated to 'delivered'
```

### Read Receipt Update:
```
[API] Marking messages as read: [789, 790, 791]
[API] Successfully marked 3 messages as read
[State] Updated message statuses in UI
```

## Database Verification (Optional)

### Check Messages Table:
```sql
SELECT id, sender_id, receiver_id, text, status, timestamp 
FROM messages 
WHERE sender_id = 123 OR receiver_id = 123
ORDER BY timestamp DESC
LIMIT 10;
```

### Expected Status Values:
- `sent` - Message sent but not delivered
- `delivered` - Message delivered to recipient
- `read` - Message opened by recipient

## Success Criteria

✅ All messages send successfully
✅ Messages appear with correct styling (purple/white)
✅ Read receipts update to green when chat opened
✅ Typing indicator animates smoothly
✅ WebSocket connection stays stable
✅ No console errors
✅ Mobile responsive design works
✅ All API calls include Authorization header

## Testing Checklist Summary

- [ ] Login as Client and Developer
- [ ] Send messages both directions
- [ ] Verify read receipts turn green
- [ ] Test typing indicators
- [ ] Check WebSocket connection stability
- [ ] Verify mobile responsive design
- [ ] Test error handling (disconnect, empty message)
- [ ] Verify message history loads correctly
- [ ] Check all styling matches design
- [ ] Verify no console errors

## Next Steps After Testing

1. **If all tests pass**: ✅ System ready for production
2. **If issues found**: Document them and create fix plan
3. **Performance**: Monitor message delivery speed
4. **Security**: Verify JWT tokens expire correctly
5. **Scalability**: Test with more users and messages

## Support Resources

- **Documentation**: See MESSAGING_STYLING_AND_READ_RECEIPTS.md
- **Visual Guide**: See MESSAGING_UI_GUIDE.md
- **Backend Guide**: See MESSAGING_INTEGRATION_GUIDE.md
- **Auth Guide**: See AUTHENTICATION_TOKEN_GUIDE.md

---

**Testing Environment**:
- Frontend: http://localhost:5176
- Backend: http://localhost:8081
- WebSocket: ws://localhost:8081/ws
- Database: PostgreSQL (default port 5432)

**Last Updated**: Now
**Status**: Ready for testing ✅
