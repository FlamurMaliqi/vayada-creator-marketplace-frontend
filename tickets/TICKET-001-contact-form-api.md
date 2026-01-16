# TICKET-001: Contact Form API Integration

**Type:** Feature
**Priority:** Medium
**Status:** Open

## Description
The contact form on `/contact` currently simulates submission with a fake delay but doesn't actually send data anywhere. Need to integrate with a backend API endpoint.

## Current Behavior
- Form collects: name, email, phone, company, country, user type, message
- Submit shows success but data is discarded

## Acceptance Criteria
- [ ] Backend: Create `POST /contact` endpoint that accepts form data
- [ ] Backend: Store submissions in database OR send via email (e.g., SendGrid, SES)
- [ ] Frontend: Replace mock submission with actual API call in `app/contact/page.tsx`
- [ ] Frontend: Handle API errors with user-friendly messages
- [ ] Optional: Add rate limiting to prevent spam

## Files to Modify
- `app/contact/page.tsx`
- `services/api/` (create contact service if needed)

## Technical Notes

### Frontend Implementation
```typescript
// In app/contact/page.tsx handleSubmit function, replace mock with:
import { apiClient } from '@/services/api/client'

const response = await apiClient.post('/contact', {
  name: formData.name,
  email: formData.email,
  phone: formData.phone,
  company: formData.company,
  country: formData.country,
  user_type: formData.userType,
  message: formData.message,
})
```

### Expected API Contract
```
POST /contact
Content-Type: application/json

Request:
{
  "name": "string",
  "email": "string",
  "phone": "string (optional)",
  "company": "string (optional)",
  "country": "string",
  "user_type": "creator | hotel",
  "message": "string"
}

Response (200):
{
  "message": "Contact form submitted successfully"
}
```
