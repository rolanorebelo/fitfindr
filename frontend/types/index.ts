export interface Gym {
  gym_name: string
  tailored_rating: number
  address: string
  phone: string | null
  website: string | null
  latitude: number
  longitude: number
}

export interface PreferenceData {
  location: string
  hygiene: number
  equipment_quality: number
  less_crowd: number
  trainer_knowledge: number
  price: number
  amenities: number
  atmosphere: number
  custom_filters: CustomFilter[]
  min_rating: number
  max_distance: number
}

export interface CustomFilter {
  keyword: string
  importance: number
}

export interface LocationResponse {
  latitude: number
  longitude: number
  formatted_address: string
}
