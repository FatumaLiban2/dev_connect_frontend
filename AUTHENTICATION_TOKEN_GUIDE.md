# Authentication Token Guide

## ✅ Token Storage Strategy

Your app now properly stores JWT tokens in **three** localStorage keys for maximum compatibility:

### **Primary Key (Backend Standard)**
```javascript
localStorage.setItem('accessToken', token);  // ← Backend expects this
```

### **App Key (Internal Use)**
```javascript
localStorage.setItem('devconnect_token', token);
```

### **Backward Compatibility**
```javascript
localStorage.setItem('token', token);
```

---

## 🔑 How It Works

### **1. Login/Signup Flow**

When user logs in or signs up:

```javascript
// Backend response
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "...",
  "user": {
    "userId": 1,
    "email": "john@example.com",
    "userRole": "CLIENT"
  }
}

// Frontend stores (Login.jsx / Signup.jsx)
localStorage.setItem('accessToken', result.accessToken);
localStorage.setItem('devconnect_token', result.accessToken);
localStorage.setItem('token', result.accessToken);
localStorage.setItem('devconnect_user', JSON.stringify(result.user));
```

---

### **2. API Requests**

Every API call includes the token in the Authorization header:

```javascript
// ❌ WRONG - No authentication
fetch('http://localhost:8081/api/projects/available')

// ✅ CORRECT - With JWT token
fetch('http://localhost:8081/api/projects/available', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
  }
})
```

---

### **3. ApiService.getAuthHeaders()**

The `ApiService` class automatically handles this:

```javascript
// src/services/ApiService.js
getAuthHeaders() {
  const headers = {
    'Content-Type': 'application/json'
  };

  // Check all possible token keys (in priority order)
  let token = localStorage.getItem('accessToken') ||      // Backend key (primary)
              localStorage.getItem('devconnect_token') ||  // App key
              localStorage.getItem('token');               // Fallback

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
}
```

---

### **4. All API Methods Use Auth**

Every method in `ApiService.js` uses `getAuthHeaders()`:

```javascript
// ✅ Projects endpoint
async getProjectsByClient(clientId) {
  const response = await fetch(`${API_BASE_URL}/projects/client/${clientId}`, {
    headers: this.getAuthHeaders()  // ← Includes Authorization header
  });
  return response.json();
}

// ✅ Available projects endpoint
async getAvailableProjects() {
  const response = await fetch(`${API_BASE_URL}/projects/available`, {
    headers: this.getAuthHeaders()  // ← Includes Authorization header
  });
  return response.json();
}

// ✅ User search endpoint
async searchUsers(role, query) {
  const response = await fetch(`${API_BASE_URL}/users/search?...`, {
    headers: this.getAuthHeaders()  // ← Includes Authorization header
  });
  return response.json();
}
```

---

## 🧪 Testing Authentication

### **Browser Console Test**

```javascript
// 1. Check if token exists
console.log('Tokens:', {
  accessToken: localStorage.getItem('accessToken'),
  devconnect_token: localStorage.getItem('devconnect_token'),
  token: localStorage.getItem('token')
});

// 2. Test API call with token
const token = localStorage.getItem('accessToken');
fetch('http://localhost:8081/api/projects/available', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
})
.then(r => {
  console.log('Status:', r.status);
  return r.json();
})
.then(data => console.log('Projects:', data))
.catch(err => console.error('Error:', err));

// 3. Verify user is logged in
const user = JSON.parse(localStorage.getItem('devconnect_user'));
console.log('Current User:', {
  id: user.id,
  email: user.email,
  role: user.role
});
```

---

## 🔍 Debugging Token Issues

### **Issue 1: No Token Found**

**Symptoms:**
- Console shows: `⚠️ No token found! Authorization header NOT added.`
- API returns `401 Unauthorized`

**Check:**
```javascript
// Run in console
console.log('Storage:', {
  accessToken: localStorage.getItem('accessToken'),
  devconnect_token: localStorage.getItem('devconnect_token'),
  user: localStorage.getItem('devconnect_user')
});
```

**Solutions:**
1. **Re-login:** Token might have been cleared
2. **Check backend response:** Login might not be returning `accessToken`
3. **Check storage:** Token might be stored under different key

---

### **Issue 2: Token Expired**

**Symptoms:**
- API returns `401 Unauthorized` even though token exists
- Backend logs show "JWT expired"

**Check:**
```javascript
// Decode JWT to check expiration
const token = localStorage.getItem('accessToken');
if (token) {
  const payload = JSON.parse(atob(token.split('.')[1]));
  const exp = new Date(payload.exp * 1000);
  console.log('Token expires:', exp);
  console.log('Expired?', exp < new Date());
}
```

