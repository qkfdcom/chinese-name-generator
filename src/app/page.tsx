'use client'
import { useState, useEffect } from 'react'
import { generateNameWithHunyuan } from '@/services/hunyuanService'
import { generateChineseName } from '@/utils/nameGenerator'
import { 
  ClipboardIcon, 
  CheckIcon, 
  HeartIcon, 
  SparklesIcon 
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid'
import Stats from '@/components/Stats'

export default function Home() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    gender: 'female',
    style: 'elegant'
  })

  const [nameResult, setNameResult] = useState<{
    chinese: string;
    pinyin: string;
    onlineName: string;
  } | null>(null)

  const [isLoading, setIsLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const [isLikeAnimating, setIsLikeAnimating] = useState(false)

  const [stats, setStats] = useState({
    userCount: 0,
    rating: 0,
    likeCount: 0
  })

  useEffect(() => {
    setStats({
      userCount: Math.floor(Math.random() * 1000 + 5000),
      rating: Number((4.5 + Math.random() * 0.5).toFixed(1)),
      likeCount: Math.floor(Math.random() * 1000 + 500)
    })
  }, [])

  useEffect(() => {
    const hasLiked = localStorage.getItem('yiboss_liked') === 'true'
    setLiked(hasLiked)
    const baseCount = 12876
    const dailyVariation = Math.floor(Math.random() * 50)
    setLikeCount(baseCount + dailyVariation)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await generateNameWithHunyuan(
        formData.firstName,
        formData.lastName,
        formData.gender,
        formData.style
      )
      setNameResult(result)
    } catch (err) {
      console.error('Hunyuan API failed, falling back to local generator:', err)
      const localResult = generateChineseName(
        formData.firstName,
        formData.lastName,
        formData.gender,
        formData.style
      )
      setNameResult(localResult)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopyClick = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const validateInput = (value: string) => {
    return /^[a-zA-Z\s-]*$/.test(value)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    if (validateInput(value)) {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleLike = () => {
    if (isLikeAnimating) return

    setIsLikeAnimating(true)
    setLiked(!liked)
    setLikeCount(prev => liked ? prev - 1 : prev + 1)
    
    localStorage.setItem('yiboss_liked', (!liked).toString())

    setTimeout(() => {
      setIsLikeAnimating(false)
    }, 1000)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50">
      {/* 背景装饰 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(255,0,0,0.05),transparent_40%)]"></div>
        <div className="absolute w-full h-full bg-[radial-gradient(circle_at_bottom_left,rgba(255,192,203,0.08),transparent_40%)]"></div>
      </div>

      {/* 顶部导航 */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/70 border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SparklesIcon className="h-5 w-5 text-red-500" />
            <span className="text-xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
              Yiboss.com
            </span>
          </div>
          <button
            onClick={handleLike}
            disabled={isLikeAnimating}
            className="group flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 hover:bg-red-50 border border-gray-100 shadow-sm transition-all"
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
            </div>
            <span className="text-sm text-gray-500">{likeCount.toLocaleString()}</span>
          </button>
        </div>
      </nav>

      {/* 主要内容区域 */}
      <div className="max-w-5xl mx-auto px-4 py-8 md:py-12">
        {/* 标题部分 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-red-600 via-pink-500 to-orange-500 bg-clip-text text-transparent">
            Create Your Chinese Name
          </h1>
          <p className="text-gray-600 md:text-lg max-w-2xl mx-auto">
            Join thousands of users worldwide in discovering your perfect Chinese name for social media platforms like Douyin and Xiaohongshu.
          </p>
          <Stats userCount={stats.userCount} rating={stats.rating} />
        </div>

        {/* 表单部分 */}
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6 bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-xl">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="mt-1 w-full px-4 py-2 bg-white/50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="mt-1 w-full px-4 py-2 bg-white/50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
              <div className="flex flex-wrap gap-4">
                {[
                  { value: 'female', label: 'Female' },
                  { value: 'male', label: 'Male' },
                  { value: 'neutral', label: 'Neutral' }
                ].map((option) => (
                  <label key={option.value} className="relative flex items-center">
                    <input
                      type="radio"
                      name="gender"
                      value={option.value}
                      checked={formData.gender === option.value}
                      onChange={handleInputChange}
                      className="peer sr-only"
                    />
                    <div className="px-4 py-2 rounded-full bg-white/50 border border-gray-200 text-gray-600 peer-checked:bg-red-50 peer-checked:border-red-200 peer-checked:text-red-600 transition-colors cursor-pointer">
                      {option.label}
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Name Style</label>
              <div className="flex flex-wrap gap-4">
                {[
                  { value: 'elegant', label: 'Elegant', desc: 'Graceful & Refined' },
                  { value: 'modern', label: 'Modern', desc: 'Contemporary & Fresh' },
                  { value: 'traditional', label: 'Traditional', desc: 'Classic & Meaningful' },
                  { value: 'creative', label: 'Creative', desc: 'Unique & Artistic' }
                ].map((option) => (
                  <label key={option.value} className="relative flex items-center">
                    <input
                      type="radio"
                      name="style"
                      value={option.value}
                      checked={formData.style === option.value}
                      onChange={handleInputChange}
                      className="peer sr-only"
                    />
                    <div className="group px-4 py-2 rounded-full bg-white/50 border border-gray-200 text-gray-600 peer-checked:bg-red-50 peer-checked:border-red-200 peer-checked:text-red-600 transition-colors cursor-pointer">
                      <span>{option.label}</span>
                      <span className="hidden group-hover:block absolute top-full left-1/2 -translate-x-1/2 mt-1 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap">
                        {option.desc}
                      </span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white py-3 px-6 rounded-lg font-medium shadow-lg shadow-red-500/20 disabled:opacity-50 transition-all"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Generating...</span>
                </div>
              ) : (
                <span>{nameResult ? 'Generate New Name' : 'Generate Chinese Name'}</span>
              )}
            </button>
          </form>

          {/* 结果展示 */}
          {nameResult && (
            <div className="mt-8 bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-xl">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-red-600 mb-2">
                  {nameResult.chinese}
                  <button
                    onClick={() => handleCopyClick(nameResult.chinese)}
                    className="ml-2 p-1.5 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                  >
                    {copied ? (
                      <CheckIcon className="h-5 w-5 text-green-500" />
                    ) : (
                      <ClipboardIcon className="h-5 w-5" />
                    )}
                  </button>
                </h2>
                <p className="text-lg text-gray-600">{nameResult.pinyin}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
