# Frontend Account Management API Documentation

This document describes the frontend implementation of account deletion and data export features for GDPR/CCPA compliance.

## API Endpoints

### 1. DELETE /api/v1/users/me

**Purpose**: Permanently delete user account and all associated data

**Authentication**: Firebase JWT Bearer token

**Frontend Implementation**:
```typescript
const handleDeleteAccount = async () => {
  // Get Firebase JWT token
  const idToken = await user.getIdToken();
  
  const response = await fetch(`${config.API_BASE_URL}/users/me`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`,
    },
  });
  
  if (!response.ok) {
    throw new Error('Failed to delete account');
  }
  
  // Clear local storage
  userService.clearDatabaseUserId();
  
  // Sign out user
  await signOut();
}
```

**Request**:
```
DELETE /api/v1/users/me
Authorization: Bearer <firebase-token>
Content-Type: application/json
```

**Response** (200 OK):
```json
{
  "data": {
    "message": "Account deleted successfully"
  },
  "meta": {
    "timestamp": "2024-01-15T10:30:00Z"
  }
}
```

**Error Responses**:
- 401: Unauthorized (invalid token)
- 404: User not found
- 500: Server error

---

### 2. GET /api/v1/users/me/export

**Purpose**: Export all user data in JSON format (GDPR/CCPA compliance)

**Authentication**: Firebase JWT Bearer token

**Frontend Implementation**:
```typescript
const handleExportData = async () => {
  // Get Firebase JWT token
  const idToken = await user.getIdToken();
  
  const response = await fetch(`${config.API_BASE_URL}/users/me/export`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${idToken}`,
    },
  });
  
  if (!response.ok) {
    throw new Error('Failed to export data');
  }
  
  const data = await response.json();
  
  // Download as JSON file
  const blob = new Blob([JSON.stringify(data, null, 2)], { 
    type: 'application/json' 
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const timestamp = new Date().toISOString()
    .replace(/[:.]/g, '-')
    .split('.')[0];
  a.download = `my-investlearn-data-${timestamp}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
```

**Request**:
```
GET /api/v1/users/me/export
Authorization: Bearer <firebase-token>
Accept: application/json
```

**Response** (200 OK):
```json
{
  "profile": {
    "displayName": "John Doe",
    "email": "john@example.com",
    "createdAt": "2024-01-01T00:00:00Z"
  },
  "assessments": [
    {
      "id": "...",
      "responses": [...],
      "scores": {...}
    }
  ],
  "recommendations": [...],
  "learningProgress": {...},
  "chatHistory": [...],
  "sessions": [...],
  "exportedAt": "2024-01-15T10:30:00Z"
}
```

**Error Responses**:
- 401: Unauthorized (invalid token)
- 404: User not found
- 429: Rate limit exceeded
- 500: Server error

---

## User Experience Flow

### Account Deletion Flow

1. User navigates to `/profile`
2. Clicks on "Account" tab
3. Scrolls to "Delete Account" section
4. Clicks "Delete Account" button
5. **Confirmation dialog appears**:
   - Text: "Are you sure you want to delete your account? This action cannot be undone..."
   - User can cancel or confirm
6. If confirmed:
   - Loading spinner shows on button
   - Button text changes to "Deleting..."
   - API call is made
7. On success:
   - Success toast notification
   - Local storage cleared
   - User signed out
   - Redirected to landing page
8. On error:
   - Error toast notification
   - User remains logged in
   - Can retry operation

### Data Export Flow

1. User navigates to `/profile`
2. Clicks on "Account" tab
3. Scrolls to "Export My Data" section
4. Clicks "Export My Data" button
5. **Loading state**:
   - Button shows spinner
   - Button text changes to "Exporting..."
6. API call is made
7. On success:
   - JSON file automatically downloads
   - Filename: `my-investlearn-data-2024-01-15T10-30-00.json`
   - Success toast notification
8. On error:
   - Error toast notification
   - User can retry operation

---

## Error Handling

### Frontend Error Handling Strategy

```typescript
try {
  const response = await fetch(endpoint, options);
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Operation failed');
  }
  
  // Handle success
} catch (error) {
  // Show error toast
  toast.error(error.message);
  
  // Log for debugging
  console.error('Operation failed:', error);
  
  // Don't sign out user on error
}
```

### Error Scenarios

| Scenario | HTTP Status | Frontend Behavior |
|----------|-------------|-------------------|
| Invalid token | 401 | Show error toast, don't sign out |
| User not found | 404 | Show error toast |
| Rate limit | 429 | Show error toast with retry option |
| Server error | 500 | Show error toast, log details |
| Network error | - | Show network error message |

---

## Security Considerations

### Authentication
- Firebase JWT tokens are used for all requests
- Tokens are automatically refreshed by Firebase SDK
- Tokens are included in Authorization header
- Backend validates tokens before processing

### Data Protection
- Export includes personal data - ensure secure download
- Deletion is permanent - confirmation required
- All requests are logged for audit
- Rate limiting prevents abuse

### GDPR/CCPA Compliance
- **Right to erasure**: Account deletion endpoint
- **Right to data portability**: Export endpoint
- **Right to access**: Full data export
- Audit logs are preserved but anonymized

---

## UI Components

### Delete Account Card
```tsx
<Card className="border-destructive/20 bg-destructive/5">
  <CardHeader>
    <CardTitle>Delete Account</CardTitle>
    <CardDescription>
      Permanently delete your account and all associated data
    </CardDescription>
  </CardHeader>
  <CardContent>
    <p>This action cannot be undone...</p>
    <Button 
      variant="destructive"
      onClick={handleDeleteAccount}
      disabled={isDeleting}
    >
      {isDeleting ? <Loader2 /> : 'Delete Account'}
    </Button>
  </CardContent>
</Card>
```

### Export Data Card
```tsx
<Card>
  <CardHeader>
    <CardTitle>Export My Data</CardTitle>
    <CardDescription>
      Download a copy of all your personal data (GDPR/CCPA compliance)
    </CardDescription>
  </CardHeader>
  <CardContent>
    <p>Export all your account data including...</p>
    <Button 
      onClick={handleExportData}
      disabled={isExporting}
    >
      {isExporting ? <Loader2 /> : 'Export My Data'}
    </Button>
  </CardContent>
</Card>
```

---

## Testing

### Manual Testing Checklist

#### Account Deletion
- [ ] User can navigate to Profile page
- [ ] Delete Account button is visible
- [ ] Confirmation dialog appears
- [ ] User can cancel deletion
- [ ] User can confirm deletion
- [ ] Loading state shows during deletion
- [ ] Success toast appears
- [ ] User is signed out after deletion
- [ ] Local storage is cleared
- [ ] Error handling works

#### Data Export
- [ ] User can navigate to Profile page
- [ ] Export My Data button is visible
- [ ] Loading state shows during export
- [ ] JSON file downloads automatically
- [ ] Filename format is correct
- [ ] File contains expected data
- [ ] Success toast appears
- [ ] Error handling works

### Automated Testing

```typescript
describe('Account Management', () => {
  it('should delete account successfully', async () => {
    // Mock API response
    // Click delete button
    // Verify confirmation dialog
    // Click confirm
    // Verify success toast
    // Verify sign out
  });
  
  it('should export data successfully', async () => {
    // Mock API response
    // Click export button
    // Verify loading state
    // Verify file download
    // Verify file content
  });
});
```

---

## Configuration

### API Base URL
```typescript
// src/lib/api/config.ts
export const config = {
  API_BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1'
};
```

### Environment Variables
```env
VITE_API_URL=https://api.investlearn.com/api/v1
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
```

---

## Notes

- Both features use Firebase JWT authentication
- Delete account requires confirmation dialog
- Export triggers automatic file download
- All requests are logged for audit
- Rate limiting is enforced on backend
- Audit logs are preserved but anonymized
- Full GDPR/CCPA compliance maintained


