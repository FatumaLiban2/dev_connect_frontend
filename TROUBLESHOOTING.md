# 🔧 Troubleshooting Guide

## Problem 1: Cannot Search for Developers/Clients in Messages

### **Symptoms:**
- Click the **+ button** in Messages page
- Modal opens but shows "No users available" or error
- Cannot see list of developers/clients to start conversation

### **Root Causes & Solutions:**

#### **Cause 1: Backend Endpoints Not Implemented**

**Check if these endpoints exist:**

```bash
# For Developers searching for Clients:
curl http://localhost:8081/api/users/role/CLIENT \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# For Clients searching for Developers:
curl http://localhost:8081/api/developers \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**If you get 404 Not Found:**
- Your backend doesn't have these endpoints yet
- Tell backend team to implement them (see BACKEND_ENDPOINTS_REQUIRED.md)

---

#### **Cause 2: No Users in Database**

**Check your database:**
```sql
-- Check if there are developers
SELECT * FROM users WHERE user_role = 'DEVELOPER';

-- Check if there are clients
SELECT * FROM users WHERE user_role = 'CLIENT';
```

**If empty:**
- Register test users via signup page
- Register at least 1 CLIENT and 1 DEVELOPER

---

#### **Cause 3: JWT Token Missing/Invalid**

**Open browser console (F12) and run:**
```javascript
console.log('Token:', localStorage.getItem('devconnect_token'));
console.log('User:', JSON.parse(localStorage.getItem('devconnect_user')));
```

**If token is null:**
- Log out and log in again
- Check backend login response includes `accessToken` field

---

## Problem 2: Developer Cannot See Projects Created by Client

### **Symptoms:**
- Client creates project successfully
- Developer goes to "My Projects" or "Marketplace"
- Projects list is empty or doesn't show the new project

### **Root Causes & Solutions:**

#### **Cause 1: Project Status Issue**

When client creates project, backend should set `status = "PENDING"` or `"AVAILABLE"`.

**Check in database:**
```sql
-- See all projects and their status
SELECT project_id, project_name, status, client_id, dev_id, created_at 
FROM projects 
ORDER BY created_at DESC;
```

**Expected:**
- New projects should have `status = 'PENDING'`
- `dev_id` should be `NULL` (no developer assigned yet)

**If status is wrong:**
- Backend is setting wrong default status
- Should be `PENDING` not `IN_PROGRESS` or `COMPLETED`

---

#### **Cause 2: Wrong API Endpoint**

**Developer's "My Projects" page calls:**
```
GET /api/projects/developer/{devId}
```

This shows **projects assigned to that developer**, NOT available projects!

**For marketplace/available projects, should call:**
```
GET /api/projects/available
```

**Fix:** I need to create a "Browse Available Projects" page for developers.

---

#### **Cause 3: Database dev_id Constraint**

If you saw the earlier error about `dev_id` being NULL, the backend database schema needs this fix:

```sql
ALTER TABLE projects ALTER COLUMN dev_id DROP NOT NULL;
```

This allows projects to exist without an assigned developer.

---

## Quick Diagnostic Commands

### **1. Check if Backend is Running**
```bash
curl http://localhost:8081/actuator/health
```

### **2. Check if You're Logged In**
Open browser console:
```javascript
const user = JSON.parse(localStorage.getItem('devconnect_user'));
const token = localStorage.getItem('devconnect_token');
console.log('User:', user);
console.log('Token:', token ? 'EXISTS' : 'MISSING');
console.log('Role:', user?.userRole);
```

### **3. Test Developer Endpoint**
```bash
# Replace YOUR_TOKEN with actual JWT token
curl http://localhost:8081/api/developers \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### **4. Test Available Projects Endpoint**
```bash
curl http://localhost:8081/api/projects/available \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### **5. Check Database**
```sql
-- Count users by role
SELECT user_role, COUNT(*) 
FROM users 
GROUP BY user_role;

-- Count projects by status
SELECT status, COUNT(*) 
FROM projects 
GROUP BY status;

-- See latest projects
SELECT * FROM projects 
ORDER BY created_at DESC 
LIMIT 5;
```

---

## What to Share with Me

If still having issues, open browser console (F12) and share:

1. **Console Logs** - Any red error messages
2. **Network Tab** - Look at failed API calls (red ones)
3. **Error Details** - Right-click failed request → Copy → Copy as cURL

Example of what I need:
```
Failed to load developers: 404 Not Found
GET http://localhost:8081/api/developers

Response: {"error": "Endpoint not found"}
```

---

## Summary of Fixes Needed

### **Backend Team Must:**
1. ✅ Implement `GET /api/developers` endpoint
2. ✅ Implement `GET /api/users/role/{role}` endpoint  
3. ✅ Implement `GET /api/projects/available` endpoint
4. ✅ Allow `dev_id` to be NULL in database
5. ✅ Set project status to `PENDING` on creation
6. ✅ Return proper DTOs with all required fields

### **Frontend (I Will):**
1. ⏳ Create "Browse Projects" / "Marketplace" page for developers
2. ⏳ Add better error messages in New Chat modal
3. ⏳ Add loading states for API calls

---

**Let me know which specific error you're seeing and I can help fix it!** 🚀
