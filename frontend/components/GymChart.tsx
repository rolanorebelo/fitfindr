'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { Gym } from '@/types'

interface GymChartProps {
  gyms: Gym[]
}

export default function GymChart({ gyms }: GymChartProps) {
  const data = gyms.map((gym) => ({
    name: gym.gym_name.length > 20 ? gym.gym_name.substring(0, 20) + '...' : gym.gym_name,
    rating: gym.tailored_rating,
    fullName: gym.gym_name,
  }))

  // Generate colors based on rating
  const getColor = (rating: number) => {
    if (rating >= 7) return '#dc2626' // Red
    if (rating >= 5) return '#ea580c' // Orange-red
    if (rating >= 3) return '#ca8a04' // Yellow
    return '#7c2d12' // Dark red
  }

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
        <XAxis
          dataKey="name"
          angle={-45}
          textAnchor="end"
          height={100}
          tick={{ fill: '#9ca3af', fontSize: 12 }}
        />
        <YAxis
          tick={{ fill: '#9ca3af' }}
          label={{ value: 'Tailored Rating', angle: -90, position: 'insideLeft', fill: '#9ca3af' }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: '#1f2937',
            border: '1px solid #374151',
            borderRadius: '0.5rem',
            padding: '12px',
          }}
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              return (
                <div className="bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-600">
                  <p className="font-semibold text-gray-100 mb-1">{payload[0].payload.fullName}</p>
                  <p className="text-sm text-red-400">
                    Rating: <span className="font-bold">{typeof payload[0].value === 'number' ? payload[0].value.toFixed(1) : payload[0].value}</span>
                  </p>
                </div>
              )
            }
            return null
          }}
        />
        <Bar dataKey="rating" radius={[8, 8, 0, 0]}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={getColor(entry.rating)} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
