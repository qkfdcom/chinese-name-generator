import { SparklesIcon, StarIcon } from '@heroicons/react/24/outline'

interface StatsProps {
  userCount: number
  rating: number
}

export default function Stats({ userCount, rating }: StatsProps) {
  return (
    <div className="flex items-center justify-center gap-4 mt-6 text-sm text-gray-500">
      <div className="flex items-center gap-1">
        <SparklesIcon className="h-4 w-4 text-yellow-400" />
        <span>{userCount.toLocaleString()}+ users</span>
      </div>
      <div className="w-1 h-1 rounded-full bg-gray-300"></div>
      <div className="flex items-center gap-1">
        <StarIcon className="h-4 w-4 text-yellow-400" />
        <span>{rating} rating</span>
      </div>
    </div>
  )
} 