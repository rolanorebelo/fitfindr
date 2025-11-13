'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Plus, X, Search } from 'lucide-react'
import { gymApi } from '@/lib/api'
import { Gym, CustomFilter } from '@/types'

interface PreferenceFormProps {
  onSubmit: (data: { location: string; gyms: Gym[] }) => void
  setLoading: (loading: boolean) => void
}

export default function PreferenceForm({ onSubmit, setLoading }: PreferenceFormProps) {
  const [location, setLocation] = useState('')
  const [hygiene, setHygiene] = useState(3)
  const [equipmentQuality, setEquipmentQuality] = useState(3)
  const [lessCrowd, setLessCrowd] = useState(3)
  const [trainerKnowledge, setTrainerKnowledge] = useState(3)
  const [price, setPrice] = useState(3)
  const [amenities, setAmenities] = useState(3)
  const [atmosphere, setAtmosphere] = useState(3)
  const [customFilters, setCustomFilters] = useState<CustomFilter[]>([])
  const [newKeyword, setNewKeyword] = useState('')
  const [newImportance, setNewImportance] = useState(3)
  const [minRating, setMinRating] = useState(0)
  const [maxDistance, setMaxDistance] = useState(5)
  const [error, setError] = useState('')

  const handleAddCustomFilter = () => {
    if (newKeyword.trim()) {
      setCustomFilters([...customFilters, { keyword: newKeyword, importance: newImportance }])
      setNewKeyword('')
      setNewImportance(3)
    }
  }

  const handleRemoveCustomFilter = (index: number) => {
    setCustomFilters(customFilters.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const gyms = await gymApi.getRecommendations({
        location,
        hygiene,
        equipment_quality: equipmentQuality,
        less_crowd: lessCrowd,
        trainer_knowledge: trainerKnowledge,
        price,
        amenities,
        atmosphere,
        custom_filters: customFilters,
        min_rating: minRating,
        max_distance: maxDistance,
      })

      onSubmit({ location, gyms })
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to fetch gym recommendations')
    } finally {
      setLoading(false)
    }
  }

  const SliderInput = ({ label, value, onChange }: { label: string; value: number; onChange: (val: number) => void }) => (
    <div className="space-y-3">
      <div className="flex items-center justify-between min-h-[1.5rem]">
        <label className="text-sm font-medium text-gray-200 dark:text-gray-200 light:text-gray-700 leading-tight">{label}</label>
        <span className="text-sm font-bold text-red-400 dark:text-red-400 light:text-blue-600 bg-gray-800 dark:bg-gray-800 light:bg-blue-50 px-2 py-1 rounded-md min-w-[2rem] text-center">{value}</span>
      </div>
      <div className="relative">
        <input
          type="range"
          min="1"
          max="5"
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value))}
          className="w-full h-2 bg-gray-700 dark:bg-gray-700 light:bg-gray-200 rounded-lg appearance-none cursor-pointer accent-red-600 dark:accent-red-600 light:accent-blue-600"
        />
        <div className="flex justify-between text-xs text-gray-400 dark:text-gray-400 light:text-gray-500 mt-1 px-1">
          <span className="font-medium">Low</span>
          <span className="font-medium">High</span>
        </div>
      </div>
    </div>
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-gray-900 dark:bg-gray-900 light:bg-white border border-red-800 dark:border-red-800 light:border-blue-300 rounded-2xl shadow-xl p-4 sm:p-6 space-y-4 sm:space-y-6 sticky top-20 sm:top-24"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="flex items-center gap-2 mb-6"
      >
        <motion.div
          whileHover={{ rotate: 15 }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          <div className="bg-red-900 p-2 rounded-lg">
            <MapPin className="h-5 w-5 text-red-400" />
          </div>
        </motion.div>
        <h3 className="text-xl font-bold text-gray-100 dark:text-gray-100 light:text-gray-900">Your Preferences</h3>
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Top Row: Location and Search Button */}
        <div className="flex flex-col sm:flex-row gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-200 mb-2">
              Location
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g., New York, NY"
              className="w-full px-4 py-3 bg-gray-800 dark:bg-gray-800 light:bg-gray-100 border border-red-700 dark:border-red-700 light:border-blue-300 rounded-lg focus:ring-2 focus:ring-red-500 dark:focus:ring-red-500 light:focus:ring-blue-500 focus:border-transparent transition text-gray-100 dark:text-gray-100 light:text-gray-900 placeholder-gray-400 dark:placeholder-gray-400 light:placeholder-gray-500"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold py-3 px-6 sm:px-8 rounded-lg hover:from-red-700 hover:to-red-800 transition shadow-lg hover:shadow-xl flex items-center gap-2 whitespace-nowrap text-sm sm:text-base"
          >
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              <Search className="h-4 w-4 sm:h-5 sm:w-5" />
            </motion.div>
            <span className="sm:hidden">Search</span>
            <span className="hidden sm:inline">Find Gyms</span>
          </button>
        </div>

        {/* Custom Filters */}
        <div>
          <label className="block text-sm font-medium text-gray-200 mb-2">
            Custom Filters
          </label>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={newKeyword}
              onChange={(e) => setNewKeyword(e.target.value)}
              placeholder="Keyword (e.g., parking)"
              className="flex-1 px-3 py-2 bg-gray-800 dark:bg-gray-800 light:bg-gray-100 border border-red-700 dark:border-red-700 light:border-blue-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 dark:focus:ring-red-500 light:focus:ring-blue-500 focus:border-transparent text-gray-100 dark:text-gray-100 light:text-gray-900 placeholder-gray-400 dark:placeholder-gray-400 light:placeholder-gray-500"
            />
            <div className="flex gap-2">
              <input
                type="number"
                min="1"
                max="5"
                value={newImportance}
                onChange={(e) => setNewImportance(parseInt(e.target.value))}
                className="w-16 px-3 py-2 bg-gray-800 dark:bg-gray-800 light:bg-gray-100 border border-red-700 dark:border-red-700 light:border-blue-300 rounded-lg text-sm text-center focus:ring-2 focus:ring-red-500 dark:focus:ring-red-500 light:focus:ring-blue-500 focus:border-transparent text-gray-100 dark:text-gray-100 light:text-gray-900"
              />
              <button
                type="button"
                onClick={handleAddCustomFilter}
                className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex-shrink-0"
              >
                <Plus className="h-5 w-5" />
              </button>
            </div>
          </div>
          {customFilters.length > 0 && (
            <div className="mt-2 space-y-1 max-h-20 overflow-y-auto">
              {customFilters.map((filter, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-red-900 px-2 py-1 rounded text-xs"
                >
                  <span className="text-gray-100 dark:text-gray-100 light:text-gray-900">
                    {filter.keyword} <span className="text-red-300">({filter.importance})</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveCustomFilter(index)}
                    className="text-red-400 hover:text-red-200 ml-2"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Preference Sliders Grid */}
        <div>
          <h4 className="font-semibold text-gray-200 dark:text-gray-200 light:text-gray-700 text-base uppercase tracking-wide mb-6 text-center sm:text-left">
            Rate Importance (1-5)
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            <SliderInput label="Hygiene" value={hygiene} onChange={setHygiene} />
            <SliderInput label="Equipment Quality" value={equipmentQuality} onChange={setEquipmentQuality} />
            <SliderInput label="Less Crowded" value={lessCrowd} onChange={setLessCrowd} />
            <SliderInput label="Trainer Knowledge" value={trainerKnowledge} onChange={setTrainerKnowledge} />
            <SliderInput label="Price" value={price} onChange={setPrice} />
            <SliderInput label="Amenities" value={amenities} onChange={setAmenities} />
            <SliderInput label="Atmosphere" value={atmosphere} onChange={setAtmosphere} />
          </div>
        </div>

        {/* Additional Filters Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between min-h-[1.5rem]">
              <label className="text-sm font-medium text-gray-200 dark:text-gray-200 light:text-gray-700 leading-tight">Minimum Rating</label>
              <span className="text-sm font-bold text-red-400 dark:text-red-400 light:text-blue-600 bg-gray-800 dark:bg-gray-800 light:bg-blue-50 px-2 py-1 rounded-md min-w-[2.5rem] text-center">{minRating}</span>
            </div>
            <div className="relative">
              <input
                type="range"
                min="0"
                max="5"
                step="0.1"
                value={minRating}
                onChange={(e) => setMinRating(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-700 dark:bg-gray-700 light:bg-gray-200 rounded-lg appearance-none cursor-pointer accent-red-600 dark:accent-red-600 light:accent-blue-600"
              />
              <div className="flex justify-between text-xs text-gray-400 dark:text-gray-400 light:text-gray-500 mt-1 px-1">
                <span className="font-medium">0</span>
                <span className="font-medium">5</span>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between min-h-[1.5rem]">
              <label className="text-sm font-medium text-gray-200 dark:text-gray-200 light:text-gray-700 leading-tight">Max Distance</label>
              <span className="text-sm font-bold text-red-400 dark:text-red-400 light:text-blue-600 bg-gray-800 dark:bg-gray-800 light:bg-blue-50 px-2 py-1 rounded-md min-w-[3rem] text-center">{maxDistance} km</span>
            </div>
            <div className="relative">
              <input
                type="range"
                min="1"
                max="10"
                value={maxDistance}
                onChange={(e) => setMaxDistance(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-700 dark:bg-gray-700 light:bg-gray-200 rounded-lg appearance-none cursor-pointer accent-red-600 dark:accent-red-600 light:accent-blue-600"
              />
              <div className="flex justify-between text-xs text-gray-400 dark:text-gray-400 light:text-gray-500 mt-1 px-1">
                <span className="font-medium">1 km</span>
                <span className="font-medium">10 km</span>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-900 dark:bg-red-900 light:bg-blue-50 border border-red-700 dark:border-red-700 light:border-blue-300 text-red-200 dark:text-red-200 light:text-blue-800 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}
      </form>
    </motion.div>
  )
}
