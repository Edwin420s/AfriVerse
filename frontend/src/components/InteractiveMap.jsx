'use client'
import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Users, Book, Search, Filter, ZoomIn, ZoomOut } from 'lucide-react'

export default function InteractiveMap({ onRegionSelect, className = "" }) {
  const [selectedRegion, setSelectedRegion] = useState(null)
  const [zoom, setZoom] = useState(1)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [searchQuery, setSearchQuery] = useState('')
  const mapRef = useRef(null)

  const africanRegions = [
    {
      id: 'west',
      name: 'West Africa',
      position: { x: 35, y: 45 },
      countries: ['Nigeria', 'Ghana', 'Senegal', 'Ivory Coast', 'Mali'],
      knowledgeCount: 1247,
      communities: ['Yoruba', 'Hausa', 'Igbo', 'Akan', 'Mande'],
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'east',
      name: 'East Africa',
      position: { x: 65, y: 50 },
      countries: ['Kenya', 'Tanzania', 'Ethiopia', 'Uganda', 'Rwanda'],
      knowledgeCount: 892,
      communities: ['Swahili', 'Kikuyu', 'Luo', 'Maasai', 'Oromo'],
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 'south',
      name: 'Southern Africa',
      position: { x: 55, y: 80 },
      countries: ['South Africa', 'Zimbabwe', 'Zambia', 'Botswana', 'Namibia'],
      knowledgeCount: 756,
      communities: ['Zulu', 'Xhosa', 'Shona', 'Sotho', 'Tswana'],
      color: 'from-orange-500 to-red-500'
    },
    {
      id: 'central',
      name: 'Central Africa',
      position: { x: 50, y: 60 },
      countries: ['DRC', 'Congo', 'Angola', 'Cameroon', 'Gabon'],
      knowledgeCount: 543,
      communities: ['Kongo', 'Luba', 'Fang', 'Bantu', 'Pygmy'],
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 'north',
      name: 'North Africa',
      position: { x: 50, y: 25 },
      countries: ['Egypt', 'Morocco', 'Algeria', 'Tunisia', 'Sudan'],
      knowledgeCount: 678,
      communities: ['Arab', 'Berber', 'Nubian', 'Tuareg', 'Coptic'],
      color: 'from-yellow-500 to-amber-500'
    }
  ]

  const handleRegionClick = (region) => {
    setSelectedRegion(region)
    onRegionSelect?.(region)
  }

  const handleMouseDown = (e) => {
    setIsDragging(true)
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    })
  }

  const handleMouseMove = (e) => {
    if (!isDragging) return
    
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleWheel = (e) => {
    e.preventDefault()
    const newZoom = Math.max(0.5, Math.min(3, zoom + (e.deltaY > 0 ? -0.1 : 0.1)))
    setZoom(newZoom)
  }

  const resetView = () => {
    setPosition({ x: 0, y: 0 })
    setZoom(1)
  }

  const filteredRegions = africanRegions.filter(region =>
    region.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    region.communities.some(community => 
      community.toLowerCase().includes(searchQuery.toLowerCase())
    )
  )

  return (
    <div className={`bg-primary-navy/30 rounded-xl border border-primary-cyan/20 overflow-hidden ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-primary-cyan/20">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-cormorant font-bold text-primary-white mb-2">
              Cultural Knowledge Map
            </h2>
            <p className="text-primary-white/70">
              Explore indigenous knowledge across African regions
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={resetView}
              className="px-3 py-2 border border-primary-cyan/20 text-primary-cyan rounded-lg hover:bg-primary-cyan/10 transition-colors text-sm"
            >
              Reset View
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-white/50 w-4 h-4" />
          <input
            type="text"
            placeholder="Search regions or communities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-primary-navy/50 border border-primary-cyan/20 rounded-lg text-primary-white placeholder-primary-white/50 focus:outline-none focus:border-primary-cyan"
          />
        </div>
      </div>

      <div className="flex">
        {/* Map Container */}
        <div 
          ref={mapRef}
          className="flex-1 relative overflow-hidden bg-gradient-to-br from-primary-navy to-primary-cyan/10"
          style={{ height: '500px', cursor: isDragging ? 'grabbing' : 'grab' }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
        >
          {/* African Continent Outline */}
          <div className="absolute inset-0 opacity-20">
            {/* Simplified Africa outline - in real app, use SVG */}
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-6xl">🌍</div>
            </div>
          </div>

          {/* Regions */}
          {filteredRegions.map(region => (
            <motion.button
              key={region.id}
              initial={false}
              animate={{
                x: position.x + (region.position.x * zoom),
                y: position.y + (region.position.y * zoom),
                scale: zoom
              }}
              whileHover={{ scale: zoom * 1.1 }}
              onClick={() => handleRegionClick(region)}
              className={`absolute w-16 h-16 rounded-full bg-gradient-to-r ${region.color} border-2 border-white shadow-lg flex items-center justify-center text-white font-semibold text-xs transform -translate-x-1/2 -translate-y-1/2 ${
                selectedRegion?.id === region.id ? 'ring-4 ring-primary-cyan ring-opacity-50' : ''
              }`}
              style={{
                left: `${region.position.x}%`,
                top: `${region.position.y}%`
              }}
            >
              <MapPin className="w-6 h-6" />
            </motion.button>
          ))}

          {/* Zoom Controls */}
          <div className="absolute bottom-4 right-4 flex flex-col space-y-2">
            <button
              onClick={() => setZoom(prev => Math.min(3, prev + 0.2))}
              className="p-2 bg-primary-navy/80 backdrop-blur-sm border border-primary-cyan/20 rounded-lg text-primary-cyan hover:bg-primary-cyan/20 transition-colors"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => setZoom(prev => Math.max(0.5, prev - 0.2))}
              className="p-2 bg-primary-navy/80 backdrop-blur-sm border border-primary-cyan/20 rounded-lg text-primary-cyan hover:bg-primary-cyan/20 transition-colors"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
          </div>

          {/* Instructions */}
          <div className="absolute bottom-4 left-4 bg-primary-navy/80 backdrop-blur-sm border border-primary-cyan/20 rounded-lg p-3">
            <p className="text-primary-white/70 text-xs">
              Drag to move • Scroll to zoom • Click regions
            </p>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-80 border-l border-primary-cyan/20">
          {selectedRegion ? (
            <div className="p-6">
              <h3 className="text-xl font-cormorant font-bold text-primary-white mb-4">
                {selectedRegion.name}
              </h3>

              <div className="space-y-4">
                {/* Knowledge Count */}
                <div className="flex items-center justify-between p-3 bg-primary-navy/50 rounded-lg border border-primary-cyan/20">
                  <div className="flex items-center space-x-2">
                    <Book className="w-4 h-4 text-primary-cyan" />
                    <span className="text-primary-white/70">Knowledge Entries</span>
                  </div>
                  <span className="text-primary-cyan font-semibold">
                    {selectedRegion.knowledgeCount}
                  </span>
                </div>

                {/* Countries */}
                <div>
                  <h4 className="font-semibold text-primary-white mb-2">Countries</h4>
                  <div className="flex flex-wrap gap-1">
                    {selectedRegion.countries.map(country => (
                      <span
                        key={country}
                        className="px-2 py-1 bg-primary-cyan/20 text-primary-cyan rounded text-xs"
                      >
                        {country}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Communities */}
                <div>
                  <h4 className="font-semibold text-primary-white mb-2">Communities</h4>
                  <div className="flex flex-wrap gap-1">
                    {selectedRegion.communities.map(community => (
                      <span
                        key={community}
                        className="px-2 py-1 bg-primary-gold/20 text-primary-gold rounded text-xs"
                      >
                        {community}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-4 border-t border-primary-cyan/20">
                  <button className="w-full gold-gradient text-primary-navy py-2 px-4 rounded-lg font-semibold hover:shadow-lg transition-all">
                    Explore Knowledge
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 text-center">
              <MapPin className="w-12 h-12 text-primary-white/30 mx-auto mb-4" />
              <p className="text-primary-white/70">
                Select a region to explore cultural knowledge
              </p>
            </div>
          )}

          {/* Regions List */}
          <div className="border-t border-primary-cyan/20 p-6">
            <h4 className="font-semibold text-primary-white mb-3">All Regions</h4>
            <div className="space-y-2">
              {africanRegions.map(region => (
                <button
                  key={region.id}
                  onClick={() => handleRegionClick(region)}
                  className={`w-full text-left p-3 rounded-lg border transition-all ${
                    selectedRegion?.id === region.id
                      ? 'border-primary-cyan bg-primary-cyan/10'
                      : 'border-primary-cyan/20 hover:border-primary-cyan/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-primary-white">
                      {region.name}
                    </span>
                    <span className="text-primary-cyan text-sm">
                      {region.knowledgeCount}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-primary-white/50">
                    <Users className="w-3 h-3" />
                    <span>{region.communities.length} communities</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}