# AfriVerse API Documentation

**Base URL:** `http://localhost:4000/api`

---

## Core Endpoints

### Submit Knowledge
**POST** `/api/submit`
- Upload audio/text cultural entry
- Returns: entryId, IPFS CID

### Get Entry
**GET** `/api/entries/:id`
- Retrieve entry with transcript and atoms
- Public access

### Validate Entry
**POST** `/api/validate/:entryId`
- Community validator approves/rejects
- Requires validator role

### Query Knowledge
**POST** `/api/entries/query`
- Natural language query against knowledge graph
- Returns reasoning trace + results

### Search
**GET** `/api/entries/search/all?q=keyword`
- Search across entries
- Filters: language, community, status

---

## Authentication

Bearer token in header:
```
Authorization: Bearer <jwt_token>
```

Get token via wallet signature at `/api/auth/connect`

---

## Response Format

Success:
```json
{
  "success": true,
  "data": {...}
}
```

Error:
```json
{
  "success": false,
  "error": "Error message"
}
```

---

## Rate Limits

- General API: 100 req/15min per IP
- Submit endpoint: 10 req/hour per IP

---

For complete API reference, see inline JSDoc comments in:
- `services/backend/src/routes/*.js`
- `services/backend/src/controllers/*.js`
