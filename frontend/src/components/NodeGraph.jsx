'use client'
import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

export default function NodeGraph() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    canvas.width = canvas.offsetWidth
    canvas.height = 400

    // Sample nodes and connections
    const nodes = [
      { id: 1, x: 100, y: 200, label: 'Aloe Vera', type: 'plant', connections: [2, 3] },
      { id: 2, x: 300, y: 100, label: 'Skin Care', type: 'practice', connections: [1, 4] },
      { id: 3, x: 300, y: 300, label: 'Healing', type: 'concept', connections: [1, 4] },
      { id: 4, x: 500, y: 200, label: 'Traditional\nMedicine', type: 'domain', connections: [2, 3] },
    ]

    const drawGraph = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw connections
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
        // Node background
        ctx.fillStyle = node.type === 'plant' ? '#FFD369' : 
                       node.type === 'practice' ? '#00ADB5' : 
                       node.type === 'concept' ? '#EEEEEE' : '#9C27B0'
        
        ctx.beginPath()
        ctx.arc(node.x, node.y, 20, 0, 2 * Math.PI)
        ctx.fill()

        // Node border
        ctx.strokeStyle = '#0B132B'
        ctx.lineWidth = 2
        ctx.stroke()

        // Node label
        ctx.fillStyle = '#0B132B'
        ctx.font = '12px Poppins'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(node.label.split(' ')[0], node.x, node.y - 25)
        
        if (node.label.includes('\n')) {
          ctx.fillText(node.label.split('\n')[1], node.x, node.y + 30)
        }
      })
    }

    drawGraph()

    const handleResize = () => {
      canvas.width = canvas.offsetWidth
      drawGraph()
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative"
    >
      <canvas
        ref={canvasRef}
        className="w-full h-96 rounded-lg bg-primary-navy/50 border border-primary-cyan/10"
      />
      
      {/* Legend */}
      <div className="flex flex-wrap gap-4 mt-4 text-xs">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-primary-gold rounded-full"></div>
          <span className="text-primary-white/70">Plants</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-primary-cyan rounded-full"></div>
          <span className="text-primary-white/70">Practices</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-primary-white rounded-full"></div>
          <span className="text-primary-white/70">Concepts</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
          <span className="text-primary-white/70">Domains</span>
        </div>
      </div>
    </motion.div>
  )
}