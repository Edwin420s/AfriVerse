'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  User, 
  Settings, 
  Book, 
  Shield, 
  Award, 
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('contributions')

  const userStats = {
    contributions: 24,
    validations: 47,
    accuracy: 96,
    reputation: 420,
    level: 'Cultural Guardian'
  }

  const recentActivity = [
    {
      id: 1,
      type: 'contribution',
      title: 'Healing Properties of Aloe Vera',
      status: 'validated',
      date: '2025-10-15',
      points: 50
    },
    {
      id: 2,
      type: 'validation',
      title: 'Maasai Rainmaking Ceremony',
      status: 'approved',
      date: '2025-10-14', 
      points: 25
    },
    {
      id: 3,
      type: 'contribution',
      title: 'Yoruba Proverb Collection',
      status: 'pending',
      date: '2025-10-13',
      points: 0
    }
  ]

  const tabs = [
    { id: 'contributions', name: 'My Contributions', icon: <Book className="w-4 h-4" /> },
    { id: 'validations', name: 'Validation Work', icon: <Shield className="w-4 h-4" /> },
    { id: 'achievements', name: 'Achievements', icon: <Award className="w-4 h-4" /> },
    { id: 'settings', name: 'Settings', icon: <Settings className="w-4 h-4" /> }
  ]

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Profile Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-primary-navy/30 rounded-2xl p-8 border border-primary-cyan/20 mb-8"
          >
            <div className="flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-6">
              {/* Avatar */}
              <div className="gold-gradient p-1 rounded-full">
                <div className="w-20 h-20 bg-primary-navy rounded-full flex items-center justify-center">
                  <User className="w-10 h-10 text-primary-gold" />
                </div>
              </div>

              {/* Info */}
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-cormorant font-bold text-primary-white mb-2">
                      Cultural Contributor
                    </h1>
                    <div className="flex items-center space-x-2 text-primary-cyan">
                      <Award className="w-5 h-5" />
                      <span className="font-semibold">{userStats.level}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 mt-4 md:mt-0">
                    <div className="bg-primary-gold/20 text-primary-gold px-3 py-1 rounded-full text-sm font-semibold">
                      {userStats.reputation} Rep
                    </div>
                    <button className="bg-primary-cyan/20 text-primary-cyan px-4 py-2 rounded-lg hover:bg-primary-cyan/30 transition-colors">
                      Edit Profile
                    </button>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: 'Contributions', value: userStats.contributions, icon: Book },
                    { label: 'Validations', value: userStats.validations, icon: Shield },
                    { label: 'Accuracy', value: `${userStats.accuracy}%`, icon: TrendingUp },
                    { label: 'Since', value: '2024', icon: Clock }
                  ].map((stat, index) => (
                    <div key={index} className="text-center">
                      <stat.icon className="w-6 h-6 text-primary-cyan mx-auto mb-2" />
                      <div className="text-2xl font-bold text-primary-white">
                        {stat.value}
                      </div>
                      <div className="text-primary-white/70 text-sm">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-1"
            >
              <div className="bg-primary-navy/30 rounded-xl border border-primary-cyan/20 p-6">
                <nav className="space-y-2">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                        activeTab === tab.id
                          ? 'gold-gradient text-primary-navy'
                          : 'text-primary-white/70 hover:text-primary-white hover:bg-primary-navy/50'
                      }`}
                    >
                      {tab.icon}
                      <span>{tab.name}</span>
                    </button>
                  ))}
                </nav>
              </div>

              {/* Recent Activity */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-primary-navy/30 rounded-xl border border-primary-cyan/20 p-6 mt-6"
              >
                <h3 className="text-lg font-semibold text-primary-white mb-4">
                  Recent Activity
                </h3>
                <div className="space-y-3">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-3">
                      {activity.status === 'validated' || activity.status === 'approved' ? (
                        <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                      ) : (
                        <Clock className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                      )}
                      <div className="flex-1">
                        <div className="text-sm text-primary-white">
                          {activity.title}
                        </div>
                        <div className="text-xs text-primary-white/50">
                          {activity.date} • {activity.points > 0 && `+${activity.points} points`}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </motion.div>

            {/* Main Content */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="lg:col-span-3"
            >
              <div className="bg-primary-navy/30 rounded-xl border border-primary-cyan/20 p-6">
                {activeTab === 'contributions' && (
                  <div>
                    <h2 className="text-2xl font-semibold text-primary-white mb-6">
                      My Contributions
                    </h2>
                    <div className="space-y-4">
                      {/* Contribution list would go here */}
                      <div className="text-center py-12 text-primary-white/50">
                        <Book className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>Your contributions will appear here</p>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'validations' && (
                  <div>
                    <h2 className="text-2xl font-semibold text-primary-white mb-6">
                      Validation Work
                    </h2>
                    <div className="space-y-4">
                      {/* Validation history would go here */}
                      <div className="text-center py-12 text-primary-white/50">
                        <Shield className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>Your validation work will appear here</p>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'achievements' && (
                  <div>
                    <h2 className="text-2xl font-semibold text-primary-white mb-6">
                      Achievements & Badges
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {[
                        {
                          title: 'First Contribution',
                          description: 'Made your first knowledge contribution',
                          earned: true,
                          icon: <Award className="w-8 h-8" />
                        },
                        {
                          title: 'Cultural Guardian',
                          description: 'Validated 50+ cultural entries',
                          earned: true,
                          icon: <Shield className="w-8 h-8" />
                        },
                        {
                          title: 'Language Scholar',
                          description: 'Contributed in 3+ different languages',
                          earned: false,
                          icon: <Book className="w-8 h-8" />
                        },
                        {
                          title: 'Community Leader',
                          description: 'Reached 500 reputation points',
                          earned: false,
                          icon: <TrendingUp className="w-8 h-8" />
                        }
                      ].map((achievement, index) => (
                        <div
                          key={index}
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
                          <p className={`text-sm ${
                            achievement.earned ? 'text-primary-white/70' : 'text-primary-white/40'
                          }`}>
                            {achievement.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'settings' && (
                  <div>
                    <h2 className="text-2xl font-semibold text-primary-white mb-6">
                      Account Settings
                    </h2>
                    <div className="space-y-6">
                      {/* Settings form would go here */}
                      <div className="text-center py-12 text-primary-white/50">
                        <Settings className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>Account settings will be available here</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}