'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Dumbbell, MapPin, Sparkles } from 'lucide-react'
import PreferenceForm from '@/components/PreferenceForm'
import GymResults from '@/components/GymResults'
import { Gym } from '@/types'
import { ThemeToggle } from '@/components/ThemeToggle'

export default function Home() {
  const [gyms, setGyms] = useState<Gym[]>([])
  const [loading, setLoading] = useState(false)
  const [location, setLocation] = useState('')

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-red-900 dark:from-black dark:via-gray-900 dark:to-red-900 light:from-blue-50 light:via-white light:to-blue-100">
      {/* Header */}
      <header className="border-b border-red-800 dark:border-red-800 light:border-blue-300 bg-black/80 dark:bg-black/80 light:bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mb-4"
            >
              <div className="bg-gradient-to-br from-red-600 to-red-800 p-4 rounded-2xl shadow-2xl">
                <Dumbbell className="h-12 w-12 text-white" />
              </div>
            </motion.div>
            <div className="mb-2">
              <motion.h1
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-red-500 to-red-700 bg-clip-text text-transparent"
              >
                FitFindr
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-sm text-gray-400 dark:text-gray-400 light:text-gray-600"
              >
                Find Your Perfect Gym
              </motion.p>
            </div>
            <div className="flex items-center gap-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="flex items-center gap-2 text-sm text-gray-400 dark:text-gray-400 light:text-gray-600"
              >
                <Sparkles className="h-4 w-4 text-red-500" />
                <span>AI-Powered Recommendations</span>
              </motion.div>
              <ThemeToggle />
            </div>
          </motion.div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <motion.h2
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
                className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-red-500 via-red-600 to-red-700 dark:from-red-500 dark:via-red-600 dark:to-red-700 light:from-blue-600 light:via-blue-700 light:to-blue-800 bg-clip-text text-transparent"
            >
              Discover Gyms Tailored to You
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="text-lg sm:text-xl text-gray-300 dark:text-gray-300 light:text-gray-700 mb-10 leading-relaxed"
            >
              Get personalized gym recommendations based on your preferences and real user reviews
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="flex justify-center"
            >
              <div className="flex items-center gap-4 text-red-400 dark:text-red-400 light:text-blue-600">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="h-6 w-6" />
                </motion.div>
                <span className="text-lg font-medium">Powered by AI</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 pb-16">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="grid lg:grid-cols-3 gap-8"
        >
          {/* Preference Form */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              whileHover={{ scale: 1.02 }}
              className="transition-transform duration-300"
            >
              <PreferenceForm
                onSubmit={(data) => {
                  setLocation(data.location)
                  setGyms(data.gyms)
                }}
                setLoading={setLoading}
              />
            </motion.div>
          </div>

          {/* Results */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9, duration: 0.6 }}
              whileHover={{ scale: 1.01 }}
              className="transition-transform duration-300"
            >
              {loading ? (
                <motion.div
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ repeat: Infinity, repeatType: "reverse", duration: 1 }}
                  className="bg-gray-900 dark:bg-gray-900 light:bg-white border border-red-800 dark:border-red-800 light:border-gray-300 rounded-2xl shadow-xl p-12 text-center"
                >
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 dark:border-red-600 light:border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-300 dark:text-gray-300 light:text-gray-700">Finding your perfect gyms...</p>
                </motion.div>
              ) : gyms.length > 0 ? (
                <GymResults gyms={gyms} location={location} />
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.1, duration: 0.5 }}
                  className="bg-gray-900 dark:bg-gray-900 light:bg-white border border-red-800 dark:border-red-800 light:border-blue-300 rounded-2xl shadow-xl p-12 text-center"
                >
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <MapPin className="h-16 w-16 text-gray-600 dark:text-gray-600 light:text-gray-400 mx-auto mb-4" />
                  </motion.div>
                  <h3 className="text-xl font-semibold text-gray-200 dark:text-gray-200 light:text-gray-800 mb-2">
                    Ready to Find Your Gym?
                  </h3>
                  <p className="text-gray-400 dark:text-gray-400 light:text-gray-600">
                    Enter your location and preferences to get started
                  </p>
                </motion.div>
              )}
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="border-t border-red-800 dark:border-red-800 light:border-blue-300 bg-black/80 dark:bg-black/80 light:bg-white/80 backdrop-blur-md mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-sm text-gray-400 dark:text-gray-400 light:text-gray-600">
            <p>© 2025 FitFindr. Powered by Google Places API & Natural Language Processing</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
