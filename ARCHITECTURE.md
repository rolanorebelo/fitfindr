# FitFindr Architecture Diagram

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER BROWSER                             │
│                    http://localhost:3000                         │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ HTTPS Requests
                             │
┌────────────────────────────▼────────────────────────────────────┐
│                    NEXT.JS FRONTEND                              │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  App Router (app/)                                        │  │
│  │  ├── layout.tsx    (Root Layout)                         │  │
│  │  ├── page.tsx      (Home Page)                           │  │
│  │  └── globals.css   (Tailwind Styles)                     │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Components                                               │  │
│  │  ├── PreferenceForm.tsx  (User Inputs)                  │  │
│  │  ├── GymResults.tsx      (Results Container)            │  │
│  │  ├── GymMap.tsx          (Leaflet Map)                  │  │
│  │  └── GymChart.tsx        (Recharts)                     │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  API Client (lib/api.ts)                                 │  │
│  │  └── Axios HTTP Client                                   │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                   │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ REST API Calls
                             │ (JSON)
                             │
┌────────────────────────────▼────────────────────────────────────┐
│                    FASTAPI BACKEND                               │
│                  http://localhost:8000                           │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  API Endpoints                                            │  │
│  │  ├── GET  /api/health                                    │  │
│  │  ├── POST /api/geocode                                   │  │
│  │  └── POST /api/recommendations                           │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Business Logic                                           │  │
│  │  ├── Preference calculation                              │  │
│  │  ├── NLP sentiment analysis (TextBlob)                   │  │
│  │  └── Rating aggregation                                  │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Caching Layer (LRU Cache)                               │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                   │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ API Requests
                             │
┌────────────────────────────▼────────────────────────────────────┐
│                   GOOGLE MAPS API                                │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Places API                                               │  │
│  │  ├── Nearby Search (gyms)                                │  │
│  │  ├── Place Details (reviews, ratings)                    │  │
│  │  └── Geocoding (location → lat/lng)                      │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                   │
└───────────────────────────────────────────────────────────────────┘
```

## Data Flow

```
┌──────────┐      ┌──────────┐      ┌──────────┐      ┌──────────┐
│          │      │          │      │          │      │          │
│   User   │─────▶│ Frontend │─────▶│ Backend  │─────▶│  Google  │
│          │      │          │      │          │      │   Maps   │
│          │      │ (Next.js)│      │ (FastAPI)│      │   API    │
└──────────┘      └──────────┘      └──────────┘      └──────────┘
     ▲                 │                  │                  │
     │                 │                  │                  │
     │                 ▼                  ▼                  ▼
     │            ┌─────────┐       ┌─────────┐       ┌─────────┐
     │            │ React   │       │  NLP    │       │ Gym     │
     └────────────│ State   │◀──────│ Engine  │◀──────│ Data    │
                  └─────────┘       └─────────┘       └─────────┘
                  
     User sees results in beautiful UI
```

## Request Flow Example

### 1. User Submits Preferences
```
User fills form → Frontend validates → Sends POST request
```

### 2. Frontend → Backend
```javascript
POST /api/recommendations
{
  "location": "New York, NY",
  "hygiene": 5,
  "equipment_quality": 4,
  ...
  "custom_filters": [{"keyword": "parking", "importance": 4}]
}
```

### 3. Backend Processing
```
┌─────────────────────────────────┐
│ 1. Geocode location             │
│    ├─ Call Google Geocoding API │
│    └─ Get lat/lng                │
│                                  │
│ 2. Fetch nearby gyms            │
│    ├─ Call Places Nearby Search │
│    └─ Get gym list               │
│                                  │
│ 3. Get detailed reviews          │
│    ├─ For each gym               │
│    ├─ Call Places Details API   │
│    └─ Get reviews                │
│                                  │
│ 4. Analyze reviews               │
│    ├─ TextBlob NLP               │
│    ├─ Match keywords             │
│    └─ Calculate scores           │
│                                  │
│ 5. Sort & filter                │
│    ├─ By tailored rating         │
│    ├─ Apply min rating filter    │
│    └─ Apply distance filter      │
└─────────────────────────────────┘
```

### 4. Backend → Frontend
```javascript
[
  {
    "gym_name": "Best Gym Ever",
    "tailored_rating": 8.5,
    "address": "123 Main St",
    "latitude": 40.7128,
    "longitude": -74.0060,
    ...
  },
  ...
]
```

### 5. Frontend Display
```
┌────────────────────────┐
│ GymResults Component   │
│                        │
│ ┌────────────────────┐ │
│ │   List View        │ │
│ │   (Cards)          │ │
│ └────────────────────┘ │
│                        │
│ ┌────────────────────┐ │
│ │   Map View         │ │
│ │   (Leaflet)        │ │
│ └────────────────────┘ │
│                        │
│ ┌────────────────────┐ │
│ │   Analytics        │ │
│ │   (Recharts)       │ │
│ └────────────────────┘ │
└────────────────────────┘
```

## Component Hierarchy

```
App (page.tsx)
│
├─ Header
│  └─ Logo + Title
│
├─ Hero Section
│  └─ Title + Description
│
├─ Main Content
│  │
│  ├─ PreferenceForm
│  │  ├─ Location Input
│  │  ├─ Preference Sliders (7)
│  │  ├─ Custom Filters
│  │  └─ Additional Filters
│  │
│  └─ GymResults
│     ├─ Header (with tabs)
│     │
│     ├─ List View
│     │  └─ GymCard (repeated)
│     │
│     ├─ Map View
│     │  └─ GymMap (Leaflet)
│     │     └─ Markers (with popups)
│     │
│     └─ Analytics View
│        └─ GymChart (Recharts)
│
└─ Footer
   └─ Copyright + Credits
