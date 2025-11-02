# Smart Travel Companion - Deployment Guide

## Prerequisites

Before deploying the Smart Travel Companion application, ensure you have the following:

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- Git
- A cloud hosting service (Heroku, Vercel, Netlify, etc.)

## Environment Setup

### 1. Backend Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
MONGODB_URI=mongodb://localhost:27017/smart-travel-companion
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=production
PORT=5000
WEATHER_API_KEY=your-weather-api-key
MAPS_API_KEY=your-maps-api-key
```

### 2. Frontend Environment Variables

Create a `.env` file in the `client` directory:

```env
REACT_APP_API_URL=https://your-backend-url.herokuapp.com
```

## Local Development Setup

### Option 1: Using the Startup Scripts

**For Linux/Mac:**

```bash
chmod +x start.sh
./start.sh
```

**For Windows:**

```cmd
start.bat
```

### Option 2: Manual Setup

1. Install backend dependencies:

```bash
npm install
```

2. Install frontend dependencies:

```bash
cd client
npm install
cd ..
```

3. Start the development server:

```bash
npm run dev
```

## Production Deployment

### Backend Deployment (Heroku)

1. Create a Heroku app:

```bash
heroku create your-app-name
```

2. Add MongoDB addon:

```bash
heroku addons:create mongolab:sandbox
```

3. Set environment variables:

```bash
heroku config:set JWT_SECRET=your-production-jwt-secret
heroku config:set NODE_ENV=production
heroku config:set WEATHER_API_KEY=your-weather-api-key
heroku config:set MAPS_API_KEY=your-maps-api-key
```

4. Deploy:

```bash
git add .
git commit -m "Deploy to production"
git push heroku main
```

### Frontend Deployment (Vercel/Netlify)

1. Build the React app:

```bash
cd client
npm run build
```

2. Deploy the `client/build` folder to your hosting service

3. Set environment variables in your hosting platform:
   - `REACT_APP_API_URL`: Your backend URL

## Database Setup

### MongoDB Atlas (Cloud)

1. Create a MongoDB Atlas account
2. Create a new cluster
3. Get your connection string
4. Update `MONGODB_URI` in your environment variables

### Local MongoDB

1. Install MongoDB locally
2. Start MongoDB service
3. Use `mongodb://localhost:27017/smart-travel-companion` as your URI

## API Keys Setup

### Weather API (OpenWeatherMap)

1. Sign up at [OpenWeatherMap](https://openweathermap.org/api)
2. Get your API key
3. Add it to your environment variables as `WEATHER_API_KEY`

### Maps API (Google Maps)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Enable Maps JavaScript API
3. Create credentials
4. Add it to your environment variables as `MAPS_API_KEY`

## Security Considerations

1. **JWT Secret**: Use a strong, random secret for production
2. **CORS**: Configure CORS properly for your domain
3. **Rate Limiting**: Implement rate limiting for API endpoints
4. **Input Validation**: Ensure all inputs are validated
5. **HTTPS**: Always use HTTPS in production

## Monitoring and Logging

### Recommended Tools

- **Logging**: Winston or Morgan for request logging
- **Monitoring**: New Relic or DataDog
- **Error Tracking**: Sentry
- **Analytics**: Google Analytics

### Health Check Endpoint

Add a health check endpoint to your backend:

```javascript
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", timestamp: new Date().toISOString() });
});
```

## Performance Optimization

### Backend

1. Enable compression
2. Implement caching (Redis)
3. Use database indexing
4. Optimize database queries

### Frontend

1. Enable code splitting
2. Implement lazy loading
3. Optimize images
4. Use CDN for static assets

## Troubleshooting

### Common Issues

1. **CORS Errors**: Check your CORS configuration
2. **Database Connection**: Verify MongoDB URI and credentials
3. **Environment Variables**: Ensure all required variables are set
4. **Build Errors**: Check Node.js version compatibility

### Debug Mode

Enable debug mode by setting:

```env
NODE_ENV=development
DEBUG=*
```

## Backup Strategy

1. **Database Backup**: Regular MongoDB backups
2. **Code Backup**: Git repository with proper branching
3. **Environment Backup**: Document all environment variables

## Scaling Considerations

1. **Horizontal Scaling**: Use load balancers
2. **Database Scaling**: Consider MongoDB sharding
3. **CDN**: Use CDN for static assets
4. **Caching**: Implement Redis for session storage

## Maintenance

1. **Regular Updates**: Keep dependencies updated
2. **Security Patches**: Apply security patches promptly
3. **Performance Monitoring**: Monitor application performance
4. **User Feedback**: Collect and act on user feedback

## Support

For issues and questions:

- Check the GitHub repository
- Create an issue for bugs
- Contact the development team

---

**Note**: This deployment guide covers the basic setup. For production environments, consider additional security measures, monitoring, and scaling strategies based on your specific requirements.
