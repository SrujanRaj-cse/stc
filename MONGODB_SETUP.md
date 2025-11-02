# MongoDB Setup Guide

## ✅ Status
MongoDB is **installed and running** on your system!

- **Service Status**: Running ✅
- **Connection Test**: Successful ✅
- **Default Connection**: `mongodb://localhost:27017`

## 📝 Environment Configuration

Your `.env` file should contain:
```env
MONGO_URI=mongodb://localhost:27017/smart-travel-companion
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
PORT=5000
WEATHER_API_KEY=your-weather-api-key
MAPS_API_KEY=your-maps-api-key
```

## 🚀 Quick Start

1. **Start MongoDB** (if not already running):
   - Run `start-mongodb.bat` or
   - Open Services (services.msc) and start "MongoDB" service

2. **Start the Application**:
   - Run `start.bat` - This will start both backend and frontend

## 🔧 MongoDB Commands

### Check MongoDB Status
```powershell
Get-Service MongoDB
```

### Start MongoDB Service
```powershell
net start MongoDB
```
(Requires Administrator privileges)

### Stop MongoDB Service
```powershell
net stop MongoDB
```

### Access MongoDB Shell
```powershell
mongosh
```
or
```powershell
mongo
```
(depending on your MongoDB version)

## 📊 MongoDB Information

- **Default Port**: 27017
- **Data Directory**: `C:\data\db` (typically)
- **Database Name**: `smart-travel-companion` (created automatically)

## 🛠️ Troubleshooting

### MongoDB Won't Start
1. Check if port 27017 is already in use:
   ```powershell
   netstat -ano | findstr :27017
   ```
2. Verify the service is installed:
   ```powershell
   sc query MongoDB
   ```
3. Check MongoDB logs (usually in MongoDB installation directory)

### Connection Refused
- Ensure MongoDB service is running
- Check firewall settings for port 27017
- Verify MONGO_URI in .env file is correct

### Permission Issues
- Run commands as Administrator if needed
- Check MongoDB data directory permissions (`C:\data\db`)

## 📚 Useful MongoDB Shell Commands

Once connected to MongoDB shell:
```javascript
// Show all databases
show dbs

// Switch to your database
use smart-travel-companion

// Show collections (tables)
show collections

// Count documents in a collection
db.users.countDocuments()

// View all users
db.users.find()
```

## ✨ You're All Set!

Your MongoDB is ready to use. The application will automatically create the database and collections when you first start it.

For more information, visit: https://www.mongodb.com/docs/
