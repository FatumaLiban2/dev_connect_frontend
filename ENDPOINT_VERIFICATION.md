# ✅ Frontend Endpoints - VERIFICATION GUIDE

## Current Implementation Status

### ✅ **Correctly Implemented**

All three pages now call the **correct endpoints**:

| Page | User Role | Endpoint Used | Purpose |
|------|-----------|--------------|---------|
| **My Projects** (Client) | CLIENT | `GET /api/projects/client/{clientId}` | Shows ALL projects created by this client |
| **Browse Available Projects** | DEVELOPER | `GET /api/projects/available` | Shows unclaimed projects (devId=null) |
| **My Claimed Projects** | DEVELOPER | `GET /api/projects/developer/{devId}` | Shows projects claimed by this developer |

---

## 🧪 Testing Instructions

### **Test 1: Client Creates Project**

1. **Log in as CLIENT**
2. Go to "My Projects" (sidebar)
3. Click "Create New Project" button
4. Fill in:
   - Title: "Test Project"
   - Budget: 500
   - Timeline: (any future date)
   - Description: "Test description"
5. Click "Create Project"

**Expected Result:**
- ✅ Project appears in client's project list
- ✅ Status badge shows "Available" (blue)
- ✅ No developer assigned
- ✅ Console logs: `POST /api/projects/create` → Success

**Backend Verification:**
```sql
-- Check in database
SELECT project_id, project_name, dev_id, status, client_id 
FROM projects 
ORDER BY created_at DESC 
LIMIT 1;

-- Should show:
-- dev_id: null
-- status: PENDING
-- client_id: (your client's ID)
```

---

### **Test 2: Developer Browses Available Projects**

1. **Log in as DEVELOPER** (use different browser or incognito)
2. Go to **"Browse Available Projects"** (sidebar)
3. Should see info banner: "These are projects where no developer has been assigned yet"

**Expected Result:**
- ✅ Sees the project created by client in Test 1
- ✅ Project has "💬 Message Client" button
- ✅ Console logs: `GET /api/projects/available` → Returns array with project
- ✅ Project shows details: title, budget, timeline, description

**What to Check in Browser Console (F12):**
```javascript
// Should see:
📥 Fetching available projects...
GET http://localhost:8081/api/projects/available
Response: [
  {
    "projectId": 21,
    "projectName": "Test Project",
    "devId": null,  // ← Should be null
    "status": "PENDING",
    "clientId": 50,
    ...
  }
]
```

---

### **Test 3: Developer's "My Projects" Page (Empty)**

1. Still logged in as **DEVELOPER**
2. Go to **"My Claimed Projects"** (sidebar)

**Expected Result:**
- ✅ Shows empty state message
- ✅ Yellow banner: "You haven't claimed any projects yet"
- ✅ Console logs: `GET /api/projects/developer/{devId}` → Returns empty array `[]`
- ✅ Suggests going to "Browse Projects"

**Browser Console Should Show:**
```javascript
📥 Fetching projects for developer ID: 123
GET http://localhost:8081/api/projects/developer/123
Response: []  // ← Empty because developer hasn't claimed any projects yet
```

---

### **Test 4: Verify All Three Endpoints**

Open browser console (F12) and run these commands:

```javascript
// Get your auth token
const token = localStorage.getItem('devconnect_token');
const user = JSON.parse(localStorage.getItem('devconnect_user'));
console.log('User ID:', user.id);
console.log('User Role:', user.userRole);

// Test 1: Get available projects (any user can call this)
fetch('http://localhost:8081/api/projects/available', {
  headers: { 'Authorization': `Bearer ${token}` }
})
.then(r => r.json())
.then(data => console.log('Available Projects:', data));

// Test 2: Get client's projects (if you're a client)
fetch(`http://localhost:8081/api/projects/client/${user.id}`, {
  headers: { 'Authorization': `Bearer ${token}` }
})
.then(r => r.json())
.then(data => console.log('Client Projects:', data));

// Test 3: Get developer's projects (if you're a developer)
fetch(`http://localhost:8081/api/projects/developer/${user.id}`, {
  headers: { 'Authorization': `Bearer ${token}` }
})
.then(r => r.json())
.then(data => console.log('Developer Projects:', data));
```

---

## 📊 Expected Responses

### **GET /api/projects/available**
```json
[
  {
    "projectId": 21,
    "projectName": "deks project",
    "description": "good",
    "projectBudget": 100.00,
    "timeline": "2025-11-28T00:00:00",
    "status": "PENDING",
    "devId": null,  // ← KEY: Must be null
    "clientId": 50,
    "createdAt": "2025-11-18T22:36:41.904289"
  }
]
```

### **GET /api/projects/client/{clientId}**
```json
[
  {
    "projectId": 21,
    "projectName": "deks project",
    "devId": null,  // Shows as "Available" to client
    "clientId": 50,  // This client's ID
    "status": "PENDING",
    ...
  }
]
```

### **GET /api/projects/developer/{devId}** (when empty)
```json
[]  // Empty array - developer hasn't claimed any projects yet
```

---

## 🎯 Quick Debug Checklist

If **developer can't see projects**:

- [ ] Check browser console: Look for `GET /api/projects/available`
- [ ] Verify response: Should return array of projects where `devId: null`
- [ ] Check JWT token: `localStorage.getItem('devconnect_token')` should exist
- [ ] Verify backend: `curl http://localhost:8081/api/projects/available -H "Authorization: Bearer TOKEN"`
- [ ] Check database: Are there projects with `dev_id = NULL` and `status = 'PENDING'`?

If **client can't create projects**:

- [ ] Check error message in browser (red text box)
- [ ] Look at console: Should show `POST /api/projects/create`
- [ ] Common error: "dev_id cannot be null" → Backend needs database migration
- [ ] Verify backend allows NULL: `ALTER TABLE projects ALTER COLUMN dev_id DROP NOT NULL;`

---

## ✅ Success Criteria

Everything is working when:

1. ✅ Client creates project → Appears in their "My Projects" with "Available" status
2. ✅ Developer goes to "Browse Projects" → Sees the project
3. ✅ Developer goes to "My Claimed Projects" → Empty (until they claim one)
4. ✅ No console errors (red messages)
5. ✅ All three API calls succeed (200 OK responses)

---

## 🚀 Next Steps (Project Claiming)

To complete the workflow, you'll need a **"Claim Project" button** on Browse Projects:

```javascript
// Future feature to implement
const claimProject = async (projectId, developerId) => {
  await fetch(`http://localhost:8081/api/projects/${projectId}/claim`, {
    method: 'POST',
    headers: { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ devId: developerId })
  });
  
  // After claiming:
  // - Project moves from "Browse Projects" to "My Claimed Projects"
  // - Client sees status change from "Available" to "In Progress"
  // - Project's devId is now set to this developer's ID
};
```

---

**Everything is correctly wired up! Test it now by:**
1. Refreshing browser
2. Creating a project as CLIENT
3. Logging in as DEVELOPER
4. Checking "Browse Projects" page

The project should appear! 🎉
