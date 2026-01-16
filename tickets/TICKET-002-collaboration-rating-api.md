# TICKET-002: Collaboration Rating API Integration

**Type:** Feature
**Priority:** Medium
**Status:** Open

## Description
Hotels can rate creators after completing a collaboration, but ratings are only stored in local state and lost on page refresh. Need to persist ratings via backend API.

## Current Behavior
- Rating modal appears for completed collaborations
- User submits rating (1-5 stars) and optional comment
- Only updates local `hasRated` flag - data not persisted

## Acceptance Criteria
- [ ] Backend: Create `POST /collaborations/{id}/rate` endpoint
- [ ] Backend: Store rating, comment, and timestamp in database
- [ ] Backend: Validate user is part of the collaboration
- [ ] Backend: Prevent duplicate ratings (one rating per collaboration per user)
- [ ] Frontend: Replace mock submission in `app/collaborations/page.tsx`
- [ ] Frontend: Handle errors (already rated, unauthorized, etc.)
- [ ] Frontend: Fetch existing rating status on page load

## Files to Modify
- `app/collaborations/page.tsx`
- `services/api/collaborations.ts`

## Technical Notes

### Frontend Implementation

#### Add to collaborations service (`services/api/collaborations.ts`):
```typescript
rateCollaboration: async (
  collaborationId: string,
  rating: number,
  comment?: string
): Promise<{ message: string }> => {
  return apiClient.post(`/collaborations/${collaborationId}/rate`, {
    rating,
    comment
  })
}
```

#### Update `app/collaborations/page.tsx` handleRatingSubmit:
```typescript
const handleRatingSubmit = async (id: string, rating: number, comment: string) => {
  try {
    await collaborationService.rateCollaboration(id, rating, comment)
    setCollaborations(prev =>
      prev.map(collab =>
        collab.id === id ? { ...collab, hasRated: true } : collab
      )
    )
  } catch (error) {
    console.error('Failed to submit rating:', error)
    // Show error toast/notification
  }
}
```

### Expected API Contract
```
POST /collaborations/{id}/rate
Content-Type: application/json
Authorization: Bearer <token>

Request:
{
  "rating": 1-5 (integer),
  "comment": "string (optional)"
}

Response (200):
{
  "message": "Rating submitted successfully"
}

Response (400):
{
  "detail": "You have already rated this collaboration"
}

Response (403):
{
  "detail": "You are not authorized to rate this collaboration"
}
```
