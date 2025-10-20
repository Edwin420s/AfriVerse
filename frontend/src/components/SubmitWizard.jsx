'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Mic, 
  Upload, 
  FileText, 
  Users, 
  Shield, 
  CheckCircle, 
  ArrowRight, 
  ArrowLeft,
  Type,
  Globe
} from 'lucide-react'
import VoiceRecorder from './VoiceRecorder'
import ConsentModal from './ConsentModal'

const steps = [
  { id: 'type', title: 'Content Type', icon: <Type className="w-5 h-5" /> },
  { id: 'upload', title: 'Upload', icon: <Upload className="w-5 h-5" /> },
  { id: 'details', title: 'Details', icon: <FileText className="w-5 h-5" /> },
  { id: 'consent', title: 'Consent', icon: <Shield className="w-5 h-5" /> },
  { id: 'review', title: 'Review', icon: <CheckCircle className="w-5 h-5" /> },
]

export default function SubmitWizard() {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({
    type: '',
    file: null,
    title: '',
    description: '',
    community: '',
    language: '',
    license: '',
    consent: false
  })
  const [isConsentOpen, setIsConsentOpen] = useState(false)

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    // Submit logic here
    console.log('Submitting:', formData)
  }

  const contentTypes = [
    {
      id: 'story',
      title: 'Oral Story',
      description: 'Folktales, legends, or historical narratives',
      icon: <Mic className="w-8 h-8" />
    },
    {
      id: 'medicine',
      title: 'Medicinal Knowledge',
      description: 'Traditional healing practices and plant uses',
      icon: <CheckCircle className="w-8 h-8" />
    },
    {
      id: 'practice',
      title: 'Cultural Practice',
      description: 'Rituals, ceremonies, or traditional skills',
      icon: <Users className="w-8 h-8" />
    },
    {
      id: 'proverb',
      title: 'Proverb/Wisdom',
      description: 'Traditional sayings and wisdom teachings',
      icon: <Globe className="w-8 h-8" />
    }
  ]

  const languages = [
    'Swahili', 'English', 'Kikuyu', 'Luo', 'Yoruba', 'Zulu', 
    'Amharic', 'Igbo', 'Oromo', 'Shona', 'Other'
  ]

  const licenses = [
    {
      id: 'cc-by-nc',
      title: 'CC BY-NC',
      description: 'Attribution-NonCommercial - Free to share with credit'
    },
    {
      id: 'community',
      title: 'Community Use',
      description: 'Restricted to community members and researchers'
    },
    {
      id: 'research',
      title: 'Research Only',
      description: 'Available only for academic and research purposes'
    }
  ]

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <h3 className="text-2xl font-semibold text-primary-white mb-6">
              What type of knowledge are you sharing?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {contentTypes.map((type) => (
                <motion.button
                  key={type.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    updateFormData('type', type.id)
                    nextStep()
                  }}
                  className={`p-6 rounded-xl border-2 text-left transition-all duration-200 ${
                    formData.type === type.id
                      ? 'border-primary-cyan bg-primary-cyan/10'
                      : 'border-primary-cyan/20 hover:border-primary-cyan/40'
                  }`}
                >
                  <div className="text-primary-gold mb-3">
                    {type.icon}
                  </div>
                  <h4 className="text-lg font-semibold text-primary-white mb-2">
                    {type.title}
                  </h4>
                  <p className="text-primary-white/70 text-sm">
                    {type.description}
                  </p>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )

      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <h3 className="text-2xl font-semibold text-primary-white mb-6">
              How would you like to share?
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Voice Recording */}
              <div className="border-2 border-primary-cyan/20 rounded-xl p-6">
                <div className="text-primary-gold mb-4">
                  <Mic className="w-12 h-12" />
                </div>
                <h4 className="text-lg font-semibold text-primary-white mb-2">
                  Record Voice
                </h4>
                <p className="text-primary-white/70 text-sm mb-4">
                  Record audio directly in your native language
                </p>
                <VoiceRecorder 
                  onRecordingComplete={(audioBlob) => {
                    updateFormData('file', audioBlob)
                    nextStep()
                  }}
                />
              </div>

              {/* File Upload */}
              <div className="border-2 border-primary-cyan/20 rounded-xl p-6">
                <div className="text-primary-gold mb-4">
                  <Upload className="w-12 h-12" />
                </div>
                <h4 className="text-lg font-semibold text-primary-white mb-2">
                  Upload File
                </h4>
                <p className="text-primary-white/70 text-sm mb-4">
                  Upload audio, video, or text files
                </p>
                <input
                  type="file"
                  accept="audio/*,video/*,.txt,.doc,.docx"
                  onChange={(e) => {
                    updateFormData('file', e.target.files[0])
                    nextStep()
                  }}
                  className="w-full p-3 border border-primary-cyan/20 rounded-lg bg-primary-navy/50 text-primary-white"
                />
              </div>
            </div>
          </motion.div>
        )

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <h3 className="text-2xl font-semibold text-primary-white mb-6">
              Tell us more about this knowledge
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-primary-white mb-2">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => updateFormData('title', e.target.value)}
                  className="w-full p-3 border border-primary-cyan/20 rounded-lg bg-primary-navy/50 text-primary-white"
                  placeholder="Give this knowledge a meaningful title"
                />
              </div>

              <div>
                <label className="block text-primary-white mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => updateFormData('description', e.target.value)}
                  rows={4}
                  className="w-full p-3 border border-primary-cyan/20 rounded-lg bg-primary-navy/50 text-primary-white"
                  placeholder="Provide context, background, or additional details..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-primary-white mb-2">Community/Region</label>
                  <input
                    type="text"
                    value={formData.community}
                    onChange={(e) => updateFormData('community', e.target.value)}
                    className="w-full p-3 border border-primary-cyan/20 rounded-lg bg-primary-navy/50 text-primary-white"
                    placeholder="e.g., Kikuyu, Luo, Maasai..."
                  />
                </div>

                <div>
                  <label className="block text-primary-white mb-2">Language</label>
                  <select
                    value={formData.language}
                    onChange={(e) => updateFormData('language', e.target.value)}
                    className="w-full p-3 border border-primary-cyan/20 rounded-lg bg-primary-navy/50 text-primary-white"
                  >
                    <option value="">Select language</option>
                    {languages.map(lang => (
                      <option key={lang} value={lang}>{lang}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </motion.div>
        )

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <h3 className="text-2xl font-semibold text-primary-white mb-6">
              Usage Rights & Consent
            </h3>

            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-semibold text-primary-white mb-4">
                  Choose License
                </h4>
                <div className="space-y-3">
                  {licenses.map((license) => (
                    <label key={license.id} className="flex items-start space-x-3 p-4 border border-primary-cyan/20 rounded-lg hover:border-primary-cyan/40 transition-colors cursor-pointer">
                      <input
                        type="radio"
                        name="license"
                        value={license.id}
                        checked={formData.license === license.id}
                        onChange={(e) => updateFormData('license', e.target.value)}
                        className="mt-1 text-primary-cyan"
                      />
                      <div>
                        <div className="font-semibold text-primary-white">
                          {license.title}
                        </div>
                        <div className="text-sm text-primary-white/70">
                          {license.description}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="border-t border-primary-cyan/20 pt-6">
                <label className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    checked={formData.consent}
                    onChange={(e) => updateFormData('consent', e.target.checked)}
                    className="mt-1 text-primary-cyan"
                  />
                  <div>
                    <div className="font-semibold text-primary-white">
                      I understand and consent
                    </div>
                    <div className="text-sm text-primary-white/70">
                      I have the right to share this knowledge and understand how it will be used
                      to preserve cultural heritage through AGI systems.
                    </div>
                  </div>
                </label>
              </div>

              <button
                onClick={() => setIsConsentOpen(true)}
                className="text-primary-cyan hover:text-primary-cyan/80 underline text-sm"
              >
                Read full consent agreement
              </button>
            </div>
          </motion.div>
        )

      case 4:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <h3 className="text-2xl font-semibold text-primary-white mb-6">
              Review Your Submission
            </h3>

            <div className="bg-primary-navy/30 rounded-xl p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-primary-white/70 text-sm">Type</div>
                  <div className="text-primary-white font-semibold capitalize">
                    {formData.type}
                  </div>
                </div>
                <div>
                  <div className="text-primary-white/70 text-sm">Language</div>
                  <div className="text-primary-white font-semibold">
                    {formData.language}
                  </div>
                </div>
                <div>
                  <div className="text-primary-white/70 text-sm">Community</div>
                  <div className="text-primary-white font-semibold">
                    {formData.community}
                  </div>
                </div>
                <div>
                  <div className="text-primary-white/70 text-sm">License</div>
                  <div className="text-primary-white font-semibold">
                    {formData.license}
                  </div>
                </div>
              </div>

              {formData.title && (
                <div>
                  <div className="text-primary-white/70 text-sm">Title</div>
                  <div className="text-primary-white font-semibold">
                    {formData.title}
                  </div>
                </div>
              )}

              {formData.description && (
                <div>
                  <div className="text-primary-white/70 text-sm">Description</div>
                  <div className="text-primary-white">
                    {formData.description}
                  </div>
                </div>
              )}
            </div>

            <div className="bg-primary-cyan/10 border border-primary-cyan/20 rounded-xl p-4">
              <div className="flex items-center space-x-2 text-primary-cyan mb-2">
                <Shield className="w-4 h-4" />
                <span className="font-semibold">Next Steps</span>
              </div>
              <p className="text-primary-white/70 text-sm">
                After submission, our AI agents will process your contribution and community 
                validators will review it. You'll be notified once it's added to the knowledge graph.
              </p>
            </div>
          </motion.div>
        )

      default:
        return null
    }
  }

  return (
    <div className="bg-primary-navy/30 rounded-2xl border border-primary-cyan/20 p-6 md:p-8">
      {/* Progress Steps */}
      <div className="flex justify-between items-center mb-8">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-200 ${
                  index === currentStep
                    ? 'border-primary-cyan bg-primary-cyan text-primary-navy'
                    : index < currentStep
                    ? 'border-primary-gold bg-primary-gold text-primary-navy'
                    : 'border-primary-cyan/30 text-primary-white/50'
                }`}
              >
                {index < currentStep ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  step.icon
                )}
              </div>
              <span
                className={`ml-2 font-medium hidden md:block ${
                  index === currentStep
                    ? 'text-primary-cyan'
                    : index < currentStep
                    ? 'text-primary-gold'
                    : 'text-primary-white/50'
                }`}
              >
                {step.title}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`h-0.5 w-8 mx-2 ${
                  index < currentStep ? 'bg-primary-gold' : 'bg-primary-cyan/30'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <div className="min-h-[400px]">
        {renderStep()}
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center pt-8 border-t border-primary-cyan/20">
        <button
          onClick={prevStep}
          disabled={currentStep === 0}
          className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-all ${
            currentStep === 0
              ? 'text-primary-white/30 cursor-not-allowed'
              : 'text-primary-white hover:bg-primary-navy/50'
          }`}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        {currentStep === steps.length - 1 ? (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSubmit}
            disabled={!formData.consent || !formData.license}
            className={`flex items-center space-x-2 px-8 py-3 rounded-lg font-semibold transition-all ${
              !formData.consent || !formData.license
                ? 'bg-primary-white/20 text-primary-white/50 cursor-not-allowed'
                : 'gold-gradient text-primary-navy hover:shadow-lg'
            }`}
          >
            <span>Submit Wisdom</span>
            <CheckCircle className="w-5 h-5" />
          </motion.button>
        ) : (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={nextStep}
            className="flex items-center space-x-2 px-8 py-3 rounded-lg font-semibold gold-gradient text-primary-navy"
          >
            <span>Continue</span>
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        )}
      </div>

      <ConsentModal 
        isOpen={isConsentOpen}
        onClose={() => setIsConsentOpen(false)}
        onAgree={() => {
          updateFormData('consent', true)
          setIsConsentOpen(false)
        }}
      />
    </div>
  )
}