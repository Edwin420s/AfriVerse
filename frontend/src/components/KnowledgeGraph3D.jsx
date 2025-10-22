'use client'
import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Expand, Shrink, RotateCcw, Network } from 'lucide-react'

export default function KnowledgeGraph3D({ data, onNodeSelect, className = "" }) {
  const containerRef = useRef(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [selectedNode, setSelectedNode] = useState(null)

  useEffect(() => {
    if (!containerRef.current) return

    const initGraph = async () => {
      try {
        // Quick initialization - no artificial delay
        const container = containerRef.current
        const nodes = data?.nodes || generateSampleNodes()
        
        // Create a simple 3D sphere layout
        create3DSphereLayout(container, nodes)
        
        // Set loading to false immediately
        setIsLoading(false)
      } catch (error) {
        console.error('Error initializing 3D graph:', error)
        setIsLoading(false)
      }
    }

    initGraph()

    return () => {
      // Cleanup
      if (containerRef.current) {
        containerRef.current.innerHTML = ''
      }
    }
  }, [data])

  const generateSampleNodes = () => {
    return [
      { id: 'plant', label: 'Plants', type: 'domain', size: 40, connections: ['medicine', 'culture'] },
      { id: 'medicine', label: 'Medicine', type: 'domain', size: 35, connections: ['plant', 'healing'] },
      { id: 'culture', label: 'Culture', type: 'domain', size: 38, connections: ['plant', 'rituals'] },
      { id: 'healing', label: 'Healing', type: 'concept', size: 25, connections: ['medicine', 'aloe'] },
      { id: 'rituals', label: 'Rituals', type: 'concept', size: 28, connections: ['culture', 'rainmaking'] },
      { id: 'aloe', label: 'Aloe Vera', type: 'plant', size: 20, connections: ['healing'] },
      { id: 'rainmaking', label: 'Rainmaking', type: 'practice', size: 22, connections: ['rituals'] }
    ]
  }

  const create3DSphereLayout = (container, nodes) => {
    container.innerHTML = ''
    
    const sphereRadius = 200
    const centerX = container.clientWidth / 2
    const centerY = container.clientHeight / 2

    nodes.forEach((node, index) => {
      // Calculate position on sphere
      const phi = Math.acos(-1 + (2 * index) / nodes.length)
      const theta = Math.sqrt(nodes.length * Math.PI) * phi
      
      const x = centerX + sphereRadius * Math.cos(theta) * Math.sin(phi)
      const y = centerY + sphereRadius * Math.sin(theta) * Math.sin(phi)
      const z = sphereRadius * Math.cos(phi)

      const nodeElement = document.createElement('div')
      nodeElement.className = `absolute rounded-full cursor-pointer transition-all duration-500 ${
        node.type === 'domain' ? 'bg-primary-cyan' :
        node.type === 'concept' ? 'bg-primary-gold' :
        node.type === 'plant' ? 'bg-green-500' :
        'bg-purple-500'
      }`
      
      nodeElement.style.width = `${node.size}px`
      nodeElement.style.height = `${node.size}px`
      nodeElement.style.left = `${x}px`
      nodeElement.style.top = `${y}px`
      nodeElement.style.transform = `translateZ(${z}px)`
      nodeElement.style.boxShadow = `0 0 20px ${
        node.type === 'domain' ? 'rgba(0, 173, 181, 0.5)' :
        node.type === 'concept' ? 'rgba(255, 211, 105, 0.5)' :
        node.type === 'plant' ? 'rgba(34, 197, 94, 0.5)' :
        'rgba(168, 85, 247, 0.5)'
      }`
      
      nodeElement.innerHTML = `
        <div class="absolute inset-0 rounded-full flex items-center justify-center text-primary-navy font-semibold text-xs">
          ${node.label}
        </div>
      `
      
      nodeElement.addEventListener('click', () => {
        setSelectedNode(node)
        onNodeSelect?.(node)
      })

      container.appendChild(nodeElement)
    })

    // Add connections
    nodes.forEach(node => {
      node.connections?.forEach(connectionId => {
        const targetNode = nodes.find(n => n.id === connectionId)
        if (targetNode) {
          // Draw connection lines (simplified)
          const line = document.createElement('div')
          line.className = 'absolute bg-primary-cyan/30 pointer-events-none'
          line.style.height = '2px'
          container.appendChild(line)
        }
      })
    })

    // Add 3D rotation animation
    container.style.transformStyle = 'preserve-3d'
    container.style.perspective = '1000px'
    
    let rotationX = 0
    let rotationY = 0
    
    const animate = () => {
      rotationX += 0.001
      rotationY += 0.0005
      container.style.transform = `rotateX(${rotationX}rad) rotateY(${rotationY}rad)`
      requestAnimationFrame(animate)
    }
    
    animate()
  }

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  const resetView = () => {
    // Reset graph to initial state
    if (containerRef.current) {
      containerRef.current.innerHTML = ''
      const nodes = data?.nodes || generateSampleNodes()
      create3DSphereLayout(containerRef.current, nodes)
    }
  }

  if (isLoading) {
    return (
      <div className={`bg-primary-navy/30 rounded-xl border border-primary-cyan/20 flex items-center justify-center ${className}`} style={{ height: isFullscreen ? '100vh' : '500px' }}>
        <div className="text-center">
          <div className="spinner w-8 h-8 border-2 border-primary-navy border-t-primary-cyan rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-primary-white/70 text-sm">Loading graph...</p>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`relative bg-primary-navy/30 rounded-xl border border-primary-cyan/20 overflow-hidden ${className} ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none' : ''
      }`}
      style={{ height: isFullscreen ? '100vh' : '500px' }}
    >
      {/* Controls */}
      <div className="absolute top-4 right-4 z-10 flex space-x-2">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={resetView}
          className="p-2 bg-primary-navy/80 backdrop-blur-sm border border-primary-cyan/20 rounded-lg text-primary-cyan hover:bg-primary-cyan/20 transition-colors"
          title="Reset View"
        >
          <RotateCcw className="w-4 h-4" />
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleFullscreen}
          className="p-2 bg-primary-navy/80 backdrop-blur-sm border border-primary-cyan/20 rounded-lg text-primary-cyan hover:bg-primary-cyan/20 transition-colors"
          title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
        >
          {isFullscreen ? <Shrink className="w-4 h-4" /> : <Expand className="w-4 h-4" />}
        </motion.button>
      </div>

      {/* Graph Container */}
      <div
        ref={containerRef}
        className="w-full h-full relative"
        style={{ transformStyle: 'preserve-3d' }}
      />

      {/* Node Info Panel */}
      {selectedNode && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="absolute top-4 left-4 bg-primary-navy/90 backdrop-blur-sm border border-primary-cyan/20 rounded-lg p-4 max-w-xs"
        >
          <h3 className="font-semibold text-primary-white mb-2">
            {selectedNode.label}
          </h3>
          <div className="flex items-center space-x-2 text-sm text-primary-white/70 mb-2">
            <span className="capitalize">{selectedNode.type}</span>
            <span>•</span>
            <span>{selectedNode.size}px</span>
          </div>
          {selectedNode.connections && (
            <div>
              <p className="text-primary-white/70 text-sm mb-1">Connections:</p>
              <div className="flex flex-wrap gap-1">
                {selectedNode.connections.map(conn => (
                  <span
                    key={conn}
                    className="px-2 py-1 bg-primary-cyan/20 text-primary-cyan rounded text-xs"
                  >
                    {conn}
                  </span>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-primary-navy/90 backdrop-blur-sm border border-primary-cyan/20 rounded-lg p-3">
        <h4 className="font-semibold text-primary-white text-sm mb-2">Node Types</h4>
        <div className="space-y-1 text-xs">
          {[
            { color: 'bg-primary-cyan', label: 'Domains' },
            { color: 'bg-primary-gold', label: 'Concepts' },
            { color: 'bg-green-500', label: 'Plants' },
            { color: 'bg-purple-500', label: 'Practices' }
          ].map((item, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
              <span className="text-primary-white/70">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Instructions */}
      <div className="absolute bottom-4 right-4 bg-primary-navy/90 backdrop-blur-sm border border-primary-cyan/20 rounded-lg p-3">
        <p className="text-primary-white/70 text-xs">
          Click nodes to explore • Graph rotates automatically
        </p>
      </div>
    </motion.div>
  )
}