```

## Technology Stack Details

```
┌─────────────────────────────────────────┐
│           FRONTEND STACK                 │
├─────────────────────────────────────────┤
│ Framework:      Next.js 14              │
│ Language:       TypeScript              │
│ Styling:        Tailwind CSS            │
│ Animation:      Framer Motion           │
│ HTTP Client:    Axios                   │
│ Maps:           React Leaflet           │
│ Charts:         Recharts                │
│ Icons:          Lucide React            │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│           BACKEND STACK                  │
├─────────────────────────────────────────┤
│ Framework:      FastAPI                 │
│ Language:       Python 3.8+             │
│ NLP:            TextBlob                │
│ Validation:     Pydantic                │
│ Google API:     googlemaps              │
│ HTTP:           Requests                │
│ Server:         Uvicorn                 │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│         EXTERNAL SERVICES                │
├─────────────────────────────────────────┤
│ Maps:           Google Maps API         │
│ Places:         Google Places API       │
│ Geocoding:      Google Geocoding API    │
└─────────────────────────────────────────┘
```

## Deployment Architecture

```
┌──────────────────────────────────────────────────────┐
│                    PRODUCTION                         │
└──────────────────────────────────────────────────────┘

┌─────────────────┐              ┌─────────────────┐
│   Vercel CDN    │              │   Railway       │
│   (Frontend)    │◀────────────▶│   (Backend)     │
│                 │   REST API   │                 │
│  • Next.js App  │              │  • FastAPI      │
│  • Static Files │              │  • Python       │
│  • Edge Network │              │  • Auto-scale   │
└─────────────────┘              └─────────────────┘
         │                                │
         │                                │
         ▼                                ▼
┌─────────────────┐              ┌─────────────────┐
│   Users         │              │  Google Maps    │
│   (Browsers)    │              │  API            │
└─────────────────┘              └─────────────────┘
```

## Security Flow

```
┌──────────────────────────────────────────┐
│  Environment Variables (.env)             │
│  ├── Frontend: NEXT_PUBLIC_API_URL       │
│  └── Backend:  GOOGLE_MAPS_API_KEY       │
└──────────────────────────────────────────┘
                    │
                    ▼
┌──────────────────────────────────────────┐
│  CORS Configuration                       │
│  ├── Allowed Origins: [frontend-url]     │
│  ├── Allowed Methods: [POST, GET]        │
│  └── Credentials: True                    │
└──────────────────────────────────────────┘
                    │
                    ▼
┌──────────────────────────────────────────┐
│  Google API Restrictions                  │
│  ├── HTTP Referrers                       │
│  ├── API Restrictions (Places only)       │
│  └── Quota Management                     │
└──────────────────────────────────────────┘
```

## This Architecture Provides:

✅ **Scalability**: Can handle thousands of concurrent users
✅ **Maintainability**: Clear separation of concerns
✅ **Performance**: Caching, optimization, CDN
✅ **Security**: API keys protected, CORS configured
✅ **Flexibility**: Easy to add features or change UI
✅ **Testing**: Each component can be tested independently
✅ **Deployment**: Multiple hosting options available

---

**Understanding this architecture will help you:**
- Debug issues faster
- Add new features easily
- Deploy to production confidently
- Explain your project to others
- Scale as your user base grows
