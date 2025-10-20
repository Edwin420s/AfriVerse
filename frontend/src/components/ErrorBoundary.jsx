'use client'
import { Component } from 'react'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-primary-navy flex items-center justify-center px-4">
          <div className="bg-primary-navy/30 border border-primary-cyan/20 rounded-2xl p-8 max-w-md w-full text-center">
            <div className="text-primary-gold mb-4">
              <AlertTriangle className="w-16 h-16 mx-auto" />
            </div>
            <h2 className="text-2xl font-cormorant font-bold text-primary-white mb-4">
              Something went wrong
            </h2>
            <p className="text-primary-white/70 mb-6">
              We apologize for the inconvenience. Please try refreshing the page or return home.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => window.location.reload()}
                className="w-full flex items-center justify-center space-x-2 gold-gradient text-primary-navy py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Refresh Page</span>
              </button>
              <button
                onClick={() => window.location.href = '/'}
                className="w-full flex items-center justify-center space-x-2 border border-primary-cyan text-primary-cyan py-3 rounded-lg font-semibold hover:bg-primary-cyan/10 transition-colors"
              >
                <Home className="w-4 h-4" />
                <span>Return Home</span>
              </button>
            </div>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-6 text-left">
                <summary className="text-primary-white/50 text-sm cursor-pointer">
                  Error Details (Development)
                </summary>
                <pre className="text-xs text-primary-white/50 mt-2 p-2 bg-primary-navy/50 rounded overflow-auto">
                  {this.state.error.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      )
    }

    return this.props.children
  }
}