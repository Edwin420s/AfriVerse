'use client'
import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Filter, X, Clock, Users, Book } from 'lucide-react'

export default function SearchBar({ onSearch, placeholder = "Search wisdom, plants, stories, practices...", className = "" }) {
  const [query, setQuery] = useState('')
  const [isExpanded, setIsExpanded] = useState(false)
  const [filters, setFilters] = useState({
    type: '',
    community: '',
    language: '',
    status: ''
  })
  const inputRef = useRef(null)

  const contentTypes = [
    { id: 'story', name: 'Stories', icon: <Book className="w-4 h-4" /> },
    { id: 'medicine', name: 'Medicine', icon: <Users className="w-4 h-4" /> },
    { id: 'practice', name: 'Practices', icon: <Clock className="w-4 h-4" /> }
  ]

  const communities = ['Kikuyu', 'Luo', 'Yoruba', 'Maasai', 'Zulu', 'Multiple']
  const languages = ['Swahili', 'English', 'Kikuyu', 'Luo', 'Yoruba', 'Other']

  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isExpanded])

  const handleSearch = (newQuery = query, newFilters = filters) => {
    onSearch?.({
      query: newQuery,
      filters: newFilters
    })
  }

  const clearFilters = () => {
    setFilters({
      type: '',
      community: '',
      language: '',
      status: ''
    })
    handleSearch(query, {
      type: '',
      community: '',
      language: '',
      status: ''
    })
  }

  const hasActiveFilters = Object.values(filters).some(value => value !== '')

  return (
    <div className={`relative ${className}`}>
      {/* Main Search Bar */}
      <div className="flex items-center space-x-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-white/50 w-5 h-5" />
          <input
            ref={inputRef}
            type="text"
            placeholder={placeholder}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              handleSearch(e.target.value, filters)
            }}
            onFocus={() => setIsExpanded(true)}
            className="w-full pl-10 pr-4 py-3 bg-primary-navy/50 border border-primary-cyan/20 rounded-lg text-primary-white placeholder-primary-white/50 focus:outline-none focus:border-primary-cyan transition-colors"
          />
          
          {query && (
            <button
              onClick={() => {
                setQuery('')
                handleSearch('', filters)
              }}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-primary-white/50 hover:text-primary-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsExpanded(!isExpanded)}
          className={`p-3 rounded-lg border transition-all ${
            hasActiveFilters
              ? 'gold-gradient text-primary-navy border-transparent'
              : 'bg-primary-navy/50 text-primary-white/70 border-primary-cyan/20 hover:border-primary-cyan/40'
          }`}
        >
          <Filter className="w-5 h-5" />
        </motion.button>
      </div>

      {/* Expanded Filters */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="absolute top-full left-0 right-0 mt-2 bg-primary-navy/95 backdrop-blur-md border border-primary-cyan/20 rounded-lg p-4 z-50 shadow-xl"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Content Type Filter */}
              <div>
                <label className="block text-sm font-medium text-primary-white mb-2">
                  Content Type
                </label>
                <select
                  value={filters.type}
                  onChange={(e) => {
                    const newFilters = { ...filters, type: e.target.value }
                    setFilters(newFilters)
                    handleSearch(query, newFilters)
                  }}
                  className="w-full p-2 bg-primary-navy/50 border border-primary-cyan/20 rounded text-primary-white text-sm focus:outline-none focus:border-primary-cyan"
                >
                  <option value="">All Types</option>
                  {contentTypes.map(type => (
                    <option key={type.id} value={type.id}>{type.name}</option>
                  ))}
                </select>
              </div>

              {/* Community Filter */}
              <div>
                <label className="block text-sm font-medium text-primary-white mb-2">
                  Community
                </label>
                <select
                  value={filters.community}
                  onChange={(e) => {
                    const newFilters = { ...filters, community: e.target.value }
                    setFilters(newFilters)
                    handleSearch(query, newFilters)
                  }}
                  className="w-full p-2 bg-primary-navy/50 border border-primary-cyan/20 rounded text-primary-white text-sm focus:outline-none focus:border-primary-cyan"
                >
                  <option value="">All Communities</option>
                  {communities.map(community => (
                    <option key={community} value={community}>{community}</option>
                  ))}
                </select>
              </div>

              {/* Language Filter */}
              <div>
                <label className="block text-sm font-medium text-primary-white mb-2">
                  Language
                </label>
                <select
                  value={filters.language}
                  onChange={(e) => {
                    const newFilters = { ...filters, language: e.target.value }
                    setFilters(newFilters)
                    handleSearch(query, newFilters)
                  }}
                  className="w-full p-2 bg-primary-navy/50 border border-primary-cyan/20 rounded text-primary-white text-sm focus:outline-none focus:border-primary-cyan"
                >
                  <option value="">All Languages</option>
                  {languages.map(language => (
                    <option key={language} value={language}>{language}</option>
                  ))}
                </select>
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-primary-white mb-2">
                  Status
                </label>
                <select
                  value={filters.status}
                  onChange={(e) => {
                    const newFilters = { ...filters, status: e.target.value }
                    setFilters(newFilters)
                    handleSearch(query, newFilters)
                  }}
                  className="w-full p-2 bg-primary-navy/50 border border-primary-cyan/20 rounded text-primary-white text-sm focus:outline-none focus:border-primary-cyan"
                >
                  <option value="">All Status</option>
                  <option value="validated">Validated</option>
                  <option value="pending">Pending</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
            </div>

            {/* Active Filters & Clear */}
            {hasActiveFilters && (
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-primary-cyan/20">
                <div className="flex items-center space-x-2 text-sm">
                  <span className="text-primary-white/70">Active filters:</span>
                  {Object.entries(filters).map(([key, value]) => 
                    value && (
                      <span
                        key={key}
                        className="px-2 py-1 bg-primary-cyan/20 text-primary-cyan rounded text-xs"
                      >
                        {key}: {value}
                      </span>
                    )
                  )}
                </div>
                <button
                  onClick={clearFilters}
                  className="text-primary-white/70 hover:text-primary-white text-sm transition-colors"
                >
                  Clear all
                </button>
              </div>
            )}

            {/* Quick Search Suggestions */}
            <div className="mt-4 pt-4 border-t border-primary-cyan/20">
              <h4 className="text-sm font-medium text-primary-white mb-2">
                Quick Searches
              </h4>
              <div className="flex flex-wrap gap-2">
                {[
                  'Medicinal plants',
                  'Rainmaking rituals',
                  'Kikuyu proverbs',
                  'Traditional healing',
                  'Oral histories'
                ].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => {
                      setQuery(suggestion)
                      handleSearch(suggestion, filters)
                    }}
                    className="px-3 py-1 bg-primary-navy/50 text-primary-white/70 hover:text-primary-cyan rounded-full text-xs transition-colors border border-primary-cyan/20 hover:border-primary-cyan/40"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Click outside to close */}
      {isExpanded && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsExpanded(false)}
        />
      )}
    </div>
  )
}