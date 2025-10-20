'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { User, Mail, MapPin, Calendar, Award, Shield, Users, Book, TrendingUp } from 'lucide-react'

export default function UserProfile({ user, onEdit, className = "" }) {
  const [activeTab, setActiveTab] = useState('overview')

  const stats = user.stats || {
    contributions: 0,
    validations: 0,
    reputation: 0,
    accuracy: 0,
    communities: []
  }

  const achievements = user.achievements || [
    {
      id: 1,
      title: 'First Contribution',
      description: 'Made your first knowledge contribution',
      earned: true,
      date: '2025-10-15',
      icon: <Book className="w-6 h-6" />
    },
    {
      id: 2,
      title: 'Cultural Guardian',
      description: 'Validated 50+ cultural entries',
      earned: stats.validations >= 50,
      icon: <Shield className="w-6 h-6" />
    },
    {
      id: 3,
      title: 'Community Leader',
      description: 'Active in 3+ communities',
      earned: stats.communities.length >= 3,
      icon: <Users className="w-6 h-6" />
    },
    {
      id: 4,
      title: 'Wisdom Keeper',
      description: '95%+ validation accuracy',
      earned: stats.accuracy >= 95,
      icon: <Award className="w-6 h-6" />
    }
  ]

  const tabs = [
    { id: 'overview', name: 'Overview' },
    { id: 'contributions', name: 'Contributions' },
    { id: 'validations', name: 'Validations' },
    { id: 'achievements', name: 'Achievements' }
  ]

  return (
    <div className={`bg-primary-navy/30 rounded-2xl border border-primary-cyan/20 overflow-hidden ${className}`}>
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-primary-navy to-primary-cyan/10 p-8">
        <div className="flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-6">
          {/* Avatar */}
          <div className="relative">
            <div className="gold-gradient p-1 rounded-full">
              <div className="w-20 h-20 bg-primary-navy rounded-full flex items-center justify-center">
                <User className="w-10 h-10 text-primary-gold" />
              </div>
            </div>
            {stats.reputation >= 100 && (
              <div className="absolute -top-2 -right-2">
                <div className="bg-primary-cyan text-primary-navy p-1 rounded-full">
                  <Award className="w-4 h-4" />
                </div>
              </div>
            )}
          </div>

          {/* User Info */}
          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-cormorant font-bold text-primary-white mb-2">
                  {user.name || 'Cultural Contributor'}
                </h1>
                <div className="flex items-center space-x-4 text-primary-white/70 text-sm">
                  {user.role && (
                    <div className="flex items-center space-x-1">
                      <Shield className="w-4 h-4" />
                      <span className="capitalize">{user.role}</span>
                    </div>
                  )}
                  {user.location && (
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span>{user.location}</span>
                    </div>
                  )}
                  {user.joinedDate && (
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>Joined {new Date(user.joinedDate).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </div>
              
              <button
                onClick={onEdit}
                className="mt-4 md:mt-0 px-4 py-2 border border-primary-cyan text-primary-cyan rounded-lg hover:bg-primary-cyan/10 transition-colors"
              >
                Edit Profile
              </button>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Contributions', value: stats.contributions, icon: Book },
                { label: 'Validations', value: stats.validations, icon: Shield },
                { label: 'Reputation', value: stats.reputation, icon: TrendingUp },
                { label: 'Accuracy', value: `${stats.accuracy}%`, icon: Award }
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <stat.icon className="w-5 h-5 text-primary-cyan mx-auto mb-1" />
                  <div className="text-lg font-bold text-primary-white">
                    {stat.value}
                  </div>
                  <div className="text-primary-white/70 text-xs">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-primary-cyan/20">
        <nav className="flex overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 min-w-0 px-6 py-4 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-primary-cyan border-b-2 border-primary-cyan'
                  : 'text-primary-white/70 hover:text-primary-white'
              }`}
            >
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Bio */}
            {user.bio && (
              <div>
                <h3 className="text-lg font-semibold text-primary-white mb-3">About</h3>
                <p className="text-primary-white/70 leading-relaxed">
                  {user.bio}
                </p>
              </div>
            )}

            {/* Communities */}
            {stats.communities.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-primary-white mb-3">Communities</h3>
                <div className="flex flex-wrap gap-2">
                  {stats.communities.map((community, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-primary-cyan/20 text-primary-cyan rounded-full text-sm"
                    >
                      {community}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Activity */}
            <div>
              <h3 className="text-lg font-semibold text-primary-white mb-3">Recent Activity</h3>
              <div className="space-y-3">
                {user.recentActivity?.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-3 p-3 bg-primary-navy/50 rounded-lg border border-primary-cyan/10"
                  >
                    <div className="text-primary-cyan">
                      {activity.type === 'contribution' ? <Book className="w-5 h-5" /> : <Shield className="w-5 h-5" />}
                    </div>
                    <div className="flex-1">
                      <div className="text-primary-white text-sm">
                        {activity.description}
                      </div>
                      <div className="text-primary-white/50 text-xs">
                        {new Date(activity.date).toLocaleDateString()}
                      </div>
                    </div>
                    <div className={`px-2 py-1 rounded text-xs ${
                      activity.status === 'approved' ? 'bg-green-500/20 text-green-400' :
                      activity.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-blue-500/20 text-blue-400'
                    }`}>
                      {activity.status}
                    </div>
                  </div>
                )) || (
                  <p className="text-primary-white/50 text-sm">No recent activity</p>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'achievements' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {achievements.map((achievement) => (
              <motion.div
                key={achievement.id}
                whileHover={{ scale: 1.02 }}
                className={`p-6 rounded-xl border-2 transition-all ${
                  achievement.earned
                    ? 'border-primary-gold bg-primary-gold/10'
                    : 'border-primary-white/20 bg-primary-navy/50 opacity-50'
                }`}
              >
                <div className={`mb-4 ${
                  achievement.earned ? 'text-primary-gold' : 'text-primary-white/50'
                }`}>
                  {achievement.icon}
                </div>
                <h3 className={`font-semibold mb-2 ${
                  achievement.earned ? 'text-primary-white' : 'text-primary-white/50'
                }`}>
                  {achievement.title}
                </h3>
                <p className={`text-sm mb-3 ${
                  achievement.earned ? 'text-primary-white/70' : 'text-primary-white/40'
                }`}>
                  {achievement.description}
                </p>
                {achievement.earned && achievement.date && (
                  <div className="text-primary-gold text-xs">
                    Earned on {new Date(achievement.date).toLocaleDateString()}
                  </div>
                )}
                {!achievement.earned && (
                  <div className="text-primary-white/30 text-xs">
                    Not yet earned
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}

        {/* Placeholder for other tabs */}
        {(activeTab === 'contributions' || activeTab === 'validations') && (
          <div className="text-center py-12">
            <div className="text-primary-white/50 mb-4">
              {activeTab === 'contributions' ? <Book className="w-12 h-12 mx-auto" /> : <Shield className="w-12 h-12 mx-auto" />}
            </div>
            <p className="text-primary-white/70">
              {activeTab === 'contributions' ? 'Your contributions' : 'Validation history'} will appear here
            </p>
          </div>
        )}
      </div>
    </div>
  )
}