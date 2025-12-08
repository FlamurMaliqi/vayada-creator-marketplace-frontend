# Backend API Specification: Profile Status Endpoints

## Overview
This document specifies the requirements for implementing profile status endpoints that allow users to check the completion status of their profiles. These endpoints are used by the frontend to determine if a user's profile is complete and to guide them through the profile completion process.

## Endpoints

### 1. Creator Profile Status
**Endpoint:** `GET /creators/me/profile-status`

**Authentication:** Required (JWT Bearer token)

**Description:** Returns the profile completion status for the currently authenticated creator user.

**Response Schema:**
```json
{
  "profile_complete": boolean,
  "missing_fields": string[],
  "missing_platforms": boolean,
  "completion_steps": string[]
}
```

**Response Fields:**
- `profile_complete` (boolean): Indicates whether the creator profile is fully complete
- `missing_fields` (string[]): Array of field names that are missing or incomplete (e.g., `["name", "location", "portfolioLink"]`)
- `missing_platforms` (boolean): Indicates whether the creator has at least one platform configured
- `completion_steps` (string[]): Array of human-readable steps needed to complete the profile (e.g., `["Add your name", "Add at least one social media platform", "Set your location"]`)

**Example Response:**
```json
{
  "profile_complete": false,
  "missing_fields": ["name", "location"],
  "missing_platforms": true,
  "completion_steps": [
    "Add your name",
    "Add at least one social media platform",
    "Set your location"
  ]
}
```

**Error Responses:**
- `401 Unauthorized`: If the user is not authenticated or token is invalid
- `404 Not Found`: If the creator profile does not exist for the authenticated user
- `500 Internal Server Error`: For server errors

---

### 2. Hotel Profile Status
**Endpoint:** `GET /hotels/me/profile-status`

**Authentication:** Required (JWT Bearer token)

**Description:** Returns the profile completion status for the currently authenticated hotel user.

**Response Schema:**
```json
{
  "profile_complete": boolean,
  "missing_fields": string[],
  "has_defaults": {
    "location": boolean,
    "category": boolean
  },
  "completion_steps": string[]
}
```

**Response Fields:**
- `profile_complete` (boolean): Indicates whether the hotel profile is fully complete
- `missing_fields` (string[]): Array of field names that are missing or incomplete (e.g., `["name", "about", "website"]`)
- `has_defaults.location` (boolean): Indicates whether the location field contains a default/placeholder value
- `has_defaults.category` (boolean): Indicates whether the category field contains a default/placeholder value
- `completion_steps` (string[]): Array of human-readable steps needed to complete the profile (e.g., `["Update your hotel name", "Add a description", "Set a custom location"]`)

**Example Response:**
```json
{
  "profile_complete": false,
  "missing_fields": ["about", "website"],
  "has_defaults": {
    "location": true,
    "category": false
  },
  "completion_steps": [
    "Update your hotel name",
    "Add a description about your hotel",
    "Set a custom location (currently using default)",
    "Add your website URL"
  ]
}
```

**Error Responses:**
- `401 Unauthorized`: If the user is not authenticated or token is invalid
- `404 Not Found`: If the hotel profile does not exist for the authenticated user
- `500 Internal Server Error`: For server errors

---

## Business Logic Requirements

### Profile Completion Criteria

#### Creator Profile
A creator profile is considered complete when:
1. All required fields are filled (name, location, etc.)
2. At least one social media platform is configured with valid data
3. All mandatory profile information is present

#### Hotel Profile
A hotel profile is considered complete when:
1. All required fields are filled (name, location, category, etc.)
2. Location and category are not using default/placeholder values
3. At least one listing exists (optional - confirm with product team)
4. All mandatory profile information is present

### Missing Fields Detection
The backend should check each required field and include it in `missing_fields` if:
- The field is null or empty
- The field contains only whitespace
- The field contains a default/placeholder value (for fields like location, category)

### Completion Steps
The `completion_steps` array should provide actionable, user-friendly guidance. Steps should:
- Be ordered by priority/importance
- Use clear, concise language
- Directly correspond to missing fields or requirements
- Not duplicate information already in `missing_fields`

---

## Implementation Notes

1. **Authentication**: Both endpoints must verify the JWT token and ensure the user is authenticated. The user ID should be extracted from the token to fetch the correct profile.

2. **User Type Validation**: 
   - `/creators/me/profile-status` should only be accessible to users with `type: 'creator'`
   - `/hotels/me/profile-status` should only be accessible to users with `type: 'hotel'`
   - Return `403 Forbidden` if the user type doesn't match

3. **Profile Existence**: If a profile doesn't exist for the authenticated user, return `404 Not Found` with an appropriate error message.

4. **Performance**: These endpoints may be called frequently (e.g., on page loads), so consider caching the profile status if appropriate, but ensure it's invalidated when profile data changes.

5. **Consistency**: The profile completion logic should be consistent with any validation rules used when creating or updating profiles.

---

## Frontend Integration

The frontend currently calls these endpoints:
- `GET /creators/me/profile-status` via `creatorService.getProfileStatus()`
- `GET /hotels/me/profile-status` via `hotelService.getProfileStatus()`

Both are called with JWT authentication headers automatically added by the API client.

**Usage in Frontend:**
- After user login, to determine if profile completion is needed
- On profile pages, to show completion status
- To display warning banners when profile is incomplete
- To guide users through profile completion flow

---

## Testing Checklist

- [ ] Creator endpoint returns correct status for complete profile
- [ ] Creator endpoint returns correct status for incomplete profile
- [ ] Creator endpoint correctly identifies missing platforms
- [ ] Hotel endpoint returns correct status for complete profile
- [ ] Hotel endpoint returns correct status for incomplete profile
- [ ] Hotel endpoint correctly identifies default values
- [ ] Both endpoints require authentication (401 for unauthenticated requests)
- [ ] Both endpoints validate user type (403 for wrong user type)
- [ ] Both endpoints return 404 when profile doesn't exist
- [ ] Response format matches schema exactly
- [ ] Completion steps are actionable and clear
- [ ] Missing fields list is accurate and complete

---

## Questions for Product/Backend Team

1. What are the exact required fields for creator profiles?
2. What are the exact required fields for hotel profiles?
3. Should hotel profiles require at least one listing to be considered complete?
4. What are the default/placeholder values for location and category that should be flagged?
5. Are there any conditional requirements (e.g., if field X is set, then field Y is also required)?
6. Should there be any minimum validation (e.g., minimum followers for platforms, minimum description length)?

---

## Related Endpoints

These profile status endpoints work in conjunction with:
- `GET /creators/me` - Get full creator profile
- `PUT /creators/me` - Update creator profile
- `GET /hotels/me` - Get full hotel profile
- `PUT /hotels/me` - Update hotel profile

The profile status should be recalculated whenever these endpoints are called to update profile data.

