# Client Projects Not Showing - Debug Guide

## Problem
Client can't see their projects even though projects exist in the database.

---

## Step 1: Check User ID and Token

Open browser console (F12) and run:

```javascript
// 1. Check current user
const user = JSON.parse(localStorage.getItem('devconnect_user'));
console.log('Current User:', user);
console.log('User ID:', user.id || user.userId);
console.log('User Role:', user.role);

// 2. Check token
const token = localStorage.getItem('devconnect_token');
console.log('Token:', token ? 'EXISTS ✅' : 'MISSING ❌');
console.log('Token preview:', token ? token.substring(0, 30) + '...' : 'N/A');
```

**Expected Output:**
- User ID should be a number (e.g., `1`, `2`, `3`)
- Role should be `"CLIENT"` or `"client"`
- Token should exist

---

## Step 2: Test API Endpoint Manually

```javascript
// Get user ID and token
const user = JSON.parse(localStorage.getItem('devconnect_user'));
const clientId = user.id || user.userId;
const token = localStorage.getItem('devconnect_token');

// Test the endpoint
fetch(`http://localhost:8081/api/projects/client/${clientId}`, {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
})
.then(response => {
  console.log('Response Status:', response.status);
  console.log('Response OK:', response.ok);
  return response.json();
})
.then(data => {
  console.log('✅ Projects received:', data);
  console.log('Number of projects:', data.length);
  if (data.length > 0) {
    console.log('First project:', data[0]);
  }
})
.catch(error => {
  console.error('❌ Error:', error);
});
```

**Expected Output:**
- Status: `200`
- Array of projects (even if empty)

**Common Issues:**
- `401 Unauthorized` → Token expired or invalid
- `403 Forbidden` → User doesn't have permission
- `404 Not Found` → Endpoint doesn't exist or wrong URL
- `500 Server Error` → Backend error

---

## Step 3: Check Database Directly

If you have access to the database, run this SQL query:

```sql
-- Check if projects exist for this client
SELECT * FROM projects WHERE client_id = YOUR_CLIENT_ID_HERE;

-- Check all projects
SELECT id, title, client_id, dev_id, status FROM projects;

-- Check user table
SELECT id, username, email, role FROM users WHERE role = 'CLIENT';
```

**Things to verify:**
- Does your client user exist in `users` table?
- What is the actual `id` of your client user?
- Do projects exist with matching `client_id`?
- Check `client_id` column name (might be `clientId` in some backends)

---

## Step 4: Check Network Tab

1. Open DevTools → **Network** tab
2. Refresh the My Projects page
3. Look for request: `GET /api/projects/client/{id}`

**Check:**
- Request URL: Should be `http://localhost:8081/api/projects/client/1` (or your client ID)
- Request Headers: Should include `Authorization: Bearer ...`
- Response: What status code? What data returned?

---

## Step 5: Backend Endpoint Verification

Ask your backend team to verify:

```java
// Endpoint should be:
@GetMapping("/api/projects/client/{clientId}")
public ResponseEntity<List<ProjectDTO>> getProjectsByClient(@PathVariable Long clientId) {
    // Should return ALL projects where client_id = clientId
    // Should NOT filter by status (unless specifically requested)
    // Should return empty array [] if no projects (not 404)
}
```

**Common Backend Issues:**
- Endpoint uses different parameter name (e.g., `userId` instead of `clientId`)
- Endpoint filters out projects with `dev_id = null`
- Wrong JOIN causing projects to not appear
- Case sensitivity: `client_id` vs `clientId`

---

## Step 6: Test with cURL

Test the backend directly without frontend:

```bash
# Replace YOUR_CLIENT_ID and YOUR_TOKEN
curl -X GET "http://localhost:8081/api/projects/client/1" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json"
```

**Expected Response:**
```json
[
  {
    "id": 1,
    "title": "My Project",
    "description": "Project description",
    "clientId": 1,
    "devId": null,
    "status": "PENDING",
    "budget": 5000.0,
    "createdAt": "2025-01-15T10:30:00"
  }
]
```

---

## Step 7: Common Frontend Issues

### Issue 1: User ID Not Found

**Symptom:** Console shows `"User ID not found. Cannot fetch projects."`

**Solution:**
```javascript
// Check localStorage structure
const user = JSON.parse(localStorage.getItem('devconnect_user'));
console.log('User object:', user);

// User ID might be under different keys:
const userId = user.id || user.userId || user.user_id || user.clientId;
```

### Issue 2: Wrong Role

**Symptom:** User is logged in but role is wrong

**Solution:**
```javascript
// After login, verify role is saved correctly
const user = JSON.parse(localStorage.getItem('devconnect_user'));
if (user.role !== 'CLIENT' && user.role !== 'client') {
  console.error('Wrong role:', user.role);
  // User might be logged in as DEVELOPER
}
```

