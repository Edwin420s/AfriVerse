'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  TrendingUp, Users, BookOpen, Globe, Award, Clock, 
  BarChart3, PieChart, Activity, Target, Zap, Shield 
} from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import LoadingSpinner from '@/components/LoadingSpinner'
import { api } from '@/lib/api'

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState(null)
  const [timeRange, setTimeRange] = useState('week') // week, month, year, all

  useEffect(() => {
    fetchAnalytics()
  }, [timeRange])

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      const response = await api.getPlatformStats(timeRange)
      
      // Mock data for demonstration
      const mockStats = {
        overview: {
          totalEntries: 8947,
          totalCommunities: 47,
          totalContributors: 2563,
          totalValidators: 287,
          entriesGrowth: 12.5,
          communitiesGrowth: 8.3,
          contributorsGrowth: 15.7,
          validatorsGrowth: 6.2
        },
        entries: {
          byType: {
            story: 3245,
            practice: 2156,
            plant: 1847,
            ritual: 892,
            artifact: 807
          },
          byStatus: {
            validated: 6234,
            pending: 1890,
            rejected: 823
          },
          byLanguage: {
            Swahili: 2145,
            Yoruba: 1876,
            Kikuyu: 1234,
            Zulu: 987,
            Igbo: 856,
            Others: 1849
          }
        },
        engagement: {
          avgValidationTime: '2.3 days',
          validationRate: 92.4,
          communityParticipation: 78.6,
          contentQuality: 87.3
        },
        topCommunities: [
          { name: 'Kikuyu Wisdom Keepers', entries: 892, members: 247, growth: 15.2 },
          { name: 'Yoruba Cultural Heritage', entries: 1547, members: 583, growth: 22.8 },
          { name: 'Zulu Ancestral Knowledge', entries: 1103, members: 394, growth: 10.5 },
          { name: 'Swahili Coastal Wisdom', entries: 967, members: 421, growth: 18.3 },
          { name: 'Igbo Traditional Systems', entries: 754, members: 312, growth: 12.1 }
        ],
        recentActivity: {
          last24h: {
            newEntries: 47,
            validations: 89,
            newMembers: 23
          },
          last7d: {
            newEntries: 312,
            validations: 567,
            newMembers: 145
          },
          last30d: {
            newEntries: 1234,
            validations: 2145,
            newMembers: 487
          }
        }
      }

      setStats(response.data || mockStats)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching analytics:', error)
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="flex justify-center items-center py-20">
          <LoadingSpinner />
        </div>
        <Footer />
      </div>
    )
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
            className="mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-cormorant font-bold mb-4">
              Platform <span className="gradient-text">Analytics</span>
            </h1>
            <p className="text-xl text-primary-white/70 max-w-3xl">
              Real-time insights into cultural knowledge preservation across AfriVerse
            </p>
          </motion.div>

          {/* Time Range Selector */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex space-x-2 mb-8"
          >
            {['week', 'month', 'year', 'all'].map(range => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 rounded-lg transition-all capitalize ${
                  timeRange === range
                    ? 'gold-gradient text-primary-navy'
                    : 'bg-primary-navy/50 text-primary-white/70 hover:text-primary-white border border-primary-cyan/20'
                }`}
              >
                {range === 'all' ? 'All Time' : `Last ${range}`}
              </button>
            ))}
          </motion.div>

          {/* Overview Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
          >
            {[
              {
                label: 'Total Entries',
                value: stats.overview.totalEntries.toLocaleString(),
                growth: stats.overview.entriesGrowth,
                icon: <BookOpen className="w-6 h-6" />,
                color: 'text-primary-cyan'
              },
              {
                label: 'Communities',
                value: stats.overview.totalCommunities,
                growth: stats.overview.communitiesGrowth,
                icon: <Users className="w-6 h-6" />,
                color: 'text-primary-gold'
              },
              {
                label: 'Contributors',
                value: stats.overview.totalContributors.toLocaleString(),
                growth: stats.overview.contributorsGrowth,
                icon: <Globe className="w-6 h-6" />,
                color: 'text-green-400'
              },
              {
                label: 'Validators',
                value: stats.overview.totalValidators,
                growth: stats.overview.validatorsGrowth,
                icon: <Shield className="w-6 h-6" />,
                color: 'text-purple-400'
              }
            ].map((stat, index) => (
              <div
                key={index}
                className="bg-primary-navy/30 rounded-xl border border-primary-cyan/20 p-6 hover:border-primary-cyan/40 transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={stat.color}>{stat.icon}</div>
                  <div className="flex items-center space-x-1 text-green-400 text-sm">
                    <TrendingUp className="w-4 h-4" />
                    <span>+{stat.growth}%</span>
                  </div>
                </div>
                <div className="text-3xl font-bold text-primary-white mb-1">
                  {stat.value}
                </div>
                <div className="text-primary-white/70 text-sm">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>

          {/* Entry Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12"
          >
            {/* By Type */}
            <div className="bg-primary-navy/30 rounded-xl border border-primary-cyan/20 p-6">
              <div className="flex items-center space-x-2 mb-6">
                <PieChart className="w-5 h-5 text-primary-cyan" />
                <h2 className="text-2xl font-cormorant font-bold text-primary-white">
                  Entries by Type
                </h2>
              </div>
              <div className="space-y-4">
                {Object.entries(stats.entries.byType).map(([type, count], index) => {
                  const total = Object.values(stats.entries.byType).reduce((a, b) => a + b, 0)
                  const percentage = ((count / total) * 100).toFixed(1)
                  return (
                    <div key={type}>
                      <div className="flex justify-between items-center text-sm mb-2">
                        <span className="text-primary-white capitalize">{type}</span>
                        <span className="text-primary-white/70">{count} ({percentage}%)</span>
                      </div>
                      <div className="w-full bg-primary-navy/50 rounded-full h-2">
                        <div
                          className={`rounded-full h-2 transition-all duration-500 ${
                            index % 3 === 0 ? 'bg-primary-cyan' :
                            index % 3 === 1 ? 'bg-primary-gold' :
                            'bg-green-400'
                          }`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* By Status */}
            <div className="bg-primary-navy/30 rounded-xl border border-primary-cyan/20 p-6">
              <div className="flex items-center space-x-2 mb-6">
                <BarChart3 className="w-5 h-5 text-primary-gold" />
                <h2 className="text-2xl font-cormorant font-bold text-primary-white">
                  Validation Status
                </h2>
              </div>
              <div className="space-y-4">
                {Object.entries(stats.entries.byStatus).map(([status, count]) => {
                  const total = Object.values(stats.entries.byStatus).reduce((a, b) => a + b, 0)
                  const percentage = ((count / total) * 100).toFixed(1)
                  return (
                    <div key={status}>
                      <div className="flex justify-between items-center text-sm mb-2">
                        <span className="text-primary-white capitalize">{status}</span>
                        <span className="text-primary-white/70">{count} ({percentage}%)</span>
                      </div>
                      <div className="w-full bg-primary-navy/50 rounded-full h-2">
                        <div
                          className={`rounded-full h-2 transition-all duration-500 ${
                            status === 'validated' ? 'bg-green-500' :
                            status === 'pending' ? 'bg-yellow-500' :
                            'bg-red-500'
                          }`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </motion.div>

          {/* Engagement Metrics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-primary-navy/30 rounded-xl border border-primary-cyan/20 p-6 mb-12"
          >
            <div className="flex items-center space-x-2 mb-6">
              <Activity className="w-5 h-5 text-primary-cyan" />
              <h2 className="text-2xl font-cormorant font-bold text-primary-white">
                Engagement Metrics
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  label: 'Avg Validation Time',
                  value: stats.engagement.avgValidationTime,
                  icon: <Clock className="w-5 h-5" />
                },
                {
                  label: 'Validation Rate',
                  value: `${stats.engagement.validationRate}%`,
                  icon: <Target className="w-5 h-5" />
                },
                {
                  label: 'Community Participation',
                  value: `${stats.engagement.communityParticipation}%`,
                  icon: <Users className="w-5 h-5" />
                },
                {
                  label: 'Content Quality',
                  value: `${stats.engagement.contentQuality}%`,
                  icon: <Award className="w-5 h-5" />
                }
              ].map((metric, index) => (
                <div key={index} className="text-center">
                  <div className="text-primary-cyan mb-2 flex justify-center">
                    {metric.icon}
                  </div>
                  <div className="text-3xl font-bold text-primary-white mb-1">
                    {metric.value}
                  </div>
                  <div className="text-primary-white/70 text-sm">
                    {metric.label}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Top Communities */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-primary-navy/30 rounded-xl border border-primary-cyan/20 p-6 mb-12"
          >
            <div className="flex items-center space-x-2 mb-6">
              <Zap className="w-5 h-5 text-primary-gold" />
              <h2 className="text-2xl font-cormorant font-bold text-primary-white">
                Top Communities
              </h2>
            </div>
            <div className="space-y-4">
              {stats.topCommunities.map((community, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-primary-navy/50 rounded-lg hover:bg-primary-navy/70 transition-all"
                >
                  <div className="flex items-center space-x-4">
                    <div className="text-2xl font-bold text-primary-cyan">
                      #{index + 1}
                    </div>
                    <div>
                      <div className="text-primary-white font-semibold">
                        {community.name}
                      </div>
                      <div className="text-primary-white/60 text-sm">
                        {community.entries} entries • {community.members} members
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 text-green-400">
                    <TrendingUp className="w-4 h-4" />
                    <span className="font-semibold">+{community.growth}%</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-primary-navy/30 rounded-xl border border-primary-cyan/20 p-6"
          >
            <h2 className="text-2xl font-cormorant font-bold text-primary-white mb-6">
              Recent Activity
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { period: 'Last 24 Hours', data: stats.recentActivity.last24h },
                { period: 'Last 7 Days', data: stats.recentActivity.last7d },
                { period: 'Last 30 Days', data: stats.recentActivity.last30d }
              ].map((activity, index) => (
                <div key={index} className="text-center p-4 bg-primary-navy/50 rounded-lg">
                  <div className="text-primary-gold font-semibold mb-4">
                    {activity.period}
                  </div>
                  <div className="space-y-2">
                    <div>
                      <div className="text-2xl font-bold text-primary-cyan">
                        {activity.data.newEntries}
                      </div>
                      <div className="text-primary-white/60 text-sm">New Entries</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-400">
                        {activity.data.validations}
                      </div>
                      <div className="text-primary-white/60 text-sm">Validations</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-purple-400">
                        {activity.data.newMembers}
                      </div>
                      <div className="text-primary-white/60 text-sm">New Members</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
