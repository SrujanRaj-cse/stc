# Database Seeding Instructions

## ✅ Seed Script Run Successfully!

The database has been populated with:
- **16 Landmarks** (including Sydney landmarks)
- **29 Phrases** (including English phrases)
- **4 Checklist Templates**

## 🔄 Re-run Seed Script (if needed)

If you need to re-populate the database, run:

```powershell
node seed.js
```

This will:
- Clear existing landmarks, phrases, and checklist templates
- Insert fresh seed data

## 📝 What Was Seeded

### Landmarks
Including landmarks for:
- Tokyo (2 landmarks)
- Paris (2 landmarks)
- New York (2 landmarks)
- London (1 landmark)
- Rome (1 landmark)
- **Sydney (3 landmarks)** ✅
- Cairo (1 landmark)
- Rio de Janeiro (1 landmark)
- Agra (1 landmark)
- Beijing (1 landmark)
- San Francisco (1 landmark)

### Phrases
- Japanese phrases (8 phrases)
- **English phrases (21 phrases)** ✅
  - Greetings
  - Directions
  - Food
  - Emergency
  - Transport

### Checklist Templates
- Urban + Hot weather
- Urban + Cold weather
- Tropical + Hot weather
- Urban + Mild weather

## 🎯 Next Steps

After seeding, refresh your trip detail page and you should see:
- ✅ Landmarks for Sydney
- ✅ English phrases
- ✅ Checklist generation working
- ⚠️ Weather data (requires API key in .env)

## ⚠️ Weather API Setup

To fix the weather error, add your OpenWeatherMap API key to `.env`:

```env
WEATHER_API_KEY=your_openweathermap_api_key_here
```

Get a free API key from: https://openweathermap.org/api

