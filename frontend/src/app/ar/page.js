'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Camera, Scan, Cube, Download, Share2, Grid3X3 } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ARViewer from '@/components/ARViewer'

export default function ARPage() {
  const [selectedArtifact, setSelectedArtifact] = useState(null)
  const [viewMode, setViewMode] = useState('gallery')

  const artifacts = [
    {
      id: 'mask-001',
      name: 'Traditional Ceremonial Mask',
      description: 'Wooden ceremonial mask used in initiation rituals by the Kikuyu community. Features intricate carvings representing ancestral spirits.',
      community: 'Kikuyu',
      region: 'East Africa',
      age: 'Pre-20th Century',
      type: 'Ritual Object',
      dimensions: '32cm x 24cm',
      materials: ['Wood', 'Natural Pigments', 'Beads'],
      culturalSignificance: 'High',
      modelQuality: 'High',
      image: '/ar/mask-001.jpg',
      arModel: '/models/mask-001.glb'
    },
    {
      id: 'vessel-002',
      name: 'Ancient Storage Vessel',
      description: 'Clay storage vessel used for preserving grains and liquids. Features traditional geometric patterns and symbols of abundance.',
      community: 'Yoruba',
      region: 'West Africa',
      age: '18th Century',
      type: 'Utilitarian Object',
      dimensions: '45cm x 35cm',
      materials: ['Clay', 'Natural Glaze'],
      culturalSignificance: 'Medium',
      modelQuality: 'Medium',
      image: '/ar/vessel-002.jpg',
      arModel: '/models/vessel-002.glb'
    },
    {
      id: 'tool-003',
      name: 'Traditional Farming Tool',
      description: 'Iron farming tool used for soil preparation and planting. Represents agricultural knowledge and sustainable farming practices.',
      community: 'Maasai',
      region: 'East Africa',
      age: '19th Century',
      type: 'Agricultural Tool',
      dimensions: '60cm x 25cm',
      materials: ['Iron', 'Wood'],
      culturalSignificance: 'High',
      modelQuality: 'High',
      image: '/ar/tool-003.jpg',
      arModel: '/models/tool-003.glb'
    },
    {
      id: 'textile-004',
      name: 'Handwoven Textile',
      description: 'Intricately woven textile featuring traditional patterns and natural dyes. Used in ceremonial clothing and home decor.',
      community: 'Ashanti',
      region: 'West Africa',
      age: 'Early 20th Century',
      type: 'Textile',
      dimensions: '200cm x 150cm',
      materials: ['Cotton', 'Natural Dyes'],
      culturalSignificance: 'Medium',
      modelQuality: 'Medium',
      image: '/ar/textile-004.jpg',
      arModel: '/models/textile-004.glb'
    },
    {
      id: 'instrument-005',
      name: 'Traditional Musical Instrument',
      description: 'String instrument used in traditional music performances and storytelling sessions.',
      community: 'Wolof',
      region: 'West Africa',
      age: '19th Century',
      type: 'Musical Instrument',
      dimensions: '80cm x 30cm',
      materials: ['Wood', 'Animal Skin', 'Strings'],
      culturalSignificance: 'High',
      modelQuality: 'High',
      image: '/ar/instrument-005.jpg',
      arModel: '/models/instrument-005.glb'
    },
    {
      id: 'sculpture-006',
      name: 'Ancestral Sculpture',
      description: 'Wooden sculpture representing ancestral figures, used in spiritual practices and community gatherings.',
      community: 'Bamileke',
      region: 'Central Africa',
      age: 'Pre-20th Century',
      type: 'Sculpture',
      dimensions: '55cm x 20cm',
      materials: ['Wood', 'Beads', 'Shells'],
      culturalSignificance: 'Very High',
      modelQuality: 'High',
      image: '/ar/sculpture-006.jpg',
      arModel: '/models/sculpture-006.glb'
    }
  ]

  const categories = [
    { id: 'all', name: 'All Artifacts', count: artifacts.length },
    { id: 'ritual', name: 'Ritual Objects', count: artifacts.filter(a => a.type.includes('Ritual')).length },
    { id: 'utilitarian', name: 'Utilitarian Objects', count: artifacts.filter(a => a.type.includes('Utilitarian')).length },
    { id: 'tools', name: 'Tools', count: artifacts.filter(a => a.type.includes('Tool')).length },
    { id: 'art', name: 'Art & Textiles', count: artifacts.filter(a => a.type === 'Textile' || a.type === 'Sculpture').length }
  ]

  const getSignificanceColor = (significance) => {
    switch (significance) {
      case 'Very High': return 'bg-red-500/20 text-red-400 border-red-400/20'
      case 'High': return 'bg-orange-500/20 text-orange-400 border-orange-400/20'
      case 'Medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-400/20'
      case 'Low': return 'bg-green-500/20 text-green-400 border-green-400/20'
      default: return 'bg-primary-cyan/20 text-primary-cyan border-primary-cyan/20'
    }
  }

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-cormorant font-bold mb-4">
              Augmented <span className="gradient-text">Reality</span>
            </h1>
            <p className="text-xl text-primary-white/70 max-w-2xl mx-auto">
              Experience cultural artifacts in your environment through augmented reality. 
              Explore detailed 3D models with historical and cultural context.
            </p>
          </motion.div>

          {selectedArtifact ? (
            // AR View
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setSelectedArtifact(null)}
                  className="flex items-center space-x-2 text-primary-cyan hover:text-primary-cyan/80 transition-colors"
                >
                  <span>← Back to Gallery</span>
                </button>
                
                <div className="flex items-center space-x-4">
                  <div className={`px-3 py-1 rounded-full border ${getSignificanceColor(selectedArtifact.culturalSignificance)}`}>
                    {selectedArtifact.culturalSignificance} Cultural Significance
                  </div>
                </div>
              </div>

              <ARViewer artifact={selectedArtifact} className="w-full" />
            </motion.div>
          ) : (
            // Artifacts Gallery
            <>
              {/* Categories */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-8"
              >
                <div className="flex flex-wrap gap-2 justify-center">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setViewMode(category.id)}
                      className={`px-4 py-2 rounded-lg transition-all ${
                        viewMode === category.id
                          ? 'gold-gradient text-primary-navy'
                          : 'bg-primary-navy/50 text-primary-white/70 hover:text-primary-white'
                      }`}
                    >
                      {category.name} ({category.count})
                    </button>
                  ))}
                </div>
              </motion.div>

              {/* Artifacts Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {artifacts.map((artifact, index) => (
                  <motion.div
                    key={artifact.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-primary-navy/30 rounded-xl border border-primary-cyan/20 hover:border-primary-cyan/40 transition-all overflow-hidden group cursor-pointer"
                    onClick={() => setSelectedArtifact(artifact)}
                  >
                    {/* Artifact Image */}
                    <div className="h-48 bg-gradient-to-br from-primary-cyan/20 to-primary-gold/20 flex items-center justify-center relative overflow-hidden">
                      <Cube className="w-16 h-16 text-primary-cyan/50" />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                      
                      {/* Model Quality Badge */}
                      <div className="absolute top-4 right-4 bg-primary-navy/80 backdrop-blur-sm border border-primary-cyan/20 rounded-full px-3 py-1 text-xs text-primary-cyan">
                        {artifact.modelQuality} Quality
                      </div>
                    </div>

                    {/* Artifact Info */}
                    <div className="p-6">
                      <h3 className="text-xl font-cormorant font-bold text-primary-white mb-2 group-hover:text-primary-cyan transition-colors">
                        {artifact.name}
                      </h3>
                      
                      <p className="text-primary-white/70 text-sm mb-4 line-clamp-2">
                        {artifact.description}
                      </p>

                      <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-primary-white/70">Community:</span>
                          <span className="text-primary-cyan">{artifact.community}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-primary-white/70">Region:</span>
                          <span className="text-primary-gold">{artifact.region}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-primary-white/70">Age:</span>
                          <span className="text-green-400">{artifact.age}</span>
                        </div>
                      </div>

                      {/* Materials */}
                      <div className="mt-4">
                        <div className="text-xs text-primary-white/50 mb-2">Materials</div>
                        <div className="flex flex-wrap gap-1">
                          {artifact.materials.map((material, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 bg-primary-navy/50 border border-primary-cyan/20 text-primary-cyan rounded text-xs"
                            >
                              {material}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="p-4 border-t border-primary-cyan/20">
                      <button className="w-full flex items-center justify-center space-x-2 gold-gradient text-primary-navy py-2 px-4 rounded-lg font-semibold hover:shadow-lg transition-all">
                        <Camera className="w-4 h-4" />
                        <span>View in AR</span>
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* AR Instructions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="mt-12 bg-primary-navy/30 rounded-xl border border-primary-cyan/20 p-8"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="text-center">
                    <div className="gold-gradient w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Scan className="w-8 h-8 text-primary-navy" />
                    </div>
                    <h3 className="font-semibold text-primary-white mb-2">Scan Your Environment</h3>
                    <p className="text-primary-white/70 text-sm">
                      Find a flat, well-lit surface to place artifacts for the best AR experience
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <div className="cyan-gradient w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Grid3X3 className="w-8 h-8 text-primary-navy" />
                    </div>
                    <h3 className="font-semibold text-primary-white mb-2">Interactive Exploration</h3>
                    <p className="text-primary-white/70 text-sm">
                      Move around artifacts, zoom in on details, and view from different angles
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <div className="bg-gradient-to-br from-green-400 to-blue-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Share2 className="w-8 h-8 text-primary-navy" />
                    </div>
                    <h3 className="font-semibold text-primary-white mb-2">Share & Capture</h3>
                    <p className="text-primary-white/70 text-sm">
                      Take photos of artifacts in your space and share the cultural experience
                    </p>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}