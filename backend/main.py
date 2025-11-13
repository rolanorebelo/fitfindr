from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Dict, Optional
import requests
import googlemaps
from textblob import TextBlob
import os
from dotenv import load_dotenv
from functools import lru_cache

load_dotenv()

app = FastAPI(title="FitFindr API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],  # Next.js default ports
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuration
API_KEY = os.getenv('GOOGLE_MAPS_API_KEY')
gmaps = googlemaps.Client(key=API_KEY)

# Preference keywords for review analysis
PREFERENCE_KEYWORDS = {
    'hygiene': ['clean', 'sanitary', 'hygienic', 'spotless', 'tidy'],
    'equipment_quality': ['equipment', 'machines', 'weights', 'dumbbells', 'modern', 'new'],
    'less_crowd': ['crowded', 'busy', 'people', 'packed', 'empty', 'spacious'],
    'trainer_knowledge': ['trainer', 'coach', 'instructor', 'knowledgeable', 'helpful', 'professional'],
    'price': ['price', 'cost', 'expensive', 'affordable', 'cheap', 'value'],
    'amenities': ['pool', 'sauna', 'classes', 'locker', 'shower', 'parking'],
    'atmosphere': ['atmosphere', 'environment', 'vibe', 'friendly', 'welcoming', 'community']
}

# Pydantic models
class CustomFilter(BaseModel):
    keyword: str
    importance: int = Field(ge=1, le=5)

class PreferenceRequest(BaseModel):
    location: str
    hygiene: int = Field(ge=1, le=5, default=3)
    equipment_quality: int = Field(ge=1, le=5, default=3)
    less_crowd: int = Field(ge=1, le=5, default=3)
    trainer_knowledge: int = Field(ge=1, le=5, default=3)
    price: int = Field(ge=1, le=5, default=3)
    amenities: int = Field(ge=1, le=5, default=3)
    atmosphere: int = Field(ge=1, le=5, default=3)
    custom_filters: List[CustomFilter] = []
    min_rating: float = Field(ge=0.0, le=5.0, default=0.0)
    max_distance: int = Field(ge=1, le=10, default=5)

class GymResponse(BaseModel):
    gym_name: str
    tailored_rating: float
    address: str
    phone: Optional[str]
    website: Optional[str]
    latitude: float
    longitude: float

class LocationResponse(BaseModel):
    latitude: float
    longitude: float
    formatted_address: str

# Utility functions
@lru_cache(maxsize=100)
def get_lat_lng(location_name: str):
    """Get latitude and longitude from location name"""
    try:
        geocode_result = gmaps.geocode(location_name)
        if geocode_result:
            location = geocode_result[0]['geometry']['location']
            formatted_address = geocode_result[0]['formatted_address']
            return location['lat'], location['lng'], formatted_address
        return None, None, None
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Geocoding error: {str(e)}")

def get_nearby_gyms(lat: float, lng: float, radius: int):
    """Fetch nearby gyms using Google Places API"""
    url = f"https://maps.googleapis.com/maps/api/place/nearbysearch/json"
    params = {
        "location": f"{lat},{lng}",
        "radius": radius,
        "type": "gym",
        "key": API_KEY
    }
    
    try:
        response = requests.get(url, params=params)
        response.raise_for_status()
        return response.json().get('results', [])
    except requests.RequestException as e:
        raise HTTPException(status_code=500, detail=f"Error fetching gyms: {str(e)}")

def get_gym_details(place_id: str):
    """Get detailed information about a gym"""
    url = f"https://maps.googleapis.com/maps/api/place/details/json"
    params = {
        "place_id": place_id,
        "fields": "name,rating,reviews,formatted_address,formatted_phone_number,website",
        "key": API_KEY
    }
    
    try:
        response = requests.get(url, params=params)
        response.raise_for_status()
        return response.json().get('result', {})
    except requests.RequestException as e:
        raise HTTPException(status_code=500, detail=f"Error fetching gym details: {str(e)}")

def calculate_preference_rating(review_text: str, preferences: dict, custom_filters: List[CustomFilter]):
    """Calculate tailored rating based on preferences and review text"""
    blob = TextBlob(review_text.lower())
    score = 0
    
    # Check predefined preferences
    for pref, importance in preferences.items():
        for keyword in PREFERENCE_KEYWORDS.get(pref, []):
            if keyword in blob.words:
                score += importance
    
    # Check custom filters
    for filter_item in custom_filters:
        if filter_item.keyword.lower() in blob.words:
            score += filter_item.importance
    
    return score

# API endpoints
@app.get("/")
async def root():
    return {"message": "FitFindr API", "version": "1.0.0"}

@app.get("/api/health")
async def health_check():
    return {"status": "healthy"}

@app.post("/api/geocode", response_model=LocationResponse)
async def geocode_location(location: str):
    """Convert location name to coordinates"""
    lat, lng, formatted_address = get_lat_lng(location)
    
    if lat is None or lng is None:
        raise HTTPException(status_code=404, detail="Location not found")
    
    return LocationResponse(
        latitude=lat,
        longitude=lng,
        formatted_address=formatted_address
    )

@app.post("/api/recommendations", response_model=List[GymResponse])
async def get_gym_recommendations(request: PreferenceRequest):
    """Get personalized gym recommendations"""
    
    # Get coordinates
    lat, lng, _ = get_lat_lng(request.location)
    
    if lat is None or lng is None:
        raise HTTPException(status_code=404, detail="Location not found")
    
    # Convert km to meters
    radius = request.max_distance * 1000
    
    # Fetch nearby gyms
    gyms = get_nearby_gyms(lat, lng, radius)
    
    if not gyms:
        return []
    
    # Prepare preferences dict
    preferences = {
        'hygiene': request.hygiene,
        'equipment_quality': request.equipment_quality,
        'less_crowd': request.less_crowd,
        'trainer_knowledge': request.trainer_knowledge,
        'price': request.price,
        'amenities': request.amenities,
        'atmosphere': request.atmosphere
    }
    
    # Process each gym
    gym_ratings = []
    
    for gym in gyms:
        try:
            place_id = gym['place_id']
            gym_details = get_gym_details(place_id)
            
            gym_name = gym_details.get('name', '')
            gym_address = gym_details.get('formatted_address', '')
            gym_phone = gym_details.get('formatted_phone_number')
            gym_website = gym_details.get('website')
            reviews = gym_details.get('reviews', [])
            
            # Calculate tailored rating
            total_score = 0
            for review in reviews:
                review_text = review.get('text', '')
                review_score = calculate_preference_rating(
                    review_text, 
                    preferences, 
                    request.custom_filters
                )
                total_score += review_score
            
            avg_rating = total_score / len(reviews) if reviews else 0
            
            # Apply minimum rating filter
            if avg_rating >= request.min_rating:
                gym_ratings.append(GymResponse(
                    gym_name=gym_name,
                    tailored_rating=round(avg_rating, 2),
                    address=gym_address,
                    phone=gym_phone,
                    website=gym_website,
                    latitude=gym['geometry']['location']['lat'],
                    longitude=gym['geometry']['location']['lng']
                ))
        except Exception as e:
            # Skip gyms that cause errors
            continue
    
    # Sort by tailored rating
    gym_ratings.sort(key=lambda x: x.tailored_rating, reverse=True)
    
    return gym_ratings

if __name__ == "__main__":
    import uvicorn
    import sys
    
    port = 8000
    if len(sys.argv) > 1 and sys.argv[1] == "--port":
        try:
            port = int(sys.argv[2])
        except (IndexError, ValueError):
            print("Invalid port number. Using default port 8000.")
    
    uvicorn.run(app, host="0.0.0.0", port=port)
