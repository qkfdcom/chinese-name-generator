'use client'
import { useState, useEffect } from 'react'
import { generateNameWithHunyuan } from '@/services/hunyuanService'
import { generateChineseName } from '@/utils/nameGenerator'
import { 
  ClipboardIcon, 
  CheckIcon, 
  HeartIcon, 
  SparklesIcon, 
  ShareIcon,
  StarIcon 
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid'
import Background from '@/components/Background'
import Navbar from '@/components/Navbar'
import NameForm from '@/components/NameForm'
import Stats from '@/components/Stats'

export default function Home() {
  const [hasGenerated, setHasGenerated] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    gender: 'female', // 默认选择女性
    style: 'elegant'  // 默认选择优雅
  })

  const [nameResult, setNameResult] = useState<{
    chinese: string;
    pinyin: string;
    onlineName: string;
  } | null>(null)

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [isExplaining, setIsExplaining] = useState(false)
  const [explanation, setExplanation] = useState<string | null>(null)
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
    // 从 localStorage 读取点赞状态
    const hasLiked = localStorage.getItem('yiboss_liked') === 'true'
    setLiked(hasLiked)

    // 设置一个基础点赞数（这个数字应该从后端获取，这里模拟一个相对合理的数字）
    const baseCount = 12876
    const dailyVariation = Math.floor(Math.random() * 50) // 每天随机增加0-50个赞
    setLikeCount(baseCount + dailyVariation)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

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

  const handleExplainClick = async () => {
    if (!nameResult || isExplaining) return;
    
    setIsExplaining(true);
    setError(null);
    
    try {
      console.log('Sending request for:', nameResult.chinese);
      const response = await fetch('/api/explain-name', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chinese: nameResult.chinese,
          pinyin: nameResult.pinyin
        })
      });

      const data = await response.json();
      console.log('Received response:', data);
      
      if (!response.ok || data.error) {
        const errorMessage = data.error || `HTTP error! status: ${response.status}`;
        console.error('API Error:', errorMessage);
        if (data.details) {
          console.error('Error details:', data.details);
        }
        throw new Error(errorMessage);
      }

      if (!data.explanation) {
        console.error('Missing explanation in response:', data);
        throw new Error('No explanation received');
      }

      setExplanation(data.explanation);
    } catch (err) {
      console.error('Failed to get explanation:', err);
      setError(err instanceof Error ? err.message : 'Failed to get explanation');
      setExplanation(null);
    } finally {
      setIsExplaining(false);
    }
  };

  // 输入验证函数
  const validateInput = (value: string) => {
    return /^[a-zA-Z\s-]*$/.test(value) // 只允许英文字母、空格和连字符
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    if (validateInput(value)) {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleShare = async (platform: 'tiktok' | 'xiaohongshu' | 'twitter') => {
    const shareText = `Check out my Chinese name: ${nameResult?.chinese} (${nameResult?.pinyin}) 
Get your Chinese name at: ${window.location.origin}`
    
    const shareUrls = {
      tiktok: `https://www.tiktok.com/share?text=${encodeURIComponent(shareText)}`,
      xiaohongshu: `https://www.xiaohongshu.com/share?text=${encodeURIComponent(shareText)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`
    }

    window.open(shareUrls[platform], '_blank')
  }

  const handleLike = () => {
    if (isLikeAnimating) return // 防止动画过程中重复点击

    setIsLikeAnimating(true)
    setLiked(!liked)
    setLikeCount(prev => liked ? prev - 1 : prev + 1)
    
    // 存储点赞状态
    localStorage.setItem('yiboss_liked', (!liked).toString())

    // 动画结束后重置状态
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
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
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

        {/* 表单和结果区域 */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* 表单部分 */}
          <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-xl shadow-red-500/5 border border-red-100/20 p-6">
            <NameForm 
              formData={formData}
              isLoading={isLoading}
              hasGenerated={hasGenerated}
              onChange={handleInputChange}
              onSubmit={handleSubmit}
            />
          </div>

          {/* 结果展示部分 */}
          {nameResult ? (
            <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-xl shadow-red-500/5 border border-red-100/20 p-6 space-y-6">
              {/* 中文名字部分 */}
              <div className="text-center">
                <div className="inline-block">
                  <h3 className="text-4xl md:text-5xl font-bold text-red-600 mb-2">
                    {nameResult.chinese}
                    <button
                      onClick={() => handleCopyClick(nameResult.chinese)}
                      className="ml-2 align-middle p-1.5 text-gray-400 hover:text-gray-600 inline-flex items-center rounded-full hover:bg-gray-100"
                      title="Copy name"
                    >
                      {copied ? (
                        <CheckIcon className="h-5 w-5 text-green-500" />
                      ) : (
                        <ClipboardIcon className="h-5 w-5" />
                      )}
                    </button>
                  </h3>
                  <p className="text-lg text-gray-600">{nameResult.pinyin}</p>
                </div>
              </div>

              {/* 网名部分 */}
              <div className="bg-gradient-to-r from-pink-50 to-red-50 rounded-xl p-6">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-medium text-gray-700">
                    Social Media Name
                  </h4>
                  <button
                    onClick={() => handleCopyClick(nameResult.onlineName)}
                    className="px-3 py-1.5 bg-white text-red-500 rounded-full hover:bg-red-50 transition-colors text-sm font-medium shadow-sm"
                  >
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <p className="text-xl text-center font-medium text-gray-800 mb-2">
                  {nameResult.onlineName}
                </p>
                <p className="text-sm text-gray-500 text-center">
                  Perfect for your presence on Chinese social media platforms
                </p>
              </div>

              {/* 分享链接部分 */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-medium text-gray-700">
                    Share Your Name
                  </h4>
                  <button
                    onClick={() => handleCopyClick(`${window.location.origin}?name=${encodeURIComponent(nameResult.chinese)}`)}
                    className="px-3 py-1.5 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full hover:from-red-600 hover:to-pink-600 transition-colors text-sm font-medium shadow-sm"
                  >
                    {copied ? 'Copied!' : 'Copy Link'}
                  </button>
                </div>
                <p className="text-sm text-gray-500 text-center">
                  Share your new Chinese name with friends!
                </p>
              </div>
            </div>
          ) : (
            <div className="hidden md:flex items-center justify-center">
              <div className="text-center text-gray-400">
                <SparklesIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Your Chinese name will appear here</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 底部信息 */}
      <footer className="mt-auto py-6 bg-white/70 backdrop-blur-md border-t border-gray-100">
        <div className="max-w-5xl mx-auto px-4 flex justify-between items-center text-sm text-gray-500">
          <span>© 2024 Yiboss.com - Bridging Cultural Connections</span>
          <div className="flex items-center gap-2">
            <span>Made with</span>
            <HeartIcon className="h-4 w-4 text-red-500" />
          </div>
        </div>
      </footer>
    </main>
  )
}
