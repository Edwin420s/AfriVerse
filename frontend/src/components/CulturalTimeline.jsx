'use client'
import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Calendar, MapPin, Users, Book } from 'lucide-react'

export default function CulturalTimeline({ events, className = "" }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [autoPlay, setAutoPlay] = useState(true)
  const timelineRef = useRef(null)

  const sampleEvents = [
    {
      id: 1,
      year: 'Pre-1500',
      title: 'Oral Tradition Era',
      description: 'Indigenous knowledge primarily preserved through oral storytelling, rituals, and community practices across African civilizations.',
      region: 'Pan-African',
      category: 'tradition',
      significance: 'high',
      image: '/timeline/oral-tradition.jpg'
    },
    {
      id: 2,
      year: '1500-1800',
      title: 'Colonial Disruption',
      description: 'European colonization begins systematic suppression of indigenous knowledge systems and cultural practices.',
      region: 'Multiple Regions',
      category: 'historical',
      significance: 'critical',
      image: '/timeline/colonial-era.jpg'
    },
    {
      id: 3,
      year: '1900-1950',
      title: 'Early Documentation',
      description: 'First systematic attempts by anthropologists and local scholars to document endangered cultural knowledge.',
      region: 'West & East Africa',
      category: 'documentation',
      significance: 'medium',
      image: '/timeline/early-docs.jpg'
    },
    {
      id: 4,
      year: '1960-2000',
      title: 'Independence Movements',
      description: 'Post-independence cultural revival movements and establishment of national cultural archives.',
      region: 'Multiple Regions',
      category: 'revival',
      significance: 'high',
      image: '/timeline/independence.jpg'
    },
    {
      id: 5,
      year: '2000-2020',
      title: 'Digital Preservation',
      description: 'Early digital archives and online platforms begin preserving cultural knowledge in multimedia formats.',
      region: 'Global',
      category: 'digital',
      significance: 'medium',
      image: '/timeline/digital-era.jpg'
    },
    {
      id: 6,
      year: '2020-Present',
      title: 'AGI Integration',
      description: 'Artificial General Intelligence systems like AfriVerse begin symbolic reasoning and neural-symbolic integration of cultural knowledge.',
      region: 'Global',
      category: 'innovation',
      significance: 'critical',
      image: '/timeline/agi-era.jpg'
    }
  ]

  const displayEvents = events || sampleEvents

  useEffect(() => {
    if (!autoPlay) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % displayEvents.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [autoPlay, displayEvents.length])

  const nextEvent = () => {
    setCurrentIndex((prev) => (prev + 1) % displayEvents.length)
    setAutoPlay(false)
  }

  const prevEvent = () => {
    setCurrentIndex((prev) => (prev - 1 + displayEvents.length) % displayEvents.length)
    setAutoPlay(false)
  }

  const goToEvent = (index) => {
    setCurrentIndex(index)
    setAutoPlay(false)
  }

  const getSignificanceColor = (significance) => {
    switch (significance) {
      case 'critical': return 'bg-red-500/20 text-red-400 border-red-400/20'
      case 'high': return 'bg-orange-500/20 text-orange-400 border-orange-400/20'
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-400/20'
      case 'low': return 'bg-green-500/20 text-green-400 border-green-400/20'
      default: return 'bg-primary-cyan/20 text-primary-cyan border-primary-cyan/20'
    }
  }

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'tradition': return <Users className="w-4 h-4" />
      case 'historical': return <Calendar className="w-4 h-4" />
      case 'documentation': return <Book className="w-4 h-4" />
      case 'revival': return <Users className="w-4 h-4" />
      case 'digital': return <Book className="w-4 h-4" />
      case 'innovation': return <MapPin className="w-4 h-4" />
      default: return <Calendar className="w-4 h-4" />
    }
  }

  return (
    <div className={`bg-primary-navy/30 rounded-xl border border-primary-cyan/20 overflow-hidden ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-primary-cyan/20">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-cormorant font-bold text-primary-white mb-2">
              Cultural Knowledge Timeline
            </h2>
            <p className="text-primary-white/70">
              Journey through the evolution of African indigenous knowledge preservation
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setAutoPlay(!autoPlay)}
              className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                autoPlay 
                  ? 'bg-primary-cyan/20 text-primary-cyan border border-primary-cyan/20' 
                  : 'bg-primary-navy/50 text-primary-white/70 border border-primary-cyan/20'
              }`}
            >
              {autoPlay ? 'Pause' : 'Play'} Auto
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {/* Current Event Display */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Event Image */}
              <div className="bg-primary-navy/50 rounded-lg border border-primary-cyan/20 p-4 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl font-cormorant font-bold gradient-text mb-4">
                    {displayEvents[currentIndex].year}
                  </div>
                  <div className="w-32 h-32 mx-auto bg-gradient-to-br from-primary-cyan to-primary-gold rounded-full flex items-center justify-center text-primary-navy text-xl font-bold">
                    Era
                  </div>
                </div>
              </div>

              {/* Event Details */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-cormorant font-bold text-primary-white">
                    {displayEvents[currentIndex].title}
                  </h3>
                  <div className={`flex items-center space-x-2 px-3 py-1 rounded-full border text-sm ${getSignificanceColor(displayEvents[currentIndex].significance)}`}>
                    {getCategoryIcon(displayEvents[currentIndex].category)}
                    <span className="capitalize">{displayEvents[currentIndex].significance}</span>
                  </div>
                </div>

                <p className="text-primary-white/70 leading-relaxed">
                  {displayEvents[currentIndex].description}
                </p>

                <div className="flex items-center space-x-4 text-sm text-primary-white/50">
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>{displayEvents[currentIndex].region}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4" />
                    <span className="capitalize">{displayEvents[currentIndex].category}</span>
                  </div>
                </div>

                {/* Progress Indicators */}
                <div className="pt-4">
                  <div className="flex justify-between items-center text-xs text-primary-white/50 mb-2">
                    <span>Timeline Progress</span>
                    <span>{currentIndex + 1} of {displayEvents.length}</span>
                  </div>
                  <div className="w-full bg-primary-navy/50 rounded-full h-2">
                    <div 
                      className="bg-primary-cyan rounded-full h-2 transition-all duration-500"
                      style={{ width: `${((currentIndex + 1) / displayEvents.length) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={prevEvent}
            className="flex items-center space-x-2 px-4 py-2 border border-primary-cyan/20 text-primary-cyan rounded-lg hover:bg-primary-cyan/10 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          {/* Timeline Dots */}
          <div className="flex items-center space-x-2">
            {displayEvents.map((event, index) => (
              <button
                key={event.id}
                onClick={() => goToEvent(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentIndex
                    ? 'bg-primary-cyan scale-125'
                    : index < currentIndex
                    ? 'bg-primary-cyan/50'
                    : 'bg-primary-white/20'
                }`}
              />
            ))}
          </div>

          <button
            onClick={nextEvent}
            className="flex items-center space-x-2 px-4 py-2 border border-primary-cyan/20 text-primary-cyan rounded-lg hover:bg-primary-cyan/10 transition-colors"
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Timeline Overview */}
      <div className="p-6 border-t border-primary-cyan/20">
        <h4 className="font-semibold text-primary-white mb-4">Timeline Overview</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {displayEvents.map((event, index) => (
            <button
              key={event.id}
              onClick={() => goToEvent(index)}
              className={`text-center p-3 rounded-lg border transition-all ${
                index === currentIndex
                  ? 'border-primary-cyan bg-primary-cyan/10'
                  : 'border-primary-cyan/20 hover:border-primary-cyan/40'
              }`}
            >
              <div className="text-lg font-cormorant font-bold text-primary-white mb-1">
                {event.year}
              </div>
              <div className="text-xs text-primary-white/70 line-clamp-2">
                {event.title}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}