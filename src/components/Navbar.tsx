import { HeartIcon, SparklesIcon } from '@heroicons/react/24/outline'
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid'

interface NavbarProps {
  liked: boolean
  likeCount: number
  isLikeAnimating: boolean
  onLike: () => void
}

export default function Navbar({ liked, likeCount, isLikeAnimating, onLike }: NavbarProps) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      <div className="absolute inset-0 bg-white/70 backdrop-blur-md border-b border-gray-100"></div>
      <div className="relative max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <SparklesIcon className="h-5 w-5 text-red-500" />
          <span className="text-xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
            Yiboss.com
          </span>
        </div>
        <button
          onClick={onLike}
          disabled={isLikeAnimating}
          className="group flex items-center gap-2 px-4 py-2 rounded-full bg-white hover:bg-red-50 border border-gray-100 shadow-sm transition-all"
        >
          <div className="relative">
            {liked ? (
              <HeartIconSolid 
                className={`h-4 w-4 text-red-500 transform transition-all duration-300 
                  ${isLikeAnimating ? 'scale-125' : 'scale-100'}`}
              />
            ) : (
              <HeartIcon className="h-4 w-4 text-gray-400 group-hover:text-red-500 transition-colors" />
            )}
            {isLikeAnimating && liked && (
              <div className="absolute -top-1 -right-1 animate-ping">
                <HeartIconSolid className="h-3 w-3 text-red-500 opacity-75" />
              </div>
            )}
          </div>
          <span className={`text-sm transition-all duration-300
            ${isLikeAnimating && liked ? 'text-red-500 font-medium' : 'text-gray-500'}`}>
            {likeCount.toLocaleString()}
          </span>
        </button>
      </div>
    </nav>
  )
} 