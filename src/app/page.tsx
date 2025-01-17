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

  // ... 其余 JSX 部分保持不变 ...
}
