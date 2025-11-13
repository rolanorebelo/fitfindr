import axios from 'axios'
import { Gym, PreferenceData, LocationResponse } from '@/types'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const gymApi = {
  async getRecommendations(data: PreferenceData): Promise<Gym[]> {
    const response = await apiClient.post<Gym[]>('/api/recommendations', data)
    return response.data
  },

  async geocodeLocation(location: string): Promise<LocationResponse> {
    const response = await apiClient.post<LocationResponse>(
      '/api/geocode',
      null,
      {
        params: { location },
      }
    )
    return response.data
  },

  async healthCheck(): Promise<{ status: string }> {
    const response = await apiClient.get('/api/health')
    return response.data
  },
}

export default apiClient
