'use client'
import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function NodeGraph() {
  const canvasRef = useRef(null)
  const [selectedNode, setSelectedNode] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    
    const setCanvasSize = () => {
      const dpr = window.devicePixelRatio || 1
      const rect = canvas.getBoundingClientRect()
      
      canvas.width = rect.width * dpr
      canvas.height = 280 * dpr
      canvas.style.width = `${rect.width}px`
      canvas.style.height = '280px'
      
      ctx.scale(dpr, dpr)
    }

    setCanvasSize()
    setIsLoading(false)

    // Centered knowledge graph data - Dynamic positioning
    const canvasWidth = canvas.getBoundingClientRect().width
    const centerX = canvasWidth / 2
    const centerY = 140
    
    const nodes = [
      { 
        id: 1, 
        x: centerX - 180, 
        y: centerY, 
        label: 'Aloe Vera', 
        type: 'plant', 
        connections: [2, 3],
        description: 'Medicinal plant known as "mwarubaini"',
        community: 'Kikuyu'
      },
      { 
        id: 2, 
        x: centerX - 60, 
        y: centerY - 60, 
        label: 'Skin Care', 
        type: 'practice', 
        connections: [1, 4],
        description: 'Traditional skin treatment practices',
        community: 'Multiple'
      },
      { 
        id: 3, 
        x: centerX - 60, 
        y: centerY + 60, 
        label: 'Healing', 
        type: 'concept', 
        connections: [1, 4],
        description: 'Traditional healing knowledge',
        community: 'Multiple'
      },
      { 
        id: 4, 
        x: centerX + 60, 
        y: centerY, 
        label: 'Medicine', 
        type: 'domain', 
        connections: [2, 3],
        description: 'Indigenous medical systems',
        community: 'Pan-African'
      },
      { 
        id: 5, 
        x: centerX + 180, 
        y: centerY - 40, 
        label: 'Rituals', 
        type: 'practice', 
        connections: [4],
        description: 'Cultural healing rituals',
        community: 'Multiple'
      },
      { 
        id: 6, 
        x: centerX + 180, 
        y: centerY + 40, 
        label: 'Wisdom', 
        type: 'concept', 
        connections: [4],
        description: 'Elder knowledge',
        community: 'Pan-African'
      },
    ]

    const nodeColors = {
      plant: '#FFD369',
      practice: '#00ADB5', 
      concept: '#EEEEEE',
      domain: '#9C27B0'
    }

    const drawGraph = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw connections first with gradient
      ctx.lineWidth = 2.5
      ctx.globalAlpha = 0.5
      ctx.setLineDash([])
      
      nodes.forEach(node => {
        node.connections.forEach(connId => {
          const target = nodes.find(n => n.id === connId)
          if (target) {
            // Create gradient for connections
            const gradient = ctx.createLinearGradient(node.x, node.y, target.x, target.y)
            gradient.addColorStop(0, nodeColors[node.type] || '#00ADB5')
            gradient.addColorStop(1, nodeColors[target.type] || '#00ADB5')
            
            ctx.strokeStyle = gradient
            ctx.beginPath()
            ctx.moveTo(node.x, node.y)
            ctx.lineTo(target.x, target.y)
            ctx.stroke()
          }
        })
      })

      // Draw nodes
      ctx.globalAlpha = 1
      nodes.forEach(node => {
        const isSelected = selectedNode?.id === node.id
        const color = nodeColors[node.type] || '#00ADB5'
        
        // Node glow effect for selected node
        if (isSelected) {
          ctx.shadowColor = color
          ctx.shadowBlur = 25
        }

        // Node background with gradient
        const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, isSelected ? 28 : 24)
        gradient.addColorStop(0, color)
        gradient.addColorStop(1, color + 'CC')
        
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(node.x, node.y, isSelected ? 28 : 24, 0, 2 * Math.PI)
        ctx.fill()

        // Reset shadow
        ctx.shadowBlur = 0

        // Node border
        ctx.strokeStyle = isSelected ? '#FFFFFF' : '#0B132B'
        ctx.lineWidth = isSelected ? 4 : 3
        ctx.stroke()
        
        // Add inner highlight
        if (isSelected) {
          ctx.beginPath()
          ctx.arc(node.x, node.y - 4, 6, 0, Math.PI, true)
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)'
          ctx.lineWidth = 2
          ctx.stroke()
        }

        // Node label with background
        ctx.font = 'bold 11px Poppins'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        
        const lines = node.label.split('\n')
        lines.forEach((line, index) => {
          // Text background for readability
          const metrics = ctx.measureText(line)
          const textWidth = metrics.width
          const textHeight = 14
          const textX = node.x - textWidth / 2 - 4
          const textY = node.y - 8 + (index * 15) - textHeight / 2
          
          ctx.fillStyle = 'rgba(11, 19, 43, 0.8)'
          ctx.fillRect(textX, textY, textWidth + 8, textHeight)
          
          // Text
          ctx.fillStyle = color === '#EEEEEE' ? '#0B132B' : '#EEEEEE'
          ctx.fillText(line, node.x, node.y + (index * 15))
        })
      })
    }

    const handleClick = (event) => {
      const rect = canvas.getBoundingClientRect()
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top

      const clickedNode = nodes.find(node => {
        const distance = Math.sqrt((node.x - x) ** 2 + (node.y - y) ** 2)
        return distance <= 28
      })

      setSelectedNode(clickedNode || null)
    }
    
    const handleMouseMove = (event) => {
      const rect = canvas.getBoundingClientRect()
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top

      const hoveredNode = nodes.find(node => {
        const distance = Math.sqrt((node.x - x) ** 2 + (node.y - y) ** 2)
        return distance <= 28
      })

      canvas.style.cursor = hoveredNode ? 'pointer' : 'default'
    }

    drawGraph()

    canvas.addEventListener('click', handleClick)
    canvas.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('resize', setCanvasSize)

    return () => {
      canvas.removeEventListener('click', handleClick)
      canvas.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('resize', setCanvasSize)
    }
  }, [selectedNode])

  if (isLoading) {
    return (
      <div className="w-full h-[280px] bg-primary-navy/50 rounded-lg border border-primary-cyan/10 flex items-center justify-center">
        <div className="text-center">
          <div className="spinner w-8 h-8 border-2 border-primary-navy border-t-primary-cyan rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-primary-white/70 text-sm">Loading knowledge graph...</p>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative"
    >
      <canvas
        ref={canvasRef}
        className="w-full h-[280px] rounded-lg bg-primary-navy/50 border border-primary-cyan/10 cursor-pointer"
      />
      
      {/* Node Info Panel */}
      <AnimatePresence>
        {selectedNode && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute top-4 right-4 bg-primary-navy/90 backdrop-blur-sm border border-primary-cyan/20 rounded-lg p-4 max-w-xs"
          >
            <h3 className="font-semibold text-primary-white mb-2">
              {selectedNode.label}
            </h3>
            <p className="text-primary-white/70 text-sm mb-2">
              {selectedNode.description}
            </p>
            <div className="flex items-center justify-between text-xs">
              <span className="text-primary-cyan capitalize">{selectedNode.type}</span>
              <span className="text-primary-gold">{selectedNode.community}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Legend - All Nodes from Graph */}
      <div className="mt-4 p-3 bg-primary-navy/30 rounded-lg border border-primary-cyan/20">
        <h4 className="text-xs font-bold text-primary-white/90 mb-3">Knowledge Network:</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs">
          {[
            { color: '#FFD369', label: 'Aloe Vera', type: 'Plant', community: 'Kikuyu' },
            { color: '#00ADB5', label: 'Skin Care', type: 'Practice', community: 'Multiple' },
            { color: '#EEEEEE', label: 'Healing', type: 'Concept', community: 'Multiple' },
            { color: '#9C27B0', label: 'Medicine', type: 'Domain', community: 'Pan-African' },
            { color: '#00ADB5', label: 'Rituals', type: 'Practice', community: 'Multiple' },
            { color: '#EEEEEE', label: 'Wisdom', type: 'Concept', community: 'Pan-African' },
          ].map((item, index) => (
            <div key={index} className="flex items-start space-x-2 p-2 rounded bg-primary-navy/50 hover:bg-primary-navy/70 transition-colors">
              <div 
                className="w-4 h-4 rounded-full mt-0.5 flex-shrink-0 border-2 border-primary-navy"
                style={{ backgroundColor: item.color }}
              ></div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-primary-white truncate">{item.label}</div>
                <div className="text-primary-white/60 text-[10px]">{item.type} • {item.community}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}