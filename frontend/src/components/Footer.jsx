'use client'
import { Brain, Github, Twitter, Mail } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-primary-navy/50 border-t border-primary-cyan/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="gold-gradient p-2 rounded-lg">
                <Brain className="w-6 h-6 text-primary-navy" />
              </div>
              <span className="text-xl font-cormorant font-bold gradient-text">
                AfriVerse
              </span>
            </div>
            <p className="text-primary-white/70 max-w-md">
              Preserving African indigenous wisdom through decentralized AGI. 
              Where ancestral knowledge meets artificial intelligence for a culturally-rich future.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-lg font-semibold text-primary-white mb-4">Explore</h3>
            <ul className="space-y-2">
              {['Knowledge Graph', 'Cultural Stories', 'Medicinal Plants', 'Oral Traditions'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-primary-white/70 hover:text-primary-cyan transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Community */}
          <div>
            <h3 className="text-lg font-semibold text-primary-white mb-4">Community</h3>
            <ul className="space-y-2">
              {['Contribute', 'Validate', 'Learn', 'Partner'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-primary-white/70 hover:text-primary-cyan transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-primary-cyan/20 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-primary-white/60 text-sm">
            © 2025 AfriVerse. Built for BGI25 Hackathon.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            {[Github, Twitter, Mail].map((Icon, index) => (
              <a
                key={index}
                href="#"
                className="text-primary-white/60 hover:text-primary-cyan transition-colors"
              >
                <Icon className="w-5 h-5" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}