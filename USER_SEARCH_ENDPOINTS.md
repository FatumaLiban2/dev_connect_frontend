# User Search Endpoints Documentation

## Overview
The application uses a unified search endpoint `/api/users/search` to find users by role and search query.

## Endpoints

### 1. Get All Developers
**Used by:** Clients looking for developers

```http
GET /api/users/search?role=DEVELOPER
```

**Example:**
```javascript
// Get all developers
const developers = await ApiService.getUsersByRole('DEVELOPER');
```

---

### 2. Search Developers by Name/Email
**Used by:** Clients searching for specific developers

```http
GET /api/users/search?query=john&role=DEVELOPER
```

**Example:**
```javascript
// Search for developers named "john"
const results = await ApiService.searchUsers('DEVELOPER', 'john');
```

---

### 3. Get All Clients
**Used by:** Developers looking for clients

```http
GET /api/users/search?role=CLIENT
```

**Example:**
```javascript
// Get all clients
const clients = await ApiService.getUsersByRole('CLIENT');
```

---

### 4. Search Clients by Name/Email
**Used by:** Developers searching for specific clients

```http
GET /api/users/search?query=startup&role=CLIENT
```

**Example:**
```javascript
// Search for clients with "startup" in name/email
const results = await ApiService.searchUsers('CLIENT', 'startup');
```

---

### 5. Search All Users
**Used by:** Admin or universal search functionality

```http
GET /api/users/search?query=mohamed
```

**Example:**
```javascript
// Search all users regardless of role
const results = await ApiService.searchUsers(null, 'mohamed');
```

---

## Implementation Details

### ApiService Methods

```javascript
// src/services/ApiService.js

/**
 * Search users by role and optional query
 * @param {string} role - 'DEVELOPER' or 'CLIENT' (optional)
 * @param {string} query - Search query for name/email (optional)
 * @returns {Promise<Array>} Array of users matching criteria
 */
async searchUsers(role = null, query = null) {
  const params = new URLSearchParams();
  if (role) params.append('role', role);
  if (query) params.append('query', query);

  const url = `${API_BASE_URL}/users/search${params.toString() ? '?' + params.toString() : ''}`;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: this.getAuthHeaders()
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to search users');
  }

  return response.json();
}

/**
 * Get all users by role (DEVELOPER or CLIENT)
 * @param {string} role - 'DEVELOPER' or 'CLIENT'
 */
async getUsersByRole(role) {
  return this.searchUsers(role, null);
}
```

---

## NewChatModal Integration

### Initial Load
When the modal opens, it loads all users of the opposite role:

```javascript
// Developers see all clients
if (userRole === 'DEVELOPER') {
  data = await ApiService.getUsersByRole('CLIENT');
}

// Clients see all developers
else {
  data = await ApiService.getUsersByRole('DEVELOPER');
}
```

### Real-Time Search
As the user types, search is performed with 300ms debounce:

```javascript
const searchUsersWithQuery = async (query) => {
  const targetRole = userRole === 'DEVELOPER' ? 'CLIENT' : 'DEVELOPER';
  
  // Search with both role and query
  const data = await ApiService.searchUsers(targetRole, query);
  
  setUsers(data);
};
```

---

## Testing

### Browser Console Testing

```javascript
// 1. Get auth token
const token = localStorage.getItem('devconnect_token');

// 2. Test getting all developers
fetch('http://localhost:8081/api/users/search?role=DEVELOPER', {
  headers: { 'Authorization': `Bearer ${token}` }
})
.then(r => r.json())
.then(console.log);

// 3. Test searching developers by name
fetch('http://localhost:8081/api/users/search?query=john&role=DEVELOPER', {
  headers: { 'Authorization': `Bearer ${token}` }
})
.then(r => r.json())
.then(console.log);

// 4. Test getting all clients
fetch('http://localhost:8081/api/users/search?role=CLIENT', {
  headers: { 'Authorization': `Bearer ${token}` }
})
.then(r => r.json())
.then(console.log);

// 5. Test searching all users
fetch('http://localhost:8081/api/users/search?query=mohamed', {
  headers: { 'Authorization': `Bearer ${token}` }
})
.then(r => r.json())
.then(console.log);
```

---

## Expected Response Format

```json
[
  {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "DEVELOPER",
    "avatar": null,
    "createdAt": "2025-01-15T10:30:00"
  },
  {
    "id": 2,
    "username": "startup_tech",
    "email": "contact@startup.com",
    "firstName": "Tech",
    "lastName": "Startup",
    "role": "CLIENT",
    "avatar": null,
    "createdAt": "2025-01-16T14:20:00"
  }
]
```

---

## Features

### ✅ Unified Endpoint
- Single `/api/users/search` endpoint handles all search scenarios
- Cleaner API design
- Easier to maintain

### ✅ Real-Time Search
- 300ms debounce prevents excessive API calls
- Backend handles the search logic
- Instant results as user types

### ✅ Role-Based Filtering
- Developers only see clients
- Clients only see developers
- Current user automatically filtered out

### ✅ Visual Feedback
- Loading spinner while fetching users
- Small spinner in search box during search
- Error handling with retry button
- Empty state messages

---

## Backend Requirements

The backend must implement:

```java
@GetMapping("/api/users/search")
public ResponseEntity<List<UserDTO>> searchUsers(
    @RequestParam(required = false) String role,
    @RequestParam(required = false) String query
) {
    // If both role and query provided: search by both
    // If only role provided: get all users with that role
    // If only query provided: search all users
    // If neither provided: return all users (or error)
}
```

### Search Logic:
- `query` should search in: username, email, firstName, lastName
- Search should be case-insensitive
- Should return empty array if no matches
- Should exclude inactive/deleted users
- Should include proper pagination if needed

---

## Migration from Old Endpoints

### Before:
```javascript
// Old: Multiple different endpoints
ApiService.getAllDevelopers()        // GET /api/developers
ApiService.getUsersByRole('CLIENT')  // GET /api/users/role/CLIENT
```

### After:
```javascript
// New: Unified search endpoint
ApiService.getUsersByRole('DEVELOPER')      // GET /api/users/search?role=DEVELOPER
ApiService.searchUsers('CLIENT', 'john')    // GET /api/users/search?query=john&role=CLIENT
```

---

## Success Criteria

- ✅ NewChatModal opens with list of users
- ✅ Typing in search box triggers backend search
- ✅ Results update in real-time with 300ms debounce
- ✅ Developers see only clients, clients see only developers
- ✅ Search works by name, email, username
- ✅ Current user never appears in results
- ✅ Console logs show correct API calls with parameters
- ✅ Network tab shows: `GET /api/users/search?role=X&query=Y`

---

## Troubleshooting

### No users appearing:
1. Check backend endpoint is implemented
2. Verify JWT token in Authorization header
3. Check Network tab for 401/403 errors
4. Ensure backend returns array (not object)

### Search not working:
1. Check console for API errors
2. Verify query parameter is being sent
3. Test backend endpoint directly with cURL
4. Check backend search logic (case-insensitive, multiple fields)

### Wrong users showing:
1. Verify role parameter is correct
2. Check backend user filtering logic
3. Ensure current user is being filtered out
4. Check user role field in database

---

## Related Files

- `src/services/ApiService.js` - API methods
- `src/components/Chat/NewChatModal.jsx` - Search UI
- `src/styles/Chat.css` - Search styling
- `USER_SEARCH_ENDPOINTS.md` - This documentation
