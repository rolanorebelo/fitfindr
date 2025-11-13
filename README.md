# FitFindr - AI-Powered Gym Recommendation System

A modern, full-stack gym recommendation application that uses Natural Language Processing to analyze Google Reviews and provide personalized gym suggestions based on user preferences.

## 🚀 Features

- **Personalized Recommendations**: Get gym suggestions tailored to your specific preferences
- **NLP-Powered Analysis**: TextBlob sentiment analysis on real user reviews
- **Interactive Map**: Visualize gym locations with Leaflet maps
- **Beautiful UI**: Modern, responsive design with Tailwind CSS and Framer Motion
- **Dark/Light Theme Toggle**: Beautiful theme switching with localStorage persistence
- **Analytics Dashboard**: Charts and visualizations of gym ratings
- **Custom Filters**: Add your own keywords and preferences
- **Export Data**: Download recommendations as CSV
- **Mobile-First**: Responsive design that works on all devices

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **Recharts** - Data visualization
- **React Leaflet** - Interactive maps
- **Axios** - API client

### Backend
- **FastAPI** - Modern Python web framework
- **Google Maps API** - Location data and reviews
- **TextBlob** - NLP and sentiment analysis
- **Pydantic** - Data validation
- **googlemaps** - Python client for Google Maps

## 📋 Prerequisites

- Node.js 18+ and npm/yarn
- Python 3.8+
- Google Maps API Key with Places API enabled

## 🔧 Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd fitfindr
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env

# Edit .env and add your Google Maps API key
# GOOGLE_MAPS_API_KEY=your_api_key_here
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install
# or
yarn install

# Create .env.local file
cp .env.local.example .env.local

# The default API URL is http://localhost:8000
# Modify if your backend runs on a different port
```

## 🚀 Running the Application

### Start the Backend

```bash
cd backend
source venv/bin/activate  # On Windows: venv\Scripts\activate
uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`

### Start the Frontend

```bash
cd frontend
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:3000`

## 📖 Usage

1. **Enter Location**: Type in your city or address
2. **Set Preferences**: Use sliders to rate importance of factors (1-5):
   - Hygiene
   - Equipment Quality
   - Less Crowded
   - Trainer Knowledge
   - Price
   - Amenities
   - Atmosphere
3. **Add Custom Filters**: Add specific keywords you care about (e.g., "parking", "24/7")
4. **Set Additional Filters**:
   - Minimum tailored rating
   - Maximum distance (1-10 km)
5. **Click "Find Gyms"**: Get personalized recommendations!

## 🎨 Features Breakdown

### Tailored Rating Algorithm

The system calculates a personalized rating for each gym by:
1. Analyzing user reviews using TextBlob NLP
2. Matching keywords from reviews with user preferences
3. Weighting matches based on importance ratings
4. Aggregating scores across all reviews

**Formula**: 
```
Tailored Rating = Σ(Keyword Occurrences × Preference Weight) / Total Reviews
```

### Visualization Options

- **List View**: Detailed gym information with contact details
- **Map View**: Interactive map with gym locations and popups
- **Analytics**: Bar chart showing top 10 gyms by rating

## 🔑 Environment Variables

### Backend (.env)
```
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## 📡 API Endpoints

### Health Check
```
GET /api/health
```

### Geocode Location
```
POST /api/geocode?location=New York, NY
```

### Get Recommendations
```
POST /api/recommendations
Body: {
  "location": "New York, NY",
  "hygiene": 5,
  "equipment_quality": 4,
  "less_crowd": 3,
  "trainer_knowledge": 4,
  "price": 3,
  "amenities": 4,
  "atmosphere": 5,
  "custom_filters": [
    {"keyword": "parking", "importance": 4}
  ],
  "min_rating": 0,
  "max_distance": 5
}
```

## 🏗️ Project Structure

```
fitfindr/
├── backend/
│   ├── main.py              # FastAPI application
│   ├── requirements.txt     # Python dependencies
│   └── .env.example        # Environment template
│
└── frontend/
    ├── app/
    │   ├── layout.tsx       # Root layout
    │   ├── page.tsx         # Home page
    │   └── globals.css      # Global styles
    ├── components/
    │   ├── PreferenceForm.tsx   # User input form
    │   ├── GymResults.tsx       # Results display
    │   ├── GymMap.tsx           # Map component
    │   └── GymChart.tsx         # Analytics chart
    ├── lib/
    │   └── api.ts              # API client
    ├── types/
    │   └── index.ts            # TypeScript types
    └── package.json            # Node dependencies
```

## 🚢 Deployment

### Frontend (Vercel - Recommended)

1. **Create Vercel Account**
   - Go to [vercel.com](https://vercel.com)
   - Sign up with GitHub

2. **Import Project**
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Next.js

3. **Configure Environment**
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com
   ```

4. **Deploy**
   - Push to main branch triggers auto-deployment
   - Get HTTPS URL instantly

### Backend (Render - Free Tier Available)

1. **Create Render Account**
   - Go to [render.com](https://render.com)
   - Connect GitHub repository

2. **Create Web Service**
   - **Runtime**: Python 3
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `python main.py`

3. **Environment Variables**
   ```
   GOOGLE_MAPS_API_KEY=your_api_key_here
   ```

4. **Deploy**
   - Free tier includes 750 hours/month
   - Automatic SSL certificates

### Alternative Backend Options

- **Railway**: `railway up` for instant deployment
- **Heroku**: Traditional PaaS with free tier
- **Fly.io**: Global deployment with Docker

### Production Checklist

- ✅ Set up environment variables
- ✅ Configure CORS for production domain
- ✅ Enable Google Places API restrictions
- ✅ Test all endpoints
- ✅ Verify theme switching works
- ✅ Check mobile responsiveness

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project was created as part of a university project.

## 👥 Team

- **Prakash Mariappan** - UI Development
- **Rolano Rebelo** - Backend Development & NLP
- **Rohith Annadurai** - Data Gathering & Visualization

## 🙏 Acknowledgments

- Google Places API for location data
- TextBlob for NLP capabilities
- Streamlit (original implementation)
- All open-source libraries used in this project

## 📧 Support

For questions or issues, please open an issue on GitHub.

---

**Note**: Remember to keep your Google Maps API key secure and never commit it to version control!