**Solution:** Re-login to get new token

---

### **Issue 3: Wrong Token Format**

**Symptoms:**
- Backend returns `401 Unauthorized`
- Backend logs show "Invalid token format"

**Check:**
```javascript
const token = localStorage.getItem('accessToken');
console.log('Token:', token);
console.log('Starts with Bearer?', token?.startsWith('Bearer'));
```

**Solution:** Remove "Bearer " prefix if stored in token:
```javascript
// Token should be stored WITHOUT "Bearer " prefix
localStorage.setItem('accessToken', 'eyJhbGciOiJ...');  // ✅ CORRECT

// NOT like this:
localStorage.setItem('accessToken', 'Bearer eyJhbGciOiJ...');  // ❌ WRONG
```

---

## 📋 Logout Flow

When user logs out, **all tokens are cleared**:

```javascript
// App.jsx handleLogout()
localStorage.removeItem('accessToken');
localStorage.removeItem('devconnect_token');
localStorage.removeItem('token');
localStorage.removeItem('devconnect_refresh_token');
localStorage.removeItem('devconnect_user');
```

---

## 🔐 Security Best Practices

### ✅ DO:
- Store token in `localStorage` for persistence
- Include `Authorization: Bearer ${token}` header in ALL API requests
- Clear tokens on logout
- Check token expiration before making requests
- Use HTTPS in production

### ❌ DON'T:
- Store token in cookies (XSS vulnerability)
- Send token in URL query parameters
- Store sensitive data in token payload
- Share tokens between users
- Log full token values in production

---

## 🎯 Quick Reference

| Action | Code |
|--------|------|
| **Get Token** | `localStorage.getItem('accessToken')` |
| **Check if Logged In** | `!!localStorage.getItem('accessToken')` |
| **Get Current User** | `JSON.parse(localStorage.getItem('devconnect_user'))` |
| **Make Authenticated Request** | `fetch(url, { headers: { 'Authorization': \`Bearer \${token}\` } })` |
| **Check Token Expiry** | `JSON.parse(atob(token.split('.')[1])).exp` |

---

## 🚀 Updated Files

These files now properly handle `accessToken`:

1. ✅ **src/services/ApiService.js** - Checks `accessToken` first
2. ✅ **src/components/Login.jsx** - Stores `accessToken` on login
3. ✅ **src/components/Signup.jsx** - Stores `accessToken` on signup
4. ✅ **src/App.jsx** - Clears `accessToken` on logout
5. ✅ **src/components/SidebarButton.jsx** - Clears `accessToken` on logout

---

## ✅ Verification Checklist

After login, verify these in console:

```javascript
// 1. Token exists
console.assert(localStorage.getItem('accessToken'), '❌ No accessToken!');

// 2. User exists
console.assert(localStorage.getItem('devconnect_user'), '❌ No user!');

// 3. User has ID
const user = JSON.parse(localStorage.getItem('devconnect_user'));
console.assert(user.id || user.userId, '❌ No user ID!');

// 4. Token is valid JWT (3 parts separated by dots)
const token = localStorage.getItem('accessToken');
console.assert(token.split('.').length === 3, '❌ Invalid JWT format!');

// 5. API call works
fetch('http://localhost:8081/api/projects/available', {
  headers: { 'Authorization': `Bearer ${token}` }
})
.then(r => console.log('✅ API works! Status:', r.status))
.catch(e => console.error('❌ API failed:', e));
```

---

## 🔧 Troubleshooting Commands

### Check Everything:
```javascript
console.log('=== AUTH DIAGNOSTIC ===');
console.log('1. Tokens:');
console.log('   accessToken:', !!localStorage.getItem('accessToken'));
console.log('   devconnect_token:', !!localStorage.getItem('devconnect_token'));
console.log('2. User:', JSON.parse(localStorage.getItem('devconnect_user') || '{}'));
console.log('3. Token Preview:', localStorage.getItem('accessToken')?.substring(0, 30));
```

### Test API:
```javascript
const token = localStorage.getItem('accessToken');
const user = JSON.parse(localStorage.getItem('devconnect_user'));
const clientId = user.id || user.userId;

fetch(`http://localhost:8081/api/projects/client/${clientId}`, {
  headers: { 'Authorization': `Bearer ${token}` }
})
.then(r => r.json())
.then(console.log)
.catch(console.error);
```

---

## 📚 Related Documentation

- `CLIENT_PROJECTS_DEBUG.md` - Debug projects not showing
- `ENDPOINT_VERIFICATION.md` - Test all endpoints
- `USER_SEARCH_ENDPOINTS.md` - User search API guide

---

**All API requests now include proper JWT authentication! 🔐✅**
