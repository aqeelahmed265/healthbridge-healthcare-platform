# API Conventions & Contracts

## Route Versioning
All REST endpoints are versioned under: `/api/v1/...`

## Standard Success Response Format

```json
{
  "data": {},
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 20,
    "totalPages": 5
  },
  "requestId": "req-1722099900000"
}
```

## Standard Error Response Format

```json
{
  "error": {
    "code": "APPOINTMENT_SLOT_UNAVAILABLE",
    "message": "The selected provider is unavailable during the requested time slot.",
    "details": {}
  },
  "requestId": "req-1722099900000"
}
```
