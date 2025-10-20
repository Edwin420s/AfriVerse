'use client'
import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

export default function NodeGraph() {
  const canvasRef = useRef(null)
  const [selectedNode, setSelectedNode] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    
    const setCanvasSize = () => {
      const dpr = window.devicePixelRatio || 1
      const rect = canvas.getBoundingClientRect()
      
      canvas.width = rect.width * dpr
      canvas.height = 400 * dpr
      canvas.style.width = `${rect.width}px`
      canvas.style.height = '400px'
      
      ctx.scale(dpr, dpr)
    }

    setCanvasSize()
    setIsLoading(false)

    // Sample knowledge graph data
    const nodes = [
      { 
        id: 1, 
        x: 100, 
        y: 200, 
        label: 'Aloe Vera', 
        type: 'plant', 
        connections: [2, 3],
        description: 'Medicinal plant known as "mwarubaini"',
        community: 'Kikuyu'
      },
      { 
        id: 2, 
        x: 300, 
        y: 100, 
        label: 'Skin Care', 
        type: 'practice', 
        connections: [1, 4],
        description: 'Traditional skin treatment practices',
        community: 'Multiple'
      },
      { 
        id: 3, 
        x: 300, 
        y: 300, 
        label: 'Healing', 
        type: 'concept', 
        connections: [1, 4],
        description: 'Traditional healing knowledge',
        community: 'Multiple'
      },
      { 
        id: 4, 
        x: 500, 
        y: 200, 
        label: 'Traditional\nMedicine', 
        type: 'domain', 
        connections: [2, 3],
        description: 'Indigenous medical systems',
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

      // Draw connections first
      ctx.strokeStyle = '#00ADB5'
      ctx.lineWidth = 2
      ctx.setLineDash([])
      
      nodes.forEach(node => {
        node.connections.forEach(connId => {
          const target = nodes.find(n => n.id === connId)
          if (target) {
            ctx.beginPath()
            ctx.moveTo(node.x, node.y)
            ctx.lineTo(target.x, target.y)
            ctx.stroke()
          }
        })
      })

      // Draw nodes
      nodes.forEach(node => {
        const isSelected = selectedNode?.id === node.id
        const color = nodeColors[node.type] || '#00ADB5'
        
        // Node glow effect for selected node
        if (isSelected) {
          ctx.shadowColor = color
          ctx.shadowBlur = 20
        }

        // Node background
        ctx.fillStyle = color
        ctx.beginPath()
        ctx.arc(node.x, node.y, isSelected ? 25 : 20, 0, 2 * Math.PI)
        ctx.fill()

        // Reset shadow
        ctx.shadowBlur = 0

        // Node border
        ctx.strokeStyle = isSelected ? '#FFFFFF' : '#0B132B'
        ctx.lineWidth = isSelected ? 3 : 2
        ctx.stroke()

        // Node label
        ctx.fillStyle = '#0B132B'
        ctx.font = 'bold 12px Poppins'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        
        const lines = node.label.split('\n')
        lines.forEach((line, index) => {
          ctx.fillText(line, node.x, node.y - 15 + (index * 15))
        })
      })
    }

    const handleClick = (event) => {
      const rect = canvas.getBoundingClientRect()
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top

      const clickedNode = nodes.find(node => {
        const distance = Math.sqrt((node.x - x) ** 2 + (node.y - y) ** 2)
        return distance <= 20
      })

      setSelectedNode(clickedNode || null)
    }

    drawGraph()

    canvas.addEventListener('click', handleClick)
    window.addEventListener('resize', setCanvasSize)

    return () => {
      canvas.removeEventListener('click', handleClick)
      window.removeEventListener('resize', setCanvasSize)
    }
  }, [selectedNode])

  if (isLoading) {
    return (
      <div className="w-full h-96 bg-primary-navy/50 rounded-lg border border-primary-cyan/10 flex items-center justify-center">
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
        className="w-full h-96 rounded-lg bg-primary-navy/50 border border-primary-cyan/10 cursor-pointer"
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
      
      {/* Legend */}
      <div className="flex flex-wrap gap-4 mt-4 text-xs">
        {[
          { color: '#FFD369', label: 'Plants' },
          { color: '#00ADB5', label: 'Practices' },
          { color: '#EEEEEE', label: 'Concepts' },
          { color: '#9C27B0', label: 'Domains' },
        ].map((item, index) => (
          <div key={index} className="flex items-center space-x-2">
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: item.color }}
            ></div>
            <span className="text-primary-white/70">{item.label}</span>
          </div>
        ))}
      </div>
    </motion.div>
  )
}