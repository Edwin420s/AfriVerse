'use client'
import { motion } from 'framer-motion'
import { Clock, Users, Globe, MessageCircle, CheckCircle, ClockIcon, FileText } from 'lucide-react'
import Link from 'next/link'

export default function EntryCard({ entry, onValidate, onViewDetails, className = "" }) {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'validated':
        return <CheckCircle className="w-4 h-4 text-green-400" />
      case 'pending':
        return <ClockIcon className="w-4 h-4 text-yellow-400" />
      case 'draft':
        return <FileText className="w-4 h-4 text-blue-400" />
      default:
        return <ClockIcon className="w-4 h-4 text-gray-400" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'validated':
        return 'bg-green-500/20 text-green-400 border-green-400/20'
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-400/20'
      case 'draft':
        return 'bg-blue-500/20 text-blue-400 border-blue-400/20'
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-400/20'
    }
  }

  const getTypeIcon = (type) => {
    switch (type) {
      case 'story':
        return <MessageCircle className="w-4 h-4" />
      case 'medicine':
        return <CheckCircle className="w-4 h-4" />
      case 'practice':
        return <Users className="w-4 h-4" />
      default:
        return <FileText className="w-4 h-4" />
    }
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      className={`bg-primary-navy/30 rounded-xl border border-primary-cyan/20 hover:border-primary-cyan/40 transition-all duration-300 overflow-hidden ${className}`}
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-2">
              {getTypeIcon(entry.type)}
              <span className="text-xs text-primary-white/50 capitalize">
                {entry.type?.replace('_', ' ') || 'knowledge'}
              </span>
            </div>
            <h3 className="text-lg font-semibold text-primary-white truncate">
              {entry.title}
            </h3>
          </div>
          <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs border ${getStatusColor(entry.status)}`}>
            {getStatusIcon(entry.status)}
            <span className="capitalize">{entry.status}</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-primary-white/70 text-sm mb-4 line-clamp-2">
          {entry.description}
        </p>

        {/* Metadata */}
        <div className="flex items-center justify-between text-xs text-primary-white/50 mb-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Users className="w-3 h-3" />
              <span>{entry.community}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Globe className="w-3 h-3" />
              <span>{entry.language}</span>
            </div>
            {entry.duration && (
              <div className="flex items-center space-x-1">
                <Clock className="w-3 h-3" />
                <span>{entry.duration}</span>
              </div>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4 text-xs">
            {entry.atoms && (
              <div className="text-primary-cyan">
                {entry.atoms} atoms
              </div>
            )}
            {entry.validations > 0 && (
              <div className="text-primary-gold">
                {entry.validations} validations
              </div>
            )}
            {entry.similarity !== undefined && (
              <div className={`${
                entry.similarity > 0.7 ? 'text-green-400' : 
                entry.similarity > 0.3 ? 'text-yellow-400' : 'text-blue-400'
              }`}>
                {Math.round(entry.similarity * 100)}% unique
              </div>
            )}
          </div>
          {entry.createdAt && (
            <div className="text-xs text-primary-white/30">
              {new Date(entry.createdAt).toLocaleDateString()}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2">
          <Link
            href={`/entry/${entry.id}`}
            className="flex-1 bg-primary-cyan/20 text-primary-cyan hover:bg-primary-cyan/30 py-2 px-3 rounded-lg text-sm text-center transition-colors"
          >
            View Details
          </Link>
          
          {onValidate && entry.status === 'pending' && (
            <button
              onClick={() => onValidate(entry)}
              className="flex-1 bg-primary-gold/20 text-primary-gold hover:bg-primary-gold/30 py-2 px-3 rounded-lg text-sm transition-colors"
            >
              Validate
            </button>
          )}
        </div>

        {/* Contributor Info */}
        {entry.contributor && (
          <div className="mt-3 pt-3 border-t border-primary-cyan/10">
            <div className="flex items-center space-x-2 text-xs text-primary-white/50">
              <span>By {entry.contributor.name}</span>
              {entry.contributor.role && (
                <>
                  <span>•</span>
                  <span className="text-primary-cyan">{entry.contributor.role}</span>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Urgency Indicator */}
      {entry.urgency === 'high' && (
        <div className="h-1 bg-gradient-to-r from-red-500 to-orange-500"></div>
      )}
      {entry.urgency === 'medium' && (
        <div className="h-1 bg-gradient-to-r from-yellow-500 to-orange-500"></div>
      )}
      {entry.urgency === 'low' && (
        <div className="h-1 bg-gradient-to-r from-green-500 to-blue-500"></div>
      )}
    </motion.div>
  )
}