### Issue 3: Token Expired

**Symptom:** API returns `401 Unauthorized`

**Solution:**
```javascript
// Test if token is valid
fetch('http://localhost:8081/api/users/me', {
  headers: { 'Authorization': `Bearer ${localStorage.getItem('devconnect_token')}` }
})
.then(r => {
  if (r.status === 401) {
    console.error('Token expired or invalid - need to re-login');
  }
});
```

---

## Step 8: Force Reload Projects

Add this temporary debug button to `MyProjectClient.jsx`:

```jsx
<button 
  onClick={async () => {
    console.log('=== DEBUG: Force Reload Projects ===');
    const user = JSON.parse(localStorage.getItem('devconnect_user'));
    console.log('User:', user);
    
    const clientId = user.id || user.userId;
    console.log('Client ID:', clientId);
    
    try {
      const projects = await ApiService.getProjectsByClient(clientId);
      console.log('✅ Projects fetched:', projects);
      setProjects(projects.map(mapBackendProjectToFrontend));
    } catch (error) {
      console.error('❌ Error fetching projects:', error);
    }
  }}
  style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 9999 }}
>
  🔍 Debug Projects
</button>
```

---

## Quick Fix Checklist

Run through this checklist in order:

1. ✅ **User logged in?**
   ```javascript
   localStorage.getItem('devconnect_user') !== null
   ```

2. ✅ **User is CLIENT?**
   ```javascript
   JSON.parse(localStorage.getItem('devconnect_user')).role === 'CLIENT'
   ```

3. ✅ **User has ID?**
   ```javascript
   const user = JSON.parse(localStorage.getItem('devconnect_user'));
   console.log('ID:', user.id || user.userId);
   ```

4. ✅ **Token exists?**
   ```javascript
   localStorage.getItem('devconnect_token') !== null
   ```

5. ✅ **Backend running?**
   ```javascript
   fetch('http://localhost:8081/api/projects/client/1').then(r => console.log('Backend:', r.status))
   ```

6. ✅ **Projects exist in DB?**
   ```sql
   SELECT * FROM projects WHERE client_id = 1;
   ```

7. ✅ **Network request sent?**
   - Check DevTools Network tab
   - Look for `/api/projects/client/{id}`

8. ✅ **Response received?**
   - Status 200?
   - Array returned?
   - Data structure correct?

---

## Most Likely Causes

### 1. Wrong User ID (60% of cases)
The `clientId` in the API call doesn't match the `client_id` in your database projects.

**Fix:** Check what ID the frontend is using vs what's in the database.

### 2. Backend Returns Empty Array (30% of cases)
Projects exist but backend query has wrong filter or JOIN issue.

**Fix:** Test backend endpoint with cURL using known project's `client_id`.

### 3. Token/Auth Issue (10% of cases)
Request rejected before reaching the query.

**Fix:** Check Network tab for 401/403 errors.

---

## Still Not Working?

### Run This Complete Diagnostic:

```javascript
console.log('=== CLIENT PROJECTS DIAGNOSTIC ===\n');

// 1. User Check
const user = JSON.parse(localStorage.getItem('devconnect_user'));
console.log('1️⃣ USER INFO:');
console.log('  - ID:', user?.id || user?.userId);
console.log('  - Role:', user?.role);
console.log('  - Email:', user?.email);
console.log('');

// 2. Token Check
const token = localStorage.getItem('devconnect_token');
console.log('2️⃣ TOKEN INFO:');
console.log('  - Exists:', !!token);
console.log('  - Length:', token?.length);
console.log('  - Preview:', token?.substring(0, 30) + '...');
console.log('');

// 3. API Test
console.log('3️⃣ TESTING API ENDPOINT:');
const clientId = user?.id || user?.userId;
const url = `http://localhost:8081/api/projects/client/${clientId}`;
console.log('  - URL:', url);

fetch(url, {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
})
.then(response => {
  console.log('  - Status:', response.status);
  console.log('  - Status Text:', response.statusText);
  return response.json();
})
.then(data => {
  console.log('  - Response:', data);
  console.log('  - Count:', Array.isArray(data) ? data.length : 'Not an array!');
  console.log('\n✅ SUCCESS - Check response above');
})
.catch(error => {
  console.error('  - Error:', error);
  console.log('\n❌ FAILED - See error above');
});
```

**Copy the entire output** and share it with your backend developer.

---

## Need More Help?

Provide this information:
1. **Console output** from the diagnostic script above
2. **Network tab** screenshot showing the API request
3. **Database query result** showing projects for your client ID
4. **Backend logs** if available

This will help identify exactly where the issue is!
