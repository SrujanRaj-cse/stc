# Smart Travel Companion

A comprehensive travel companion application built with the MERN stack (MongoDB, Express.js, React, Node.js).

## Features

- **User Authentication**: Secure registration and login system
- **Trip Planning**: Create and manage travel itineraries
- **Weather Integration**: Real-time weather information for destinations
- **Interactive Maps**: Location-based services and mapping
- **Travel Documents**: Upload and manage travel documents
- **Budget Tracking**: Monitor travel expenses
- **Travel Tips**: Get personalized travel recommendations
- **Social Features**: Share trips and connect with other travelers

## Tech Stack

- **Frontend**: React.js, Material-UI, Axios
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **APIs**: Weather API, Maps API

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud)
- npm or yarn

### Installation

1. Clone the repository
2. Install server dependencies:

   ```bash
   npm install
   ```

3. Install client dependencies:

   ```bash
   cd client
   npm install
   ```

4. Create a `.env` file in the root directory:

   ```
   MONGODB_URI=mongodb://localhost:27017/smart-travel-companion
   JWT_SECRET=your-secret-key
   NODE_ENV=development
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:3000`

## Project Structure

```
smart-travel-companion/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   ├── utils/         # Utility functions
│   │   └── App.js
│   └── package.json
├── models/                 # MongoDB models
├── routes/                 # Express routes
├── middleware/             # Custom middleware
├── server.js              # Express server
└── package.json
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Trips

- `GET /api/trips` - Get all trips for user
- `POST /api/trips` - Create new trip
- `PUT /api/trips/:id` - Update trip
- `DELETE /api/trips/:id` - Delete trip

### Itineraries

- `GET /api/itineraries/:tripId` - Get trip itinerary
- `POST /api/itineraries` - Add itinerary item
- `PUT /api/itineraries/:id` - Update itinerary item
- `DELETE /api/itineraries/:id` - Delete itinerary item

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.
