interface NameFormProps {
  formData: {
    firstName: string
    lastName: string
    gender: string
    style: string
  }
  isLoading: boolean
  hasGenerated: boolean
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onSubmit: (e: React.FormEvent) => void
}

export default function NameForm({ formData, isLoading, hasGenerated, onChange, onSubmit }: NameFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">First Name</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={onChange}
            className="mt-1 w-full px-4 py-2 bg-white/50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
            placeholder="Enter your first name"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Last Name</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={onChange}
            className="mt-1 w-full px-4 py-2 bg-white/50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
            placeholder="Enter your last name"
            required
          />
        </div>
      </div>

      <div className="space-y-4">
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
                  onChange={onChange}
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
              { value: 'elegant', label: 'Elegant' },
              { value: 'modern', label: 'Modern' },
              { value: 'traditional', label: 'Traditional' },
              { value: 'creative', label: 'Creative' }
            ].map((option) => (
              <label key={option.value} className="relative flex items-center">
                <input
                  type="radio"
                  name="style"
                  value={option.value}
                  checked={formData.style === option.value}
                  onChange={onChange}
                  className="peer sr-only"
                />
                <div className="px-4 py-2 rounded-full bg-white/50 border border-gray-200 text-gray-600 peer-checked:bg-red-50 peer-checked:border-red-200 peer-checked:text-red-600 transition-colors cursor-pointer">
                  {option.label}
                </div>
              </label>
            ))}
          </div>
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
          <span>{hasGenerated ? 'Generate New Name' : 'Generate Chinese Name'}</span>
        )}
      </button>
    </form>
  )
} 