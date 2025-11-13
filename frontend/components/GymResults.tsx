'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import { Phone, Globe, MapPin, Star, Download, BarChart3 } from 'lucide-react'
import { Gym } from '@/types'
import GymChart from './GymChart'

// Dynamic import for map to avoid SSR issues
const GymMap = dynamic(() => import('./GymMap'), {
  ssr: false,
  loading: () => (
    <div className="h-[500px] flex items-center justify-center bg-gray-800 dark:bg-gray-800 light:bg-gray-200 rounded-lg border border-red-800 dark:border-red-800 light:border-blue-300">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 dark:border-red-600 light:border-blue-600"></div>
    </div>
  )
})

interface GymResultsProps {
  gyms: Gym[]
  location: string
}

export default function GymResults({ gyms, location }: GymResultsProps) {
  const [activeTab, setActiveTab] = useState<'list' | 'map' | 'chart'>('list')

  const downloadCSV = () => {
    const headers = ['Gym Name', 'Tailored Rating', 'Address', 'Phone', 'Website', 'Latitude', 'Longitude']
    const csvContent = [
      headers.join(','),
      ...gyms.map(gym =>
        [
          `"${gym.gym_name}"`,
          gym.tailored_rating,
          `"${gym.address}"`,
          gym.phone || '',
          gym.website || '',
          gym.latitude,
          gym.longitude,
        ].join(',')
      ),
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'gym_recommendations.csv'
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gray-900 border border-red-800 rounded-2xl shadow-xl p-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-100 mb-1">
              {gyms.length} Gyms Found
            </h2>
            <p className="text-gray-400 flex items-center gap-2 text-sm sm:text-base">
              <MapPin className="h-4 w-4" />
              {location}
            </p>
          </div>
          <button
            onClick={downloadCSV}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm sm:text-base self-start sm:self-auto"
          >
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Download CSV</span>
            <span className="sm:hidden">CSV</span>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 sm:gap-2 mt-6 border-b border-red-800 overflow-x-auto">
          <button
            onClick={() => setActiveTab('list')}
            className={`px-3 sm:px-4 py-2 font-medium transition text-sm sm:text-base whitespace-nowrap ${
              activeTab === 'list'
                ? 'text-red-500 border-b-2 border-red-500'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            List View
          </button>
          <button
            onClick={() => setActiveTab('map')}
            className={`px-3 sm:px-4 py-2 font-medium transition text-sm sm:text-base whitespace-nowrap ${
              activeTab === 'map'
                ? 'text-red-500 border-b-2 border-red-500'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            Map View
          </button>
          <button
            onClick={() => setActiveTab('chart')}
            className={`px-3 sm:px-4 py-2 font-medium transition text-sm sm:text-base whitespace-nowrap flex items-center gap-1 sm:gap-2 ${
              activeTab === 'chart'
                ? 'text-red-500 border-b-2 border-red-500'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <BarChart3 className="h-4 w-4" />
            Analytics
          </button>
        </div>
      </motion.div>

      {/* Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === 'list' && (
          <div className="bg-gray-900 border border-red-800 rounded-xl shadow-lg p-6">
            <div className="max-h-80 sm:max-h-96 overflow-y-auto scrollbar-transparent space-y-4">
              {gyms.map((gym, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.02 }}
                  className="bg-gray-800 border border-red-700 rounded-xl p-6 hover:bg-gray-700 transition-all duration-300 cursor-pointer"
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-xl font-bold text-gray-100">
                          {index + 1}. {gym.gym_name}
                        </h3>
                        <div className="flex items-center gap-1 bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1 rounded-full">
                          <Star className="h-4 w-4 fill-current" />
                          <span className="font-bold">{gym.tailored_rating.toFixed(1)}</span>
                        </div>
                      </div>
                      <p className="text-gray-300 mb-3 flex items-start gap-2">
                        <MapPin className="h-4 w-4 mt-1 flex-shrink-0" />
                        {gym.address}
                      </p>
                      <div className="flex flex-wrap gap-3">
                        {gym.phone && (
                          <a
                            href={`tel:${gym.phone}`}
                            className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300"
                          >
                            <Phone className="h-4 w-4" />
                            {gym.phone}
                          </a>
                        )}
                        {gym.website && (
                          <a
                            href={gym.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300"
                          >
                            <Globe className="h-4 w-4" />
                            Visit Website
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'map' && (
          <div className="bg-gray-900 border border-red-800 rounded-xl shadow-lg p-6">
            <GymMap gyms={gyms} />
          </div>
        )}

        {activeTab === 'chart' && (
          <div className="bg-gray-900 border border-red-800 rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-100 mb-6">
              Top 10 Gyms by Rating
            </h3>
            <GymChart gyms={gyms.slice(0, 10)} />
          </div>
        )}
      </motion.div>
    </div>
  )
}
