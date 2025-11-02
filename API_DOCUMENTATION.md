# Smart Travel Companion API Documentation

## Base URL

```
http://localhost:5000/api
```

## Authentication

All protected routes require a JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Endpoints

### Authentication Routes

#### Register User

```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "token": "jwt-token-here",
  "user": {
    "id": "user-id",
    "name": "John Doe",
    "email": "john@example.com",
    "avatar": "",
    "preferences": {
      "currency": "USD",
      "language": "en",
      "notifications": {
        "email": true,
        "push": true
      }
    },
    "travelStats": {
      "countriesVisited": [],
      "totalTrips": 0,
      "totalDaysTraveled": 0
    }
  }
}
```

#### Login User

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:** Same as register

#### Get User Profile

```http
GET /api/auth/profile
Authorization: Bearer <token>
```

#### Update User Profile

```http
PUT /api/auth/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Name",
  "preferences": {
    "currency": "EUR",
    "language": "es"
  }
}
```

### Trip Routes

#### Get All Trips

```http
GET /api/trips?status=upcoming&limit=10&page=1
Authorization: Bearer <token>
```

**Response:**

```json
{
  "trips": [
    {
      "_id": "trip-id",
      "title": "Paris Adventure",
      "description": "A wonderful trip to Paris",
      "destination": {
        "country": "France",
        "city": "Paris",
        "coordinates": {
          "lat": 48.8566,
          "lng": 2.3522
        }
      },
      "startDate": "2024-06-01T00:00:00.000Z",
      "endDate": "2024-06-07T00:00:00.000Z",
      "budget": {
        "total": 2000,
        "currency": "USD",
        "spent": 0
      },
      "travelers": [],
      "status": "planning",
      "tags": ["city", "culture"],
      "photos": [],
      "documents": [],
      "notes": "",
      "createdBy": "user-id",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "totalPages": 1,
  "currentPage": 1,
  "total": 1
}
```

#### Get Single Trip

```http
GET /api/trips/:id
Authorization: Bearer <token>
```

#### Create Trip

```http
POST /api/trips
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Tokyo Adventure",
  "description": "Exploring Tokyo",
  "destination": {
    "country": "Japan",
    "city": "Tokyo"
  },
  "startDate": "2024-07-01T00:00:00.000Z",
  "endDate": "2024-07-10T00:00:00.000Z",
  "budget": {
    "total": 3000,
    "currency": "USD"
  },
  "status": "planning",
  "tags": ["city", "culture", "food"]
}
```

#### Update Trip

```http
PUT /api/trips/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Trip Title",
  "status": "upcoming"
}
```

#### Delete Trip

```http
DELETE /api/trips/:id
Authorization: Bearer <token>
```

#### Get Trip Statistics

```http
GET /api/trips/stats/summary
Authorization: Bearer <token>
```

**Response:**

```json
{
  "totalTrips": 5,
  "completedTrips": 2,
  "totalDays": 45,
  "totalBudget": 10000,
  "countriesVisited": ["France", "Japan", "Italy"]
}
```

### Itinerary Routes

#### Get Trip Itineraries

```http
GET /api/itineraries/:tripId
Authorization: Bearer <token>
```

#### Create Itinerary

```http
POST /api/itineraries
Authorization: Bearer <token>
Content-Type: application/json

{
  "tripId": "trip-id",
  "day": 1,
  "date": "2024-06-01T00:00:00.000Z",
  "activities": [
    {
      "title": "Visit Eiffel Tower",
      "description": "Morning visit to the iconic tower",
      "location": {
        "name": "Eiffel Tower",
        "address": "Champ de Mars, 7th arrondissement, Paris"
      },
      "startTime": "09:00",
      "endTime": "12:00",
      "category": "attraction",
      "cost": {
        "amount": 25,
        "currency": "EUR"
      }
    }
  ]
}
```

#### Update Itinerary

```http
PUT /api/itineraries/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "activities": [
    {
      "title": "Updated Activity",
      "startTime": "10:00"
    }
  ]
}
```

#### Delete Itinerary

```http
DELETE /api/itineraries/:id
Authorization: Bearer <token>
```

#### Add Activity to Itinerary

```http
POST /api/itineraries/:id/activities
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "New Activity",
  "startTime": "14:00",
  "endTime": "16:00",
  "category": "restaurant"
}
```

### Weather Routes

#### Get Weather by City

```http
GET /api/weather/:city?days=5
Authorization: Bearer <token>
```

**Response:**

```json
{
  "city": "Paris",
  "country": "France",
  "forecasts": [
    {
      "date": "2024-06-01",
      "temperature": 22,
      "minTemp": 15,
      "maxTemp": 28,
      "humidity": 65,
      "windSpeed": 5.2,
      "condition": "Clear",
      "description": "clear sky",
      "icon": "01d"
    }
  ]
}
```

#### Get Weather by Coordinates

```http
GET /api/weather/coordinates/:lat/:lon?days=5
Authorization: Bearer <token>
```

## Error Responses

All error responses follow this format:

```json
{
  "message": "Error description",
  "errors": [
    {
      "msg": "Validation error message",
      "param": "fieldName",
      "location": "body"
    }
  ]
}
```

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `500` - Internal Server Error

## Rate Limiting

API requests are limited to prevent abuse. Current limits:

- 100 requests per 15 minutes per IP
- 1000 requests per hour per authenticated user

## Pagination

List endpoints support pagination:

- `limit`: Number of items per page (default: 10)
- `page`: Page number (default: 1)

## Filtering

Trip endpoints support filtering by:

- `status`: Filter by trip status (planning, upcoming, ongoing, completed, cancelled)

## Search

Trip endpoints support text search:

- Search by trip title, destination city, or destination country
