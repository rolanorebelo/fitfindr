'use client'

import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import { Gym } from '@/types'

// Fix for default marker icons in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

interface GymMapProps {
  gyms: Gym[]
}

export default function GymMap({ gyms }: GymMapProps) {
  if (gyms.length === 0) {
    return (
      <div className="h-[500px] flex items-center justify-center bg-gray-800 rounded-lg border border-red-800">
        <p className="text-gray-400">No gyms to display</p>
      </div>
    )
  }

  // Calculate center position
  const avgLat = gyms.reduce((sum, gym) => sum + gym.latitude, 0) / gyms.length
  const avgLng = gyms.reduce((sum, gym) => sum + gym.longitude, 0) / gyms.length

  return (
    <MapContainer
      center={[avgLat, avgLng]}
      zoom={13}
      style={{ height: '500px', width: '100%', borderRadius: '0.5rem' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {gyms.map((gym, index) => (
        <Marker key={index} position={[gym.latitude, gym.longitude]}>
          <Popup>
            <div className="p-2 bg-gray-800 text-gray-100 rounded">
              <h3 className="font-bold text-gray-100 mb-1">{gym.gym_name}</h3>
              <p className="text-sm text-gray-300 mb-2">
                Rating: <span className="font-semibold text-red-400">{gym.tailored_rating.toFixed(1)}</span>
              </p>
              {gym.website && (
                <a
                  href={gym.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-red-400 hover:text-red-300 hover:underline"
                >
                  Visit Website →
                </a>
              )}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}
