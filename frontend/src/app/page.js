'use client'
import { motion } from 'framer-motion'
import { Brain, Users, Shield, Globe, ArrowRight, Star } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function Home() {
  const features = [
    {
      icon: <Brain className="w-8 h-8" />,
      title: "AGI-Powered",
      description: "Leveraging symbolic AI and neural networks to understand cultural context"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Community Driven",
      description: "Built with and for local communities, ensuring authentic representation"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Ethically Grounded",
      description: "Consent-based data collection and community ownership"
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Decentralized",
      description: "Powered by blockchain for transparency and data sovereignty"
    }
  ]

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-7xl font-cormorant font-bold mb-6">
              <span className="gradient-text">AfriVerse</span>
            </h1>
            <p className="text-xl md:text-2xl text-primary-cyan mb-8 max-w-3xl mx-auto">
              Where Ancestral Knowledge Meets Artificial Intelligence
            </p>
            <p className="text-lg text-primary-white/80 mb-12 max-w-2xl mx-auto">
              Preserving African indigenous wisdom through decentralized AGI, creating a living 
              digital heritage that respects cultural sovereignty and enables intergenerational learning.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="gold-gradient text-primary-navy px-8 py-4 rounded-lg font-semibold text-lg flex items-center gap-2"
              >
                Contribute Wisdom <ArrowRight className="w-5 h-5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border-2 border-primary-cyan text-primary-cyan px-8 py-4 rounded-lg font-semibold text-lg"
              >
                Explore Knowledge
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-primary-navy/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-cormorant font-bold mb-4">
              Why <span className="gradient-text">AfriVerse</span>?
            </h2>
            <p className="text-xl text-primary-white/70 max-w-3xl mx-auto">
              Building the bridge between traditional wisdom and artificial general intelligence
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-primary-navy/30 p-6 rounded-xl border border-primary-cyan/20 hover:border-primary-cyan/40 transition-all duration-300"
              >
                <div className="text-primary-gold mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-primary-white">
                  {feature.title}
                </h3>
                <p className="text-primary-white/70">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-cormorant font-bold mb-4">
              How It <span className="gradient-text">Works</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Contribute",
                description: "Share indigenous knowledge through voice recordings, text, or media with proper consent and context"
              },
              {
                step: "02",
                title: "Process",
                description: "AI agents transcribe, translate, and structure knowledge into symbolic representations"
              },
              {
                step: "03",
                title: "Preserve",
                description: "Community-validated knowledge is stored on decentralized networks with blockchain provenance"
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="text-center"
              >
                <div className="cyan-gradient w-20 h-20 rounded-full flex items-center justify-center text-primary-navy font-bold text-2xl mb-4 mx-auto">
                  {step.step}
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-primary-white">
                  {step.title}
                </h3>
                <p className="text-primary-white/70">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-primary-cyan/10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-cormorant font-bold mb-6">
              Join the <span className="gradient-text">Movement</span>
            </h2>
            <p className="text-xl text-primary-white/70 mb-8 max-w-2xl mx-auto">
              Help preserve cultural heritage while shaping the future of ethical AGI
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="gold-gradient text-primary-navy px-8 py-4 rounded-lg font-semibold text-lg"
              >
                Start Contributing
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border-2 border-primary-gold text-primary-gold px-8 py-4 rounded-lg font-semibold text-lg"
              >
                Become a Validator
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}