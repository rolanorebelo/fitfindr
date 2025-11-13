# FitFindr - Quick Start Guide

## 🎯 Goal
Transform your Streamlit gym rating app into a modern Next.js + FastAPI application.

## 📦 What's Been Created

### Backend (FastAPI)
- ✅ RESTful API with FastAPI
- ✅ Google Maps Places API integration
- ✅ TextBlob NLP for review analysis
- ✅ Custom preference weighting algorithm
- ✅ Type-safe with Pydantic models
- ✅ CORS configured for frontend

### Frontend (Next.js 14)
- ✅ Modern React with TypeScript
- ✅ Beautiful UI with Tailwind CSS
- ✅ Smooth animations with Framer Motion
- ✅ Interactive maps with Leaflet
- ✅ Data visualizations with Recharts
- ✅ Responsive design

## 🚀 Installation (5 Minutes)

### Option 1: Automated Setup (Recommended)

**Linux/Mac:**
```bash
chmod +x setup.sh
./setup.sh
```

**Windows:**
```bash
setup.bat
```

### Option 2: Manual Setup

**Backend:**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Add your Google Maps API key to .env
```

**Frontend:**
```bash
cd frontend
npm install
cp .env.local.example .env.local
```

## 🔑 Get Google Maps API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable **Places API** and **Geocoding API**
4. Create credentials (API Key)
5. Add to `backend/.env`:
   ```
   GOOGLE_MAPS_API_KEY=your_key_here
   ```

## ▶️ Running the App

**Terminal 1 - Backend:**
```bash
cd backend
source venv/bin/activate  # Windows: venv\Scripts\activate
uvicorn main:app --reload
```
Backend runs at: `http://localhost:8000`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
Frontend runs at: `http://localhost:3000`

## 🎨 Key Improvements Over Streamlit

### User Experience
- ✅ **Faster**: No page reloads, instant interactions
- ✅ **Modern UI**: Gradient effects, smooth animations
- ✅ **Mobile-friendly**: Fully responsive design
- ✅ **Better Performance**: Client-side caching, optimized rendering

### Technical Improvements
- ✅ **Scalable Architecture**: Separate frontend/backend
- ✅ **Type Safety**: TypeScript everywhere
- ✅ **API-First**: RESTful endpoints for any client
- ✅ **Better State Management**: React hooks
- ✅ **Production Ready**: Easy deployment to Vercel/Railway

### New Features
- ✅ **Tab Navigation**: List, Map, and Analytics views
- ✅ **Better Visualizations**: Color-coded bar charts
- ✅ **Enhanced Map**: Better markers and popups
- ✅ **Smooth Animations**: Framer Motion transitions
- ✅ **Error Handling**: User-friendly error messages

## 📱 Features

### 1. Preference Selection
- 7 predefined factors (Hygiene, Equipment, etc.)
- Slider controls (1-5 importance)
- Custom keyword filters
- Distance and minimum rating filters

### 2. Results Display
Three view modes:

**List View:**
- Ranked list of gyms
- Contact information
- Tailored ratings with badges

**Map View:**
- Interactive Leaflet map
- Markers for each gym
- Clickable popups with details

**Analytics View:**
- Top 10 gyms bar chart
- Color-coded by rating
- Responsive design

### 3. Export
- Download results as CSV
- Includes all gym data

## 🔧 Configuration

### Backend Environment Variables
```env
GOOGLE_MAPS_API_KEY=your_api_key_here
```

### Frontend Environment Variables
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## 🚢 Deployment

### Backend (Railway/Render)
1. Push to GitHub
2. Connect repository
3. Set `GOOGLE_MAPS_API_KEY` environment variable
4. Deploy

### Frontend (Vercel)
```bash
cd frontend
vercel
```
Set `NEXT_PUBLIC_API_URL` to your backend URL.

## 🐛 Troubleshooting

### "Module not found" errors
```bash
# Backend
cd backend
pip install -r requirements.txt

# Frontend
cd frontend
npm install
```

### CORS errors
Check `backend/main.py` - origin should match frontend URL:
```python
allow_origins=["http://localhost:3000"]
```

### Map not showing
- Ensure Leaflet CSS is imported
- Check browser console for errors
- Verify gym data has latitude/longitude

### API errors
- Verify Google Maps API key is set
- Check API key has Places API enabled
- Check API quota limits

## 📚 Project Structure

```
fitfindr/
├── backend/              # FastAPI application
│   ├── main.py          # Main API file
│   └── requirements.txt # Python dependencies
│
├── frontend/            # Next.js application
│   ├── app/            # App router pages
│   ├── components/     # React components
│   ├── lib/           # Utilities (API client)
│   └── types/         # TypeScript types
│
└── README.md          # Full documentation
```

## 💡 Tips

1. **Testing**: Use Postman to test API endpoints
2. **Development**: Keep both terminals open
3. **Hot Reload**: Both frontend and backend support hot reload
4. **Browser DevTools**: Check Network tab for API calls
5. **API Documentation**: Visit `http://localhost:8000/docs` for interactive API docs

## 📊 API Testing

FastAPI provides automatic API documentation:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## 🎓 Learning Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [React Leaflet](https://react-leaflet.js.org/)

## 🤝 Contributing

This is a university project. Feel free to fork and modify for your needs!

## ✨ Next Steps

Consider adding:
- User authentication
- Save favorite gyms
- Compare gyms side-by-side
- More detailed analytics
- Social sharing features
- Mobile app (React Native)

---

**Happy coding! 🎉